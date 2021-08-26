<?php

namespace App\Controller\Back;

use App\Entity\Test;
use App\Entity\UserTest;
use App\Form\SearchType;
use App\Repository\TestRepository;
use App\Repository\UserTestRepository;
use App\Service\CalculateTestResult;
use App\Service\TestService;
use Exception;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\Session\Session;
use Symfony\Component\Routing\Annotation\Route;

/**
 * @Route("/test", name="test_")
 */
class TestController extends AbstractController
{
    /**
     * @Route("/", name="index", methods={"GET"})
     * @param TestService $testService
     * @return Response
     * @throws Exception
     */
    public function index(TestService $testService, UserTestRepository $userTestRepository): Response
    {

        return $this->render('back/test/index.html.twig', [
            'tests' => $testService->getAvailableTests($this->getUser()),
            'scores' => $userTestRepository->findBy(['user_account' => $this->getUser()]),
        ]);
    }

    /**
     * @Route("/start/{id}", name="start", methods={"GET"})
     * @param Test $test
     * @param Request $request
     * @param Session $session
     * @return Response
     */
    public function test(Test $test, Request $request, Session $session): Response
    {
        $session->set('test', $test->getId());
        return $this->render('back/test/test.html.twig', [
            'test' => $test
        ]);
    }

    /**
     * @Route("/results", name="results", methods={"GET|POST"})
     * @param Request $request
     * @param TestService $testService
     * @param Session $session
     * @param TestRepository $testRepository
     * @param UserTestRepository $userTestRepository
     * @return Response
     * @throws Exception
     */
    public function results(Request $request, TestService $testService, Session $session, TestRepository $testRepository, UserTestRepository $userTestRepository): Response
    {
        $id = $session->get('test');
        $test = $testRepository->findOneBy(['id' => $id]);
        $userTest = $userTestRepository->findOneBy([
            'test' => $test,
            'user_account' => $this->getUser()
        ]);
        if (!$userTest) {
            $userTest = $testService->calculate($request, $test, $this->getUser());
        }

        return $this->render('back/test/result.html.twig', [
            'user_test' => $userTest
        ]);
    }

}
