<?php

namespace App\DataFixtures;

use App\Entity\Question;
use App\Entity\Test;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Common\DataFixtures\DependentFixtureInterface;
use Doctrine\Persistence\ObjectManager;
use Faker\Factory;

class QuestionsFixtures extends Fixture implements DependentFixtureInterface
{
    public function load(ObjectManager $manager)
    {
        $faker = Factory::create();
        $tests = $manager->getRepository(Test::class)->findAll();

        foreach ($tests as $test) {
            for ($i = 0; $i <= 5; $i++) {
                $question = (new Question())
                    ->setTitle($faker->realText(100))
                    ->setTest($test);
                $manager->persist($question);
            }
        }

        $manager->flush();
    }

    public function getDependencies()
    {
        return array(
            TestFixtures::class
        );
    }

}
