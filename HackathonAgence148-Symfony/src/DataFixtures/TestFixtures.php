<?php

namespace App\DataFixtures;

use App\Entity\Test;
use App\Entity\User;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Common\DataFixtures\DependentFixtureInterface;
use Doctrine\Persistence\ObjectManager;
use Faker\Factory;

class TestFixtures extends Fixture implements DependentFixtureInterface
{
    public function load(ObjectManager $manager)
    {
        $faker = Factory::create();

        $tests = [];
        $tests[] = (new Test())
            ->setType('ENTRY')
            ->setTitle("Développement web");

        $tests[] = (new Test())
            ->setType('ENTRY')
            ->setTitle("Design");

        $tests[] = (new Test())
            ->setType('ENTRY')
            ->setTitle("Performance");

        $tests[] = (new Test())
            ->setType('SKILL')
            ->setTitle("PHP");

        $tests[] = (new Test())
            ->setType('SKILL')
            ->setTitle("JAVA");

        $tests[] = (new Test())
            ->setType('SKILL')
            ->setTitle("CSS");

        $tests[] = (new Test())
            ->setType('SKILL')
            ->setTitle("Java");

        $tests[] = (new Test())
            ->setType('SKILL')
            ->setTitle("Python");

        foreach ($tests as $test) {
            $manager->persist($test);
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
