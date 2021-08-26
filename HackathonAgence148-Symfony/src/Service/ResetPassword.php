<?php

namespace App\Service;

use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Mailer\Exception\TransportExceptionInterface;
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

    public function __construct(EntityManagerInterface $em, TokenGeneratorInterface $tokenGenerator, UrlGeneratorInterface $router, NotificationService $notification, TranslatorInterface $translator)
    {
        $this->em = $em;
        $this->tokenGenerator = $tokenGenerator;
        $this->router = $router;
        $this->notification = $notification;
        $this->translator = $translator;
    }

    /**
     * @param $request
     * @return bool
     * @throws TransportExceptionInterface
     */
    public function sendMail($request): bool
    {
        $email = $request->request->get('email');
        $user = $this->em->getRepository(User::class)->findOneBy([
            'email' => $email
        ]);
        if (!$user) {
            return false;
        }
        $token = $this->tokenGenerator->generateToken();
        $user->setToken($token);
        $this->em->flush();
        $link = $this->router->generate('security_reset_password', ['token' => $token], UrlGeneratorInterface::ABSOLUTE_URL);

        $this->notification->sendEmail(
            isset($_ENV['EMAIL_TO']) ? $_ENV['EMAIL_TO'] : $user->getEmail(),
            $this->translator->trans('page.reset.title'),
            "emails/reset-password.html.twig",
            ['link' => $link]
        );
        return true;
    }

    /**
     * @param array $password
     * @param string $token
     * @return bool
     */
    public function updatePassword(array $password, string $token): bool
    {
        $user = $this->em->getRepository(User::class)->findOneBy([
            'token' => $token
        ]);
        if (!$user) {
            return false;
        }
        $user->setToken(null);
        $user->setPlainPassword($password['plainPassword']);
        $this->em->flush();
        return true;
    }
}