<?php

namespace App\DataFixtures;

use App\Entity\Category;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Bundle\FixturesBundle\FixtureGroupInterface;
use Doctrine\Persistence\ObjectManager;
use Faker\Factory;

class CategoryFixtures extends Fixture implements FixtureGroupInterface
{
    public function load(ObjectManager $manager)
    {
        $faker = Factory::create();

        for ($i = 0; $i < 10; $i++) {

            $category = (new Category())
                ->setTitle($faker->firstName)
                ->setDescription($faker->text)
                ->setMetaDescription($faker->sentence($nbWords = 3))
                ->setMetaTitle($faker->title)
                ->setCreatedAt($faker->dateTime)
                ->setUpdatedAt($faker->dateTime);

            $manager->persist($category);
        }
        $manager->flush();
    }

    public static function getGroups(): array
    {
        return ['minimal'];
    }
}
