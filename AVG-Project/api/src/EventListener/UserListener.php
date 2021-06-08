<?php

namespace App\EventListener;

use App\Entity\User;
use App\Service\Mailer;
use SendinBlue\Client\ApiException;
use Doctrine\Persistence\ManagerRegistry;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpKernel\Event\ViewEvent;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;
use Symfony\Component\Security\Core\Encoder\UserPasswordEncoderInterface;
use Symfony\Component\Security\Core\User\UserInterface;
use Symfony\Component\Security\Csrf\TokenGenerator\TokenGeneratorInterface;

class UserListener
{
  private UserPasswordEncoderInterface $encoder;
  private TokenStorageInterface $tokenStorage;
  private TokenGeneratorInterface $tokenGenerator;
  /**
   * @var Mailer
   */
  private Mailer $mailer;
  /**
   * @var ManagerRegistry
   */
  private ManagerRegistry $managerRegistry;

  public function __construct(UserPasswordEncoderInterface $encoder, TokenStorageInterface $tokenStorage, TokenGeneratorInterface $tokenGenerator, Mailer $mailer, ManagerRegistry $managerRegistry)
  {
    $this->encoder = $encoder;
    $this->tokenStorage = $tokenStorage;
    $this->tokenGenerator = $tokenGenerator;
    $this->mailer = $mailer;
    $this->managerRegistry = $managerRegistry;
  }

  /**
   * Persists, updates or delete data return by the controller if applicable.
   *
   * @param ViewEvent $event
   * @return JsonResponse|void
   * @throws \Exception
   */
  public function onKernelView(ViewEvent $event)
  {
    $request = $event->getRequest();

    /* @var User $entity */
    $entity = $event->getControllerResult();
    if (!$entity instanceof UserInterface) {
      return;
    }

    switch ($request->getMethod()) {
      case 'PUT':
        if (!in_array('ROLE_ADMIN', $entity->getRoles()) && $entity->getCurrentPassword() && !$this->encoder->isPasswordValid($entity, $entity->getCurrentPassword())) {
          $response = new JsonResponse(["violations" => [
            [
              "propertyPath" => "currentPassword",
              "message" => "user.errors.currentPassword"
            ]
          ]],
            JsonResponse::HTTP_BAD_REQUEST
          );
          $event->setResponse($response);
        }
        $entity->setUpdatedAt(new \DateTime());
      case 'POST':
        if ($entity->getPlainPassword()) {
          $user = $this->tokenStorage->getToken();
          if ($user && in_array('ROLE_ADMIN', $user->getRoleNames())) {
            $generatedToken = $this->tokenGenerator->generateToken();

            $entity->setToken($generatedToken);

            try {
              $this->mailer
                ->sendResetPassword([
                  "contact" => [
                    "EMAIL" => $entity->getEmail(),
                    "FIRSTNAME" => $entity->getFirstname()
                  ],
                  "response" => [
                    "URL" => $_ENV["CLIENT_URL"] . "/reset-password/" . $generatedToken,
                    "ADMIN" => true,
                  ]
                ]);
            } catch (ApiException $e) {
              $event->setResponse(new JsonResponse(
                ["violations" => [
                  [
                    "propertyPath" => "general",
                    "message" => "mail.errors.exception"
                  ]
                ]],
                JsonResponse::HTTP_BAD_REQUEST
              ));
            }
            $this->managerRegistry->getManager()->flush();
          }
          $encoded = $this->encoder->encodePassword($entity, $entity->getPlainPassword());
          $entity->setPassword($encoded);
          $entity->eraseCredentials();
        }
        break;
      default:
        break;
    }
  }
}
