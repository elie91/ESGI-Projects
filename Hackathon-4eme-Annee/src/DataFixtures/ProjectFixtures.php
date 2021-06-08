<?php

namespace App\DataFixtures;

use App\Entity\Project;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;
use Faker\Factory;

class ProjectFixtures extends Fixture
{
    public function load(ObjectManager $manager)
    {
        $faker = Factory::create();

        for ($i = 0; $i < 10; $i++) {
            $project = (new Project())
                ->setName($faker->name)
                ->setDescription($faker->sentence)
                ->setCompany($faker->company)
                ->setEnded($faker->boolean)
                ->setState(0)
            ;
            $manager->persist($project);
        }

        $manager->flush();
    }
}
