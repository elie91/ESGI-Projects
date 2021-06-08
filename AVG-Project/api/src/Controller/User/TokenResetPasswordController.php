<?php

namespace App\Controller\User;

use App\Entity\User;
use App\Service\Mailer;
use Doctrine\Persistence\ManagerRegistry;
use SendinBlue\Client\ApiException;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Routing\Generator\UrlGeneratorInterface;
use Symfony\Component\Security\Core\Encoder\UserPasswordEncoderInterface;
use Symfony\Component\Security\Csrf\TokenGenerator\TokenGeneratorInterface;

class TokenResetPasswordController
{
  private ManagerRegistry $manager;
  private Mailer $mailer;
  private TokenGeneratorInterface $tokenGenerator;
  private UrlGeneratorInterface $urlGenerator;
  private UserPasswordEncoderInterface $encoder;

  public function __construct(ManagerRegistry $manager, TokenGeneratorInterface $tokenGenerator, Mailer $mailer, UrlGeneratorInterface $urlGenerator, UserPasswordEncoderInterface $encoder)
  {
    $this->mailer = $mailer;
    $this->manager = $manager;
    $this->tokenGenerator = $tokenGenerator;
    $this->urlGenerator = $urlGenerator;
    $this->encoder = $encoder;
  }

  /**
   * @param User $data
   * @return JsonResponse
   */
  public function __invoke(User $data)
  {

    /** @var User $user */
    $user = $this->manager->getManager()->getRepository(User::class)->findOneBy([
      "token" => $data->getToken()
    ]);

    if (!$user) {
      return new JsonResponse(["message" => "security.errors.tokenNotFound",],
        JsonResponse::HTTP_BAD_REQUEST
      );
    }

    $encoded = $this->encoder->encodePassword($user, $data->getPlainPassword());
    $user->setPassword($encoded);
    $user->eraseCredentials();

    $user->setToken(null);
    $this->manager->getManager()->flush();

    return new JsonResponse(null, 200);
  }
}
