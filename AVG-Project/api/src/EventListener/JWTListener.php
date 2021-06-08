<?php

namespace App\EventListener;

use ApiPlatform\Core\Api\IriConverterInterface;
use App\Entity\User;
use Lexik\Bundle\JWTAuthenticationBundle\Event\AuthenticationFailureEvent;
use Lexik\Bundle\JWTAuthenticationBundle\Event\AuthenticationSuccessEvent;
use Lexik\Bundle\JWTAuthenticationBundle\Event\JWTCreatedEvent;
use Lexik\Bundle\JWTAuthenticationBundle\Event\JWTExpiredEvent;
use Lexik\Bundle\JWTAuthenticationBundle\Event\JWTInvalidEvent;
use Lexik\Bundle\JWTAuthenticationBundle\Response\JWTAuthenticationFailureResponse;
use Symfony\Component\Security\Core\User\UserInterface;

class JWTListener
{
  private IriConverterInterface $iriConverter;

  public function __construct(IriConverterInterface $iriConverter)
  {
    $this->iriConverter = $iriConverter;
  }

  /**
   * @param JWTCreatedEvent $event
   *
   * @return void
   */
  public function onJWTCreated(JWTCreatedEvent $event)
  {
    /* @var User $user */
    $user = $event->getUser();

    $payload = $event->getData();

    $payload['id'] = $user->getId();
    $payload['@id'] = $this->iriConverter->getIriFromItem($user);
    $payload['email'] = $user->getEmail();
    $payload['lastname'] = $user->getLastname();
    $payload['firstname'] = $user->getFirstname();

    $event->setData($payload);
  }

  /**
   * @param AuthenticationSuccessEvent $event
   */
  public function onAuthenticationSuccessResponse(AuthenticationSuccessEvent $event)
  {
    $data = $event->getData();
    $user = $event->getUser();

    if (!$user instanceof UserInterface) {
      return;
    }

    $data['data'] = [
      'login_check' => [
        'token' => $data['token']
      ]
    ];

    $event->setData($data);
  }

  /**
   * @param AuthenticationFailureEvent $event
   */
  public function onAuthenticationFailureResponse(AuthenticationFailureEvent $event)
  {
    $response = new JWTAuthenticationFailureResponse('security.errors.credentials');

    $event->setResponse($response);
  }

  /**
   * @param JWTInvalidEvent $event
   */
  public function onJWTInvalid(JWTInvalidEvent $event)
  {
    $response = new JWTAuthenticationFailureResponse('security.errors.invalidToken', 403);

    $event->setResponse($response);
  }

  /**
   * @param JWTExpiredEvent $event
   */
  public function onJWTExpired(JWTExpiredEvent $event)
  {
    /** @var JWTAuthenticationFailureResponse $response */
    $response = $event->getResponse();

    $response->setMessage('security.errors.expired');
  }
}
