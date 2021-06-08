<?php

namespace App\DataFixtures;

use App\Entity\Constant;
use App\Entity\User;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;
use Faker\Factory;

class UserFixtures extends Fixture
{
    public function load(ObjectManager $manager)
    {
        $faker = Factory::create();
        $users = [];
        $users[] = (new User())
            ->setEmail('admin@gmail.com')
            ->setPlainPassword('admin')
            ->setName('COICHOT')
            ->setJob($faker->jobTitle)
            ->setFirstname('Thomas')
            ->setRoles(['ROLE_ADMIN'])
            ->setActive(true)
            ->setPicture('10.jpeg')
            ->setTerms(true)
            ->setState(0)
            ->setJob($faker->numberBetween(0, 2));

        $users[] = (new User())
            ->setEmail('user@gmail.com')
            ->setPlainPassword('user')
            ->setName('BISMUTH')
            ->setJob($faker->jobTitle)
            ->setFirstname('Elie')
            ->setActive(1)
            ->setPicture('Photo_mon-compte.png')
            ->setCity("Paris")
            ->setTerms(true)
            ->setState(0)
            ->setJob($faker->numberBetween(0, 2));

        $faker = Factory::create();
        for ($i = 0; $i <= 2; $i++) {
            $users[] = (new User())
                ->setEmail($faker->email)
                ->setPlainPassword($faker->password)
                ->setName($faker->lastName)
                ->setFirstname($faker->firstName)
                ->setActive(1) 
                ->setPicture('10.jpeg')
                ->setTerms(true)
                ->setState($faker->numberBetween(0, 3))
                ->setJob($faker->numberBetween(0, 2));
        }

        foreach ($users as $user) {
            $manager->persist($user);
        }
        $manager->flush();
    }
}
