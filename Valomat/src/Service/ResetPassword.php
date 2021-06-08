<?php

namespace App\Service;

use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Routing\Generator\UrlGeneratorInterface;
use Symfony\Component\Security\Csrf\TokenGenerator\TokenGeneratorInterface;
use Symfony\Contracts\Translation\TranslatorInterface;

class ResetPassword
{
    private $em;
    private $tokenGenerator;
    private $router;
    private $notification;
    private $translator;

    public function __construct(EntityManagerInterface $em, TokenGeneratorInterface $tokenGenerator,UrlGeneratorInterface $router, NotificationService $notification, TranslatorInterface $translator)
    {
        $this->em = $em;
        $this->tokenGenerator = $tokenGenerator;
        $this->router = $router;
        $this->notification = $notification;
        $this->translator = $translator;
    }

    public function sendMail($request)
    {
        $email = $request->request->get('email');
        $user = $this->em->getRepository(User::class)->findOneBy([
            'email' => $email
        ]);
        if (!$user) {
            return false;
        }
        $token = $this->tokenGenerator->generateToken();
        $user->setResetToken($token);
        $this->em->flush();
        $linkToReset = $this->router->generate('security_reset_password', ['token' => $token], UrlGeneratorInterface::ABSOLUTE_URL);

        $this->notification->sendEmail(
            $_ENV['VALOMAT_EMAIL'],
            $user->getEmail(),
            $this->translator->trans('mail.reset.subject'),
            "email/password_reset.html.twig",
            ['reset_link' => $linkToReset]
        );
        return true;
    }

    public function updatePassword(User $password, string $token)
    {
        $user = $this->em->getRepository(User::class)->findOneBy([
            'reset_token' => $token
        ]);
        if (!$user){
            return false;
        }
        $user->setResetToken(null);
        $user->setPlainPassword($password->getPlainPassword());
        $this->em->flush();
        return true;
    }
}