<?php

namespace App\Service;

use App\Entity\Answer;
use App\Entity\Test;
use App\Entity\User;
use App\Entity\UserTest;
use Doctrine\ORM\EntityManagerInterface;
use Exception;
use Symfony\Component\HttpFoundation\Request;

class TestService
{
    private $em;

    public function __construct(EntityManagerInterface $em)
    {
        $this->em = $em;
    }

    /**
     * @param Request $request
     * @param Test $test
     * @param User $user
     * @return UserTest
     * @throws Exception
     */
    public function calculate(Request $request, Test $test, User $user): UserTest
    {
        $answerRepository = $this->em->getRepository(Answer::class);
        $nbValide = 0;
        foreach ($request->request as $answer) {
            $answer = $answerRepository->findOneBy(['id' => $answer]);
            if (!$answer) {
                throw new Exception("Erreur");
            }
            if ($answer->getIsValid()) {
                $nbValide++;
            }
        }
        $score = (int)ceil(($nbValide / count($request->request)) * 100);

        $userTest = (new UserTest())
            ->setTest($test)
            ->setUserAccount($user)
            ->setScore($score);

        //Si le user valide le test d'entrée, on passe à l'étape suivante
        if($score > 70 && $user->getState() === 0) {
            $user->setState(1);
        }


        $this->em->persist($userTest);
        $this->em->flush();
        return $userTest;
    }

    /**
     * @param array|null $data
     * @param User $user
     * @return array
     * @throws Exception
     */
    public function getAvailableTests(User $user): array
    {
        $testRepository = $this->em->getRepository(Test::class);
        $tests = [];
        //Récupère les tests d'entrée si le user est au state 0
        if (in_array('ROLE_ADMIN', $user->getRoles())) {
            $tests = $testRepository->findAll();
        } elseif ($user->getState() === 0) {
            $tests = $testRepository->findBy(['type' => 'ENTRY']);
        } else {
            $userTestRepository = $this->em->getRepository(UserTest::class);
            $available_test = $testRepository->findBy(['type' => 'SKILL']);
            foreach ($available_test as $test) {
                $user_test = $userTestRepository->findOneBy([
                    'test' => $test,
                    'user_account' => $user
                ]);
                if (empty($user_test)) {
                    array_push($tests, $test);
                }
            }
        }

        return $tests;
    }

}