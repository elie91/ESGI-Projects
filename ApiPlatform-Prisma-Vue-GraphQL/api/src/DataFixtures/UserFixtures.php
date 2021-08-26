<?php

namespace App\DataFixtures;

use App\Entity\User;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;
use Symfony\Component\Security\Core\Encoder\UserPasswordEncoderInterface;

class UserFixtures extends Fixture
{

  private UserPasswordEncoderInterface $passwordEncoder;

  public function __construct(UserPasswordEncoderInterface $passwordEncoder)
  {
    $this->passwordEncoder = $passwordEncoder;
  }

  public function load(ObjectManager $manager)
  {
    $admin = (new User())
      ->setEmail("admin@avg.com")
      ->setFirstname("Prenom")
      ->setLastname("Nom")
      ->setPhone("0123456789")
      ->setRoles(["ROLE_ADMIN"]);
    $admin->setPassword($this->passwordEncoder->encodePassword($admin, "admin"));
    $manager->persist($admin);

    $user = (new User())
      ->setEmail("user@avg.com")
      ->setFirstname("Prenom")
      ->setLastname("Nom")
      ->setPhone("0123456789");
    $user->setPassword($this->passwordEncoder->encodePassword($user, "user"));
    $manager->persist($user);
    $manager->flush();

    $user2 = (new User())
      ->setEmail("user2@avg.com")
      ->setFirstname("Prenom")
      ->setLastname("Nom")
      ->setPhone("0123456789");
    $user2->setPassword($this->passwordEncoder->encodePassword($user2, "user2"));
    $manager->persist($user2);
    $manager->flush();

    $renter = (new User())
      ->setEmail("renter@avg.com")
      ->setFirstname("Prenom")
      ->setLastname("Nom")
      ->setPhone("0123456789")
      ->setRoles(["ROLE_RENTER"]);
    $renter->setPassword($this->passwordEncoder->encodePassword($renter, "renter"));
    $manager->persist($renter);

    $renter2 = (new User())
      ->setEmail("renter2@avg.com")
      ->setFirstname("Prenom")
      ->setLastname("Nom")
      ->setPhone("0123456789")
      ->setRoles(["ROLE_RENTER"]);
    $renter2->setPassword($this->passwordEncoder->encodePassword($renter2, "renter2"));
    $manager->persist($renter2);

    $renter3 = (new User())
      ->setEmail("renter3@avg.com")
      ->setFirstname("Prenom")
      ->setLastname("Nom")
      ->setPhone("0123456789")
      ->setRoles(["ROLE_RENTER"]);
    $renter3->setPassword($this->passwordEncoder->encodePassword($renter3, "renter3"));
    $manager->persist($renter3);

    $manager->flush();


  }

}
