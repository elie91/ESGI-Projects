<?php

namespace App\DataFixtures;

use App\Entity\Constant;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;
use Faker\Factory;

class ConstantFixtures extends Fixture
{
    public function load(ObjectManager $manager)
    {
        $faker = Factory::create();

        $constants = [];
        $constants[] = (new Constant())
            ->setType('JOB')
            ->setValue('DEVELOPPEUR')
            ->setPosition(0);

        $constants[] = (new Constant())
            ->setType('JOB')
            ->setValue('DESIGNEUR')
            ->setPosition(1);

        $constants[] = (new Constant())
            ->setType('JOB')
            ->setValue('MARKETEUR')
            ->setPosition(2);

        $constants[] = (new Constant())
            ->setType('STATE_USER')
            ->setValue('Création du compte')
            ->setPosition(0);

        $constants[] = (new Constant())
            ->setType('STATE_USER')
            ->setValue('Test d’entrée')
            ->setPosition(1);

        $constants[] = (new Constant())
            ->setType('STATE_USER')
            ->setValue('Entretien physique')
            ->setPosition(2);

        $constants[] = (new Constant())
            ->setType('STATE_USER')
            ->setValue('Plateforme accessible')
            ->setPosition(3);

        foreach ($constants as $constant) {
            $manager->persist($constant);
        }
        $manager->flush();
    }
}
