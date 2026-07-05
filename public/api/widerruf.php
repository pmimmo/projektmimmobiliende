<?php

declare(strict_types=1);

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;

const ERROR_MESSAGE = 'Der Widerruf konnte nicht versendet werden. Bitte versuchen Sie es später erneut oder kontaktieren Sie uns direkt per E-Mail.';

$autoloadPath = __DIR__ . '/vendor/autoload.php';

if (is_readable($autoloadPath)) {
    require $autoloadPath;
}

function starts_with(string $haystack, string $needle): bool
{
    return $needle === '' || strpos($haystack, $needle) === 0;
}

function ends_with(string $haystack, string $needle): bool
{
    return $needle === '' || substr($haystack, -strlen($needle)) === $needle;
}

function contains(string $haystack, string $needle): bool
{
    return $needle === '' || strpos($haystack, $needle) !== false;
}

function base_url(): string
{
    $scriptName = $_SERVER['SCRIPT_NAME'] ?? '/api/widerruf.php';
    $base = preg_replace('#api/widerruf\.php$#', '', $scriptName);

    return $base ?: '/';
}

function redirect_to(string $path): void
{
    header('Location: ' . base_url() . ltrim($path, '/'), true, 303);
    exit;
}

function fail(int $statusCode = 400): void
{
    http_response_code($statusCode);
    header('Content-Type: text/plain; charset=utf-8');
    echo ERROR_MESSAGE;
    exit;
}

function clean_text(string $value, int $maxLength = 500): string
{
    $value = trim(strip_tags($value));
    $value = preg_replace('/[\x00-\x1F\x7F]+/u', ' ', $value) ?? '';
    $value = preg_replace('/\s+/u', ' ', $value) ?? '';

    if (function_exists('mb_substr')) {
        return mb_substr($value, 0, $maxLength);
    }

    return substr($value, 0, $maxLength);
}

function read_env_file(string $path): array
{
    if (!is_readable($path)) {
        return [];
    }

    $values = [];
    $lines = file($path, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);

    if ($lines === false) {
        return [];
    }

    foreach ($lines as $line) {
        $line = trim($line);

        if ($line === '' || starts_with($line, '#') || !contains($line, '=')) {
            continue;
        }

        [$key, $value] = explode('=', $line, 2);
        $key = trim($key);
        $value = trim($value);

        if (
            (starts_with($value, '"') && ends_with($value, '"'))
            || (starts_with($value, "'") && ends_with($value, "'"))
        ) {
            $value = substr($value, 1, -1);
        }

        if ($key !== '') {
            $values[$key] = $value;
        }
    }

    return $values;
}

function load_config(): array
{
    $documentRoot = $_SERVER['DOCUMENT_ROOT'] ?? '';
    $candidates = [];

    $explicitPath = getenv('WIDERRUF_ENV_PATH');
    if (is_string($explicitPath) && $explicitPath !== '') {
        $candidates[] = $explicitPath;
    }

    if ($documentRoot !== '') {
        $candidates[] = dirname($documentRoot) . '/.env';
    }

    $candidates[] = dirname(__DIR__, 3) . '/.env';

    foreach (array_unique($candidates) as $candidate) {
        $env = read_env_file($candidate);

        if ($env !== []) {
            return $env;
        }
    }

    return [];
}

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    http_response_code(405);
    header('Allow: POST');
    header('Content-Type: text/plain; charset=utf-8');
    echo 'Method Not Allowed';
    exit;
}

if (trim((string) ($_POST['website'] ?? '')) !== '') {
    redirect_to('widerruf/danke/');
}

$firstName = clean_text((string) ($_POST['first_name'] ?? ''), 100);
$lastName = clean_text((string) ($_POST['last_name'] ?? ''), 100);
$email = filter_var(trim((string) ($_POST['email'] ?? '')), FILTER_VALIDATE_EMAIL);
$objectReference = clean_text((string) ($_POST['object_reference'] ?? ''), 300);
$contractDate = clean_text((string) ($_POST['contract_date'] ?? ''), 100);
$comment = clean_text((string) ($_POST['comment'] ?? ''), 2000);
$fullName = trim($firstName . ' ' . $lastName);
$submittedAt = date('c');
$submittedAtReadable = date('d.m.Y H:i') . ' Uhr';

if ($firstName === '' || $lastName === '' || $email === false || $objectReference === '') {
    fail();
}

if (!class_exists(PHPMailer::class)) {
    fail(500);
}

$config = load_config();
$requiredKeys = ['SMTP_HOST', 'SMTP_PORT', 'SMTP_SECURE', 'SMTP_USER', 'SMTP_PASS', 'MAIL_TO', 'MAIL_FROM'];

foreach ($requiredKeys as $key) {
    if (!isset($config[$key]) || trim($config[$key]) === '') {
        fail(500);
    }
}

$smtpSecure = filter_var($config['SMTP_SECURE'], FILTER_VALIDATE_BOOLEAN)
    ? PHPMailer::ENCRYPTION_SMTPS
    : PHPMailer::ENCRYPTION_STARTTLS;

$mail = new PHPMailer(true);

try {
    $mail->isSMTP();
    $mail->Host = $config['SMTP_HOST'];
    $mail->SMTPAuth = true;
    $mail->Username = $config['SMTP_USER'];
    $mail->Password = $config['SMTP_PASS'];
    $mail->Port = (int) $config['SMTP_PORT'];
    $mail->SMTPSecure = $smtpSecure;
    $mail->CharSet = PHPMailer::CHARSET_UTF8;
    $mail->SMTPDebug = SMTP::DEBUG_OFF;

    $mail->setFrom($config['MAIL_FROM'], 'Projekt M Immobilien GmbH');
    $mail->addAddress($config['MAIL_TO']);
    $mail->addReplyTo($email, $fullName);

    $mail->Subject = 'Widerruf Objekt ' . $objectReference;
    $mail->Body = implode("\n", [
        'Neuer Widerruf über das Widerrufsformular',
        '',
        'Vorname: ' . $firstName,
        'Name: ' . $lastName,
        'E-Mail: ' . $email,
        'Objektadresse: ' . $objectReference,
        'Vertragsdatum: ' . ($contractDate !== '' ? $contractDate : 'nicht angegeben'),
        'Kommentar: ' . ($comment !== '' ? $comment : 'nicht angegeben'),
        '',
        'Zeitpunkt: ' . $submittedAtReadable,
    ]);

    $mail->send();

    try {
        $mail->clearAddresses();
        $mail->clearReplyTos();

        $mail->addAddress($email, $fullName);
        $mail->Subject = 'Eingangsbestätigung Ihres Widerrufs – Projekt M Immobilien GmbH';
        $mail->isHTML(true);
        $mail->Body = implode("\n", [
            '<p>Wir bestätigen den Eingang Ihrer Nachricht über unser Widerrufsformular.</p>',
            '<p>Ihre Angaben:</p>',
            '<p>',
            'Vorname: ' . htmlspecialchars($firstName, ENT_QUOTES, 'UTF-8') . '<br>',
            'Name: ' . htmlspecialchars($lastName, ENT_QUOTES, 'UTF-8') . '<br>',
            'E-Mail: ' . htmlspecialchars($email, ENT_QUOTES, 'UTF-8') . '<br>',
            'Objektadresse: ' . htmlspecialchars($objectReference, ENT_QUOTES, 'UTF-8') . '<br>',
            'Vertragsdatum: ' . htmlspecialchars($contractDate !== '' ? $contractDate : 'nicht angegeben', ENT_QUOTES, 'UTF-8') . '<br>',
            'Kommentar: ' . htmlspecialchars($comment !== '' ? $comment : 'nicht angegeben', ENT_QUOTES, 'UTF-8'),
            '</p>',
            '<p>Zeitpunkt der Übermittlung:<br>' . htmlspecialchars($submittedAtReadable, ENT_QUOTES, 'UTF-8') . '</p>',
            '<p>Dies ist eine automatische Eingangsbestätigung.</p>',
            '<p>--<br>',
            'Projekt M Immobilien GmbH<br>',
            'Krumbacherstr. 5, 80798 München<br>',
            'Tel. 089 28806768 - Fax 089 28806757<br>',
            'info@pmimmo.de<br>',
            'www.projektmimmobilien.de | <a href="https://projektmimmobilien.de/datenschutz/">Datenschutzerklärung</a><br><br>',
            'Sitz der Gesellschaft: München<br>',
            'Amtsgericht München: HRB 146318<br>',
            'Geschäftsführer: Rüdiger Neuer</p>',
        ]);
        $mail->AltBody = implode("\n", [
            'Wir bestätigen den Eingang Ihrer Nachricht über unser Widerrufsformular.',
            '',
            'Ihre Angaben:',
            '',
            'Vorname: ' . $firstName,
            'Name: ' . $lastName,
            'E-Mail: ' . $email,
            'Objektadresse: ' . $objectReference,
            'Vertragsdatum: ' . ($contractDate !== '' ? $contractDate : 'nicht angegeben'),
            'Kommentar: ' . ($comment !== '' ? $comment : 'nicht angegeben'),
            '',
            'Zeitpunkt der Übermittlung:',
            $submittedAtReadable,
            '',
            'Dies ist eine automatische Eingangsbestätigung.',
            '',
            '--',
            'Projekt M Immobilien GmbH',
            'Krumbacherstr. 5, 80798 München',
            'Tel. 089 28806768 - Fax 089 28806757',
            'info@pmimmo.de',
            'www.projektmimmobilien.de | Datenschutzerklärung: https://projektmimmobilien.de/datenschutz/',
            '',
            'Sitz der Gesellschaft: München',
            'Amtsgericht München: HRB 146318',
            'Geschäftsführer: Rüdiger Neuer',
        ]);

        $mail->send();
    } catch (Throwable) {
        // Die interne Widerrufsmail wurde versendet; die Danke-Seite bleibt erreichbar.
    }

    redirect_to('widerruf/danke/');
} catch (Throwable) {
    fail(500);
}
