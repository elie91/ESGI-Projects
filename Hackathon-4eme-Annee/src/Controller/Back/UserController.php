<?php

namespace App\Controller\Back;

use App\Entity\User;
use App\Form\SearchType;
use App\Form\UserType;
use App\Repository\ConstantRepository;
use App\Repository\UserProjectRepository;
use App\Repository\UserRepository;
use App\Service\FileUploader;
use Doctrine\ORM\OptimisticLockException;
use Doctrine\ORM\ORMException;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\IsGranted;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Core\Encoder\UserPasswordEncoderInterface;
use Symfony\Contracts\Translation\TranslatorInterface;

/**
 * @Route("/user", name="user_")
 */
class UserController extends AbstractController
{
    /**
     * @Route("/", name="index", methods={"GET"})
     * @param Request $request
     * @param UserRepository $userRepository
     * @param UserProjectRepository $userProjectRepository
     * @return Response
     * @IsGranted("ROLE_ADMIN")
     */
    public function index(Request $request, UserRepository $userRepository, UserProjectRepository $userProjectRepository): Response
    {
        $form = $this->createForm(SearchType::class);
        $form->handleRequest($request);
        $users = $userRepository->searchBy($form->getData(), $this->getUser());
        return $this->render('back/user/index.html.twig', [
            'users' => $users,
            'current_user' => $this->getUser(),
            'form' => $form->createView(),
            'projects' => $userProjectRepository->findOneBy(['userId' => $this->getUser()])
        ]);
    }

    /**
     * @Route("/community", name="community", methods={"GET"})
     * @param Request $request
     * @param UserRepository $userRepository
     * @param ConstantRepository $constantRepository
     * @return Response
     * @IsGranted("ROLE_USER")
     */
    public function community(Request $request, UserRepository $userRepository, ConstantRepository $constantRepository): Response
    {
        $form = $this->createForm(SearchType::class);
        $form->handleRequest($request);
        $users = $userRepository->searchBy($form->getData(), $this->getUser());
        return $this->render('back/user/community.html.twig', [
            'users' => $users,
            'current_user' => $this->getUser(),
            'form' => $form->createView(),
            'constants' => $constantRepository->findBy(['type' => 'JOB'])
        ]);
    }

    /**
     * @Route("/new", name="new", methods={"GET","POST"})
     * @param Request $request
     * @param ConstantRepository $constantRepository
     * @return Response
     * @IsGranted("ROLE_ADMIN")
     */
    public function new(Request $request, ConstantRepository $constantRepository): Response
    {
        $user = new User();
        $user->setTerms(true);
        $user->setActive(true);
        $form = $this->createForm(UserType::class, $user, [
            'jobs' => $constantRepository->findBy(['type' => 'JOB']),
            'states' => $constantRepository->findBy(['type' => 'STATE_USER']),
            'admin' => true]);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $user->setState($form->getData()->getState());
            $user->setJob($form->getData()->getJob());
            $entityManager = $this->getDoctrine()->getManager();
            $entityManager->persist($user);
            $entityManager->flush();

            return $this->redirectToRoute('back_user_index');
        }

        return $this->render('back/user/new.html.twig', [
            'user' => $user,
            'form' => $form->createView(),
        ]);
    }

    /**
     * @Route("/{id}", name="show", methods={"GET"})
     * @param User $user
     * @return Response
     * @IsGranted("ROLE_ADMIN")
     */
    public function show(User $user): Response
    {
        return $this->render('back/user/show.html.twig', [
            'user' => $user,
        ]);
    }

    /**
     * @Route("/{id}/edit", name="edit", methods={"GET","POST"})
     * @param Request $request
     * @param ConstantRepository $constantRepository
     * @param User $user
     * @return Response
     * @IsGranted("ROLE_ADMIN")
     */
    public function edit(Request $request, ConstantRepository $constantRepository, User $user): Response
    {
        $form = $this->createForm(UserType::class, $user, [
            'jobs' => $constantRepository->findBy(['type' => 'JOB']),
            'states' => $constantRepository->findBy(['type' => 'STATE_USER']),
            'admin' => true
        ]);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            if ($user->getState() === 3) {
                $user->setRoles(['ROLE_USER']);
            }
            $this->getDoctrine()->getManager()->flush();
            $this->addFlash('success', 'flash.userUpdated');
            return $this->redirectToRoute('back_user_index');
        }

        return $this->render('back/user/edit.html.twig', [
            'user' => $user,
            'form' => $form->createView(),
        ]);
    }

    /**
     * @Route("/{id}", name="delete", methods={"DELETE"})
     * @param Request $request
     * @param User $user
     * @return Response
     * @IsGranted("ROLE_ADMIN")
     */
    public function delete(Request $request, User $user): Response
    {
        if ($this->isCsrfTokenValid('delete' . $user->getId(), $request->request->get('_token'))) {
            $entityManager = $this->getDoctrine()->getManager();
            $entityManager->remove($user);
            $entityManager->flush();
        }

        return $this->redirectToRoute('user_index');
    }
}
