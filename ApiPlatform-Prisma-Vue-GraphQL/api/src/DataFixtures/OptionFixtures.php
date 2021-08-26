<?php

namespace App\DataFixtures;

use App\Entity\Option;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;

class OptionFixtures extends Fixture
{

  public function load(ObjectManager $manager)
  {
    $options = [];

    $options[] = (new Option())
      ->setName("Billard");

    $options[] = (new Option())
      ->setName("Baby Foot");

    $options[] = (new Option())
      ->setName("Piscine");

    $options[] = (new Option())
      ->setName("Jacuzzi");

    $options[] = (new Option())
      ->setName("Sauna");

    $options[] = (new Option())
      ->setName("Hammam");

    $options[] = (new Option())
      ->setName("Piano");

    foreach ($options as $option) {
      $manager->persist($option);
    }

    $manager->flush();
  }
}
