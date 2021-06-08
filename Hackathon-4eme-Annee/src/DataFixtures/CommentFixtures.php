<?php

namespace App\DataFixtures;

use App\Entity\Comment;
use App\Entity\Topic;
use App\Entity\User;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Common\DataFixtures\DependentFixtureInterface;
use Doctrine\Persistence\ObjectManager;
use Faker\Factory;

class CommentFixtures extends Fixture implements DependentFixtureInterface
{
    public function load(ObjectManager $manager)
    {
        $faker = Factory::create();
        $users = $manager->getRepository(User::class)->findAll();
        $topics = $manager->getRepository(Topic::class)->findAll();

        for ($i = 0; $i <= 5; $i++) {
            $comment = (new Comment())
                ->setAuthor($faker->randomElement($users))
                ->setContent($faker->text)
                ->setIsUpdated(0)
                ->setTopic($faker->randomElement($topics));
            $manager->persist($comment);
        }
        $manager->flush();
    }

    public function getDependencies()
    {
        return array(
            UserFixtures::class,
            TopicFixtures::class
        );
    }

}
