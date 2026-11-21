#!/usr/bin/env python3
"""Publish the next supplied Digital Rebuild draft and verify its live deployment."""
from datetime import datetime
import fcntl
import json
import os
from pathlib import Path
import re
import subprocess
import time
import urllib.request
from zoneinfo import ZoneInfo

ROOT = Path('/opt/data/digital-rebuild-site')
LOCK = Path('/opt/data/digital-rebuild-publish.lock')
ORIGIN = 'https://www.digitalrebuild.co.uk'
DEPLOY_RUNS = 'https://api.github.com/repos/rusbli/digital-rebuild/actions/runs'


def git_environment():
    return {
        **os.environ,
        'GH_CONFIG_DIR': '/opt/data/home/.config/gh',
        'GIT_CONFIG_COUNT': '2',
        'GIT_CONFIG_KEY_0': 'credential.https://github.com.helper',
        'GIT_CONFIG_VALUE_0': '',
        'GIT_CONFIG_KEY_1': 'credential.https://github.com.helper',
        'GIT_CONFIG_VALUE_1': '!/opt/data/home/.local/bin/gh auth git-credential',
        'GIT_TERMINAL_PROMPT': '0',
    }


def run(*args, timeout=180):
    process = subprocess.run(args, cwd=ROOT, text=True, capture_output=True, timeout=timeout,
                             env=git_environment() if args[0] == 'git' else None)
    if process.returncode:
        raise RuntimeError(' '.join(args) + '\n' + (process.stdout + process.stderr)[-3000:])
    return process.stdout.rstrip('\n')


def queue():
    return json.loads(run(
        'node', '--input-type=module', '-e',
        'import {loadContent} from "./scripts/content.mjs"; const c=loadContent(); '
        'console.log(JSON.stringify({articles:c.articles.map(a=>({slug:a.slug,title:a.title})),'
        'drafts:c.drafts.map(a=>({slug:a.slug,scheduled:a.scheduled}))}));'))


def api_headers():
    headers = {'Accept': 'application/vnd.github+json', 'User-Agent': 'Digital-Rebuild-Publisher'}
    # Read the existing git credential in memory and keep it out of output.
    result = subprocess.run(
        ['git', 'credential', 'fill'], cwd=ROOT, input='protocol=https\nhost=github.com\n\n',
        text=True, capture_output=True, timeout=20, env=git_environment())
    if result.returncode == 0:
        fields = dict(line.split('=', 1) for line in result.stdout.splitlines() if '=' in line)
        if fields.get('password'):
            headers['Authorization'] = 'Bearer ' + fields['password']
    return headers


def verify_deployment(sha, url, slug):
    headers = api_headers()
    deadline = time.monotonic() + 360
    matched = None
    while time.monotonic() < deadline:
        request = urllib.request.Request(DEPLOY_RUNS + '?event=push&head_sha=' + sha + '&per_page=20',
                                         headers=headers)
        with urllib.request.urlopen(request, timeout=25) as response:
            runs = json.load(response)['workflow_runs']
        matched = next((row for row in runs if row['name'] == 'Deploy website to IONOS'
                        and row['head_sha'] == sha and row['event'] == 'push'), None)
        if matched and matched['status'] == 'completed':
            break
        time.sleep(min(15, max(0, deadline - time.monotonic())))
    if not matched or matched.get('conclusion') != 'success':
        detail = matched['html_url'] if matched else 'no deployment found for ' + sha
        raise RuntimeError('Deployment has not been verified. ' + detail)
    with urllib.request.urlopen(url + '?deployment=' + sha, timeout=30) as response:
        if response.status != 200 or slug not in response.read().decode():
            raise RuntimeError('Live article verification failed. ' + url)
    return matched['html_url']


def publish(report):
    if run('git', 'status', '--porcelain'):
        raise RuntimeError('Working tree has uncommitted changes. Inspect the checkout before publishing.')
    run('git', 'checkout', 'main')
    run('git', 'pull', '--ff-only')
    local, upstream = run('git', 'rev-parse', 'HEAD', 'origin/main').splitlines()
    if local != upstream:
        raise RuntimeError('Local main has unpublished commits. Reconcile them before continuing the queue.')

    # Sync first, so drafts handed over to GitHub are picked up even after a long idle period.
    drafts = ROOT / 'content/drafts'
    has_drafts = any(path.is_file() and path.name != 'README.md' for path in drafts.glob('*.md'))
    if not has_drafts:
        report.update(published='Nothing published. The supplied draft queue is empty.',
                      queue='0 drafts. Add the next Claude batch to content/drafts on main.',
                      deploy='Not needed')
        return

    run('git', 'push', '--dry-run', 'origin', 'HEAD:refs/heads/main')
    run('npm', 'ci', '--no-audit', '--no-fund')
    result = run('npm', 'run', 'publish-next')
    match = re.search(r'^PUBLISHED: ([a-z0-9]+(?:-[a-z0-9]+)*)$', result, re.M)
    if not match:
        status = re.search(r'^NOTHING PUBLISHED: (.+)$', result, re.M)
        if not status:
            raise RuntimeError('Unexpected response from publish-next.')
        report.update(published='Nothing published. ' + status.group(1), deploy='Not needed')
    else:
        slug = match.group(1)
        draft = f'content/drafts/{slug}.md'
        article = f'content/articles/{slug}.md'
        expected = {f' D {draft}', f'?? {article}'}

        def changes():
            return set(run('git', 'status', '--porcelain=v1', '--no-renames',
                           '--untracked-files=all').splitlines())

        if changes() != expected:
            raise RuntimeError('Unexpected checkout changes after moving the draft. Inspect before committing.')
        original_article = (ROOT / article).read_bytes()
        try:
            run('npm', 'run', 'build')
        except Exception:
            if changes() == expected and (ROOT / article).read_bytes() == original_article:
                run('git', 'restore', '--', draft)
                (ROOT / article).unlink()
            raise
        if changes() != expected or (ROOT / article).read_bytes() != original_article:
            raise RuntimeError('Checkout changed during the build. Inspect before committing.')
        url = ORIGIN + f'/blog/{slug}/'
        title = next(item['title'] for item in queue()['articles'] if item['slug'] == slug)
        run('git', 'add', '--', draft, article)
        run('git', 'commit', '-m', 'content: publish ' + slug)
        sha = run('git', 'rev-parse', 'HEAD')
        report['published'] = f'{slug} was committed. Live publication awaits verification.'
        run('git', 'push', 'origin', 'main')
        remote = run('git', 'ls-remote', 'origin', 'refs/heads/main').split()
        if not remote or remote[0] != sha:
            raise RuntimeError('Remote main does not match the article commit.')
        deployment = verify_deployment(sha, url, slug)
        report.update(published=f'{title} {url}', deploy=f'Verified on IONOS. {deployment}')

    remaining = queue()['drafts']
    if remaining:
        last = max(draft['scheduled'] for draft in remaining)
        report['queue'] = f'{len(remaining)} drafts, covering through {last}.'
        if len(remaining) <= 3:
            report['queue'] += ' Add the next Claude batch to content/drafts on main.'
    else:
        report['queue'] = '0 drafts. Add the next Claude batch to content/drafts on main.'


def main():
    with LOCK.open('a') as lock:
        try:
            fcntl.flock(lock, fcntl.LOCK_EX | fcntl.LOCK_NB)
        except BlockingIOError:
            print('Digital Rebuild publication is already running.')
            return 0

        report = {'published': 'Nothing published.', 'queue': 'Unavailable', 'deploy': 'Not needed'}
        failed = False
        try:
            publish(report)
        except Exception as error:
            report['deploy'] = 'Problem: ' + str(error)
            failed = True

        print('Website article report, ' + datetime.now(ZoneInfo('Europe/London')).strftime('%d %B %Y'))
        print('Published: ' + report['published'])
        print('Queue: ' + report['queue'])
        print('Deploy: ' + report['deploy'])
        return int(failed)


if __name__ == '__main__':
    raise SystemExit(main())
