<?php
namespace App\Service;

use Symfony\Bridge\Twig\Mime\TemplatedEmail;
use Symfony\Component\Mailer\Exception\TransportExceptionInterface;
use Symfony\Component\Mailer\MailerInterface;
use Symfony\Component\Mime\Address;

class NotificationService
{
    private $mailer;

    public function __construct(MailerInterface $mailer)
    {
        $this->mailer = $mailer;
    }

    /**
     * @param string $to
     * @param string $subject
     * @param string|null $template
     * @param array|null $args
     * @param string|null $path
     * @throws TransportExceptionInterface
     */
    public function sendEmail(string $to, string $subject, string  $template = null, array $args = null, string $path = null)
    {
        $email = (new TemplatedEmail())
            ->from(isset($_ENV['EMAIL']) ? Address::fromString('Symfony <'.$_ENV['EMAIL'].'>') : 'Symfony <noreply@thomascoichot.fr>')
            ->to($to)
            ->subject($subject)
            ->htmlTemplate($template ? $template : 'emails/default.html.twig');

        if (!empty($args)) {
            $email->context($args);
        }

        if(!empty($path)) {
            $email->attachFromPath($path);
        }

        $this->mailer->send($email);
    }
}