<?php

namespace App\DataFixtures;

use App\Entity\Feature;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Bundle\FixturesBundle\FixtureGroupInterface;
use Doctrine\Persistence\ObjectManager;

class FeatureFixtures extends Fixture implements FixtureGroupInterface
{
    public function load(ObjectManager $manager)
    {
		$feature1 = (new Feature())->setName("Forme");
		$feature2 = (new Feature())->setName("Metal");
		$manager->persist($feature1);
		$manager->persist($feature2);
        $manager->flush();
    }

    public static function getGroups(): array
    {
        return ['minimal'];
    }
}
