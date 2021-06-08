<?php

namespace App\DataFixtures;

use App\Entity\Experience;
use App\Entity\Project;
use App\Entity\User;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Common\DataFixtures\DependentFixtureInterface;
use Doctrine\Persistence\ObjectManager;
use Faker\Factory;

class ExperienceFixtures extends Fixture implements DependentFixtureInterface
{
    public function load(ObjectManager $manager)
    {
        $faker = Factory::create();
        $users = $manager->getRepository(User::class)->findAll();

        foreach ($users as $user) {
            for ($i = 0; $i < 3; $i++) {
                $experience = (new Experience())
                    ->setUserAccount($user)
                    ->setTitle($faker->jobTitle)
                    ->setCompany($faker->company)
                    ->setDescription($faker->text)
                    ->setStartDate($faker->dateTime)
                    ->setIsCurrentJob(1)
                    ->setLocation($faker->city);

                $manager->persist($experience);
            }
        }
        $manager->flush();
    }

    public function getDependencies()
    {
        return array(
            UserFixtures::class
        );
    }
}
