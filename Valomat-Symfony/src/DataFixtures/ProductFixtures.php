<?php

namespace App\DataFixtures;

use App\Entity\Category;
use App\Entity\Product;
use App\Entity\User;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Common\DataFixtures\DependentFixtureInterface;
use Doctrine\Persistence\ObjectManager;
use Faker\Factory;

class ProductFixtures extends Fixture implements DependentFixtureInterface
{
    public function load(ObjectManager $manager)
    {
        $faker = Factory::create();

        $categories = $manager->getRepository(Category::class)->findAll();
        $users = $manager->getRepository(User::class)->findAll();

        for ($i = 0; $i < 25; $i++) {

            $product = (new Product())
                ->setName($faker->firstName)
                ->setReference($faker->isbn10)
                ->setDescription($faker->text)
				->addCategory($faker->randomElement($categories))
				->setUserId($faker->randomElement($users))
                ->setMetaDescription($faker->sentence($nbWords = 3))
                ->setMetaTitle($faker->title)
                ->setRewrittenUrl($faker->name)
                ->setQuantity($faker->numberBetween(10,500))
                ->setAloy($faker->word)
                ->setWidth($faker->randomFloat($nbMaxDecimals = 2, $min = 0, $max = 2000))
                ->setHeight($faker->randomFloat($nbMaxDecimals = 2, $min = 0, $max = 2000))
                ->setWeight($faker->randomFloat($nbMaxDecimals = 2, $min = 0, $max = 2000))
                ->setDepth($faker->randomFloat($nbMaxDecimals = 2, $min = 0, $max = 2000))
                ->setActive($faker->numberBetween(0,1))
                ->setStandardIndex($faker->isbn10)
                ->setElaborator($faker->title)
                ->setCreatedAt($faker->dateTime)
                ->setUpdatedAt($faker->dateTime);

            $manager->persist($product);
        }
        $manager->flush();
    }

	public function getDependencies()
	{
		return array(
			UserFixtures::class,
			CategoryFixtures::class,
		);
	}

}
