<?php

namespace App\Service;

use Symfony\Bridge\Twig\Mime\TemplatedEmail;
use Symfony\Component\Mailer\Exception\TransportExceptionInterface;
use Symfony\Component\Mailer\MailerInterface;

class NotificationService
{
    private $mailer;

    public function __construct(MailerInterface $mailer)
    {
        $this->mailer = $mailer;
    }

    public function sendEmail(string $from, string $to, string $subject, string  $template = null, array $args = null, string $path = null)
    {
        $email = (new TemplatedEmail())
            ->from($from)
            ->to($_ENV['OVERRIDE_EMAIL_TO'] ? $_ENV['OVERRIDE_EMAIL_TO'] : $to)
            ->subject($subject)
            ->htmlTemplate($template ? $template : 'email/test.html.twig');

        if(!empty($path)) {
            $email->attachFromPath($path);
        }

        if (!empty($args)) {
            $email->context($args);
        }

        try {
            $this->mailer->send($email);
        }catch (TransportExceptionInterface $e){
            return false;
        }
        return true;
    }
}