<?php

namespace App\DataFixtures;

use App\Entity\Answer;
use App\Entity\Question;
use App\Entity\Topic;
use App\Entity\User;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Common\DataFixtures\DependentFixtureInterface;
use Doctrine\Persistence\ObjectManager;
use Faker\Factory;

class AnswerFixtures extends Fixture implements DependentFixtureInterface
{
    public function load(ObjectManager $manager)
    {
        $faker = Factory::create();
        $questions = $manager->getRepository(Question::class)->findAll();

        foreach ($questions as $question) {
            $answer_1 = (new Answer())
                ->setContent($faker->text)
                ->setIsValid(0)
                ->setQuestion($question);
            $answer_2 = (new Answer())
                ->setContent($faker->text)
                ->setIsValid(0)
                ->setQuestion($question);
            $answer_3 = (new Answer())
                ->setContent($faker->text)
                ->setIsValid(0)
                ->setQuestion($question);
            $answer_4 = (new Answer())
                ->setContent($faker->text)
                ->setIsValid(1)
                ->setQuestion($question);

            $manager->persist($answer_1);
            $manager->persist($answer_2);
            $manager->persist($answer_3);
            $manager->persist($answer_4);
        }
        $manager->flush();
    }

    public function getDependencies()
    {
        return array(
            QuestionsFixtures::class
        );
    }

}
