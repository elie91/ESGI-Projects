<?php

namespace App\DataFixtures;

use App\Entity\Feature;
use App\Entity\FeatureValue;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Bundle\FixturesBundle\FixtureGroupInterface;
use Doctrine\Common\DataFixtures\DependentFixtureInterface;
use Doctrine\Persistence\ObjectManager;

class FeatureValueFixtures extends Fixture implements DependentFixtureInterface, FixtureGroupInterface
{
    public function load(ObjectManager $manager)
    {

        $feature = $manager->getRepository(Feature::class)->findBy(['name' => "Forme"]);
        $feature2 = $manager->getRepository(Feature::class)->findBy(['name' => "Metal"]);

		$featureValue1 = (new FeatureValue())
            ->setValue('ROND')
            ->setFeature($feature[0]);
		$featureValue2 = (new FeatureValue())
            ->setValue('TOLE')
            ->setFeature($feature[0]);
		$featureValue3 = (new FeatureValue())
            ->setValue('PLAT')
            ->setFeature($feature[0]);

		$featureValue4 = (new FeatureValue())
            ->setValue('INOX')
            ->setFeature($feature2[0]);
		$featureValue5 = (new FeatureValue())
            ->setValue('ACIER')
            ->setFeature($feature2[0]);
		$featureValue6 = (new FeatureValue())
            ->setValue('ALUMINIUM')
            ->setFeature($feature2[0]);
		$featureValue7 = (new FeatureValue())
            ->setValue('TITANE')
            ->setFeature($feature2[0]);

		$manager->persist($featureValue1);
		$manager->persist($featureValue2);
		$manager->persist($featureValue3);
		$manager->persist($featureValue4);
		$manager->persist($featureValue5);
		$manager->persist($featureValue6);
		$manager->persist($featureValue7);

        $manager->flush();
    }

	public function getDependencies()
	{
		return array(
			FeatureFixtures::class,
		);
	}

    public static function getGroups(): array
    {
        return ['minimal'];
    }

}
