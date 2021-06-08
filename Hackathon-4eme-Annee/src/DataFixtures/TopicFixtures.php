<?php

namespace App\DataFixtures;

use App\Entity\Topic;
use App\Entity\User;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Common\DataFixtures\DependentFixtureInterface;
use Doctrine\Persistence\ObjectManager;
use Faker\Factory;

class TopicFixtures extends Fixture implements DependentFixtureInterface
{
    public function load(ObjectManager $manager)
    {
        $faker = Factory::create();
        $users = $manager->getRepository(User::class)->findAll();

        $topics = [];
        $topics[] = (new Topic())
            ->setTitle("Symfony")
            ->setContent("Besoin d'aide en symfony")
            ->setAuthor($faker->randomElement($users));

        $topics[] = (new Topic())
            ->setTitle("Javascript")
            ->setContent("Besoin d'aide en javascript")
            ->setAuthor($faker->randomElement($users));

        $topics[] = (new Topic())
            ->setTitle("CSS")
            ->setContent("Besoin d'aide en css")
            ->setAuthor($faker->randomElement($users));

        $topics[] = (new Topic())
            ->setTitle("Java")
            ->setContent("Besoin d'aide en java")
            ->setAuthor($faker->randomElement($users));

        $topics[] = (new Topic())
            ->setTitle("Python")
            ->setContent("Besoin d'aide en pyhton")
            ->setAuthor($faker->randomElement($users));


        foreach ($topics as $topic){
            $manager->persist($topic);
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
