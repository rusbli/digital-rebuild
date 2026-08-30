<?php
declare(strict_types=1);

const CONTACT_RECIPIENT = 'hello@digitalrebuild.co.uk';
const CONTACT_SENDER = 'hello@digitalrebuild.co.uk';

function redirect_to_form(string $result): void
{
    header('Location: /?form=' . rawurlencode($result) . '#contact', true, 303);
    exit;
}

function field(string $name): string
{
    $value = $_POST[$name] ?? '';
    return is_string($value) ? trim($value) : '';
}

function clean_header_value(string $value): string
{
    return trim(str_replace(["\r", "\n"], ' ', $value));
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('Allow: POST');
    http_response_code(405);
    exit('Method not allowed');
}

// Bots commonly fill hidden fields. Return success without sending so they do
// not learn that the submission was rejected.
if (field('company_website') !== '') {
    redirect_to_form('sent');
}

$name = clean_header_value(field('name'));
$businessName = clean_header_value(field('business_name'));
$email = clean_header_value(field('email'));
$phone = clean_header_value(field('phone'));
$currentWebsite = field('current_website');
$message = field('message');

$valid = $name !== ''
    && strlen($name) <= 100
    && $businessName !== ''
    && strlen($businessName) <= 150
    && filter_var($email, FILTER_VALIDATE_EMAIL) !== false
    && strlen($email) <= 254
    && strlen($phone) <= 50
    && strlen($currentWebsite) <= 500
    && $message !== ''
    && strlen($message) <= 5000;

if ($currentWebsite !== '' && filter_var($currentWebsite, FILTER_VALIDATE_URL) === false) {
    $valid = false;
}

if (!$valid) {
    redirect_to_form('error');
}

$subject = 'Website enquiry from ' . $name;
$body = implode("\r\n", [
    'New website check request',
    '-------------------------',
    'Name: ' . $name,
    'Business: ' . $businessName,
    'Email: ' . $email,
    'Phone: ' . ($phone !== '' ? $phone : 'Not provided'),
    'Current website: ' . ($currentWebsite !== '' ? $currentWebsite : 'Not provided'),
    '',
    'Message:',
    $message,
]);

$headers = [
    'From: Digital Rebuild Website <' . CONTACT_SENDER . '>',
    'Reply-To: ' . $email,
    'Content-Type: text/plain; charset=UTF-8',
    'X-Mailer: PHP/' . PHP_VERSION,
];

$sent = mail(
    CONTACT_RECIPIENT,
    $subject,
    $body,
    implode("\r\n", $headers),
    '-f' . CONTACT_SENDER
);

if (!$sent) {
    error_log('Digital Rebuild contact form: mail() rejected the message.');
    redirect_to_form('error');
}

redirect_to_form('sent');