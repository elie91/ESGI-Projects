<?php

namespace App\Controller\User;

use App\Entity\User;
use App\Service\Mailer;
use Doctrine\Persistence\ManagerRegistry;
use SendinBlue\Client\ApiException;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Generator\UrlGeneratorInterface;
use Symfony\Component\Security\Csrf\TokenGenerator\TokenGeneratorInterface;

class ResetPasswordController
{
  private ManagerRegistry $manager;
  private Mailer $mailer;
  private TokenGeneratorInterface $tokenGenerator;
  private UrlGeneratorInterface $urlGenerator;

  public function __construct(ManagerRegistry $manager, TokenGeneratorInterface $tokenGenerator, Mailer $mailer, UrlGeneratorInterface $urlGenerator)
  {
    $this->mailer = $mailer;
    $this->manager = $manager;
    $this->tokenGenerator = $tokenGenerator;
    $this->urlGenerator = $urlGenerator;
  }

  /**
   * @param User $data
   * @return JsonResponse
   */
  public function __invoke(User $data): JsonResponse
  {

    $email = $data->getEmail();

    /** @var User $user */
    $user = $this->manager->getManager()->getRepository(User::class)->findOneBy([
      "email" => $email
    ]);

    if (!$user) {
      return new JsonResponse(["violations" => [
        [
          "propertyPath" => "email",
          "message" => "security.errors.notFound"
        ]
      ]],
        JsonResponse::HTTP_BAD_REQUEST
      );
    }

    $generatedToken = $this->tokenGenerator->generateToken();

    $user->setToken($generatedToken);

    try {
      $this->mailer
        ->sendResetPassword([
          "contact" => [
            "EMAIL" => $user->getEmail(),
            "FIRSTNAME" => $user->getFirstname()
          ],
          "response" => [
            "URL" => $_ENV["CLIENT_URL"] . "/reset-password/" . $generatedToken,
            "ADMIN" => false
          ]
        ]);
    } catch (ApiException $e) {
      return new JsonResponse(
        ["violations" => [
          [
            "propertyPath" => "general",
            "message" => "mail.errors.exception"
          ]
        ]],
        JsonResponse::HTTP_BAD_REQUEST
      );
    }

    $this->manager->getManager()->flush();

    return new JsonResponse(null, 200);
  }
}
