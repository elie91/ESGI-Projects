<?php


namespace App\EventListener;

use App\Entity\User;
use App\Service\NotificationService;
use Doctrine\Common\EventSubscriber;
use Doctrine\Common\Persistence\Event\LifecycleEventArgs;
use Doctrine\ORM\Events;
use Exception;
use Symfony\Component\Mailer\MailerInterface;
use Symfony\Component\Security\Core\Encoder\UserPasswordEncoderInterface;
use Symfony\Contracts\Translation\TranslatorInterface;

class GeneratePasswordSubscriber implements EventSubscriber
{

    private $encoder;

    private $mailer;

    private $translator;

    public function __construct(UserPasswordEncoderInterface $encoder, MailerInterface $mailer, TranslatorInterface $translator)
    {
        $this->encoder = $encoder;
        $this->mailer = $mailer;
        $this->translator = $translator;
    }

    /**
     * @inheritDoc
     */
    public function getSubscribedEvents()
    {
        return [
            Events::prePersist
        ];
    }

    /**
     * @param LifecycleEventArgs $args
     * @throws Exception
     */
    public function prePersist(LifecycleEventArgs $args)
    {
        $this->encodePassword($args);
    }

    /**
     * @param LifecycleEventArgs $args
     * @throws Exception
     */
    public function encodePassword(LifecycleEventArgs $args)
    {
        $entity = $args->getObject();
        if (!$entity instanceof User) {
            return;
        }
        $account = $entity->getEmail();

        if ($entity->getPlainPassword()) {
            $encoded = $this->encoder->encodePassword($entity, $entity->getPlainPassword());
        } else {
            $random = substr(md5(random_bytes(5)), 0, 8);
            $encoded = $this->encoder->encodePassword($entity, $random);
            $mailer = new NotificationService($this->mailer);
            $mailer->sendEmail($_ENV['VALOMAT_EMAIL'], $account, $this->translator->trans('mail.generate.subject'), 'email/generate_password.html.twig', [
                'password' => $random,
                'account' => $account,
                'name' => $entity->getFirstname()
            ]);
        }

        $entity->setDeleted(0);
        $entity->setState(1);

        $entity->setPassword($encoded);
    }
}