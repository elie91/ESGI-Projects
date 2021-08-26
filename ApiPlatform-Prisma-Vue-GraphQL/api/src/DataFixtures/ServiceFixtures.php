<?php

namespace App\DataFixtures;

use App\Entity\Service;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;
use Faker\Factory;

class ServiceFixtures extends Fixture
{

  public function load(ObjectManager $manager)
  {
    $services = [];
    $faker = Factory::create();

    $services[] = (new Service())
      ->setName("DJ")
      ->setPrice($faker->numberBetween(20, 300));

    $services[] = (new Service())
      ->setName("Jeu d'alcool")
      ->setPrice($faker->numberBetween(20, 300));

    $services[] = (new Service())
      ->setName("Danseuses")
      ->setPrice($faker->numberBetween(20, 300));

    $services[] = (new Service())
      ->setName("Tournoi gaming")
      ->setPrice($faker->numberBetween(20, 300));

    $services[] = (new Service())
      ->setName("Lorem")
      ->setPrice($faker->numberBetween(20, 300));

    $services[] = (new Service())
      ->setName("Ipsum")
      ->setPrice($faker->numberBetween(20, 300));

    $services[] = (new Service())
      ->setName("DolorSitAmet")
      ->setPrice($faker->numberBetween(20, 300));

    foreach ($services as $service) {
      $manager->persist($service);
    }

    $manager->flush();
  }
}
