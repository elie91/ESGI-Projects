<?php

namespace App\DataFixtures;

use App\Entity\Product;
use App\Entity\Quote;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Common\DataFixtures\DependentFixtureInterface;
use Doctrine\Persistence\ObjectManager;
use Faker\Factory;

class QuoteFixtures extends Fixture implements DependentFixtureInterface
{
    public function load(ObjectManager $manager)
    {
        $faker = Factory::create();

        $products = $manager->getRepository(Product::class)->findAll();

        for ($i = 0; $i < 10; $i++) {

            $quote = (new Quote())
                ->setCompany($faker->company)
                ->setEmail($faker->email)
                ->setFirstname($faker->firstName)
                ->setLastname($faker->lastName)
                ->setPhone($faker->phoneNumber)
                ->setMessage($faker->text)
                ->setProduct($faker->randomElement($products));

            $manager->persist($quote);
        }

        $manager->flush();
    }

    public function getDependencies()
    {
        return array(
            ProductFixtures::class
        );
    }

}
