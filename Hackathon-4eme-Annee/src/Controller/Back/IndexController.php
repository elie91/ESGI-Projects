<?php

namespace App\Controller\Back;

use App\Repository\ConstantRepository;
use App\Repository\ProjectRepository;
use App\Repository\TestRepository;
use App\Repository\TopicRepository;
use App\Repository\UserProjectRepository;
use App\Repository\UserRepository;
use App\Repository\UserTestRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

/**
 * Class IndexController
 * @package App\Controller\Back
 */
class IndexController extends AbstractController
{
    /**
     * @Route("/",name="index", methods={"GET"})
     * @param ConstantRepository $constantRepository
     * @param UserProjectRepository $userProjectRepository
     * @param UserTestRepository $userTestRepository
     * @param UserRepository $userRepository
     * @param ProjectRepository $projectRepository
     * @param TestRepository $testRepository
     * @param TopicRepository $topicRepository
     * @return Response
     */
    public function index(
        ConstantRepository $constantRepository,
        UserProjectRepository $userProjectRepository,
        UserTestRepository $userTestRepository,
        UserRepository $userRepository,
        ProjectRepository $projectRepository,
        TestRepository $testRepository,
        TopicRepository $topicRepository
    ): Response
    {
        $data = [];
        if (in_array('ROLE_ADMIN', $this->getUser()->getRoles())) {
            $data['users'] = count($userRepository->findAll()) - 1;
            $data['projects'] = count($projectRepository->findAll());
            $data['tests'] = count($testRepository->findAll());
            $data['topics'] = count($topicRepository->findAll());
        } else {
            $data['states'] = $constantRepository->findBy(['type' => 'STATE_USER']);
            $data['projects'] = $userProjectRepository->findBy(['userId' => $this->getUser(), 'selected' => true], null, '3');
            $data['tests'] = $userTestRepository->findBy(['user_account' => $this->getUser()], null, '3');
        }

        return $this->render('back/index.html.twig', [
            'data' => $data
        ]);
    }
}