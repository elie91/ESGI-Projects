<?php

namespace App\Controller\Back;

use App\Entity\Topic;
use App\Entity\User;
use App\Form\SearchType;
use App\Form\TopicType;
use App\Form\UserType;
use App\Repository\TopicRepository;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\IsGranted;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

/**
 * @IsGranted("ROLE_USER")
 * @Route("/topic", name="topic_")
 */
class TopicController extends AbstractController
{
    /**
     * @Route("/", name="index", methods={"GET"})
     * @param TopicRepository $topicRepository
     * @param Request $request
     * @return Response
     */
    public function index(TopicRepository $topicRepository, Request $request): Response
    {
        $form = $this->createForm(SearchType::class);
        $form->handleRequest($request);
        $topics = $topicRepository->getAll($form->getData());

        return $this->render('back/topic/index.html.twig', [
            'topics' => $topics,
            'form' => $form->createView()
        ]);
    }

    /**
     * @Route("/new", name="new", methods={"GET","POST"})
     * @param Request $request
     * @return Response
     */
    public function new(Request $request): Response
    {
        $topic = new Topic();
        $form = $this->createForm(TopicType::class, $topic);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $entityManager = $this->getDoctrine()->getManager();
            $topic->setAuthor($this->getUser());
            $entityManager->persist($topic);
            $entityManager->flush();

            $this->addFlash('success', "Vous avez créé un nouveau topic");

            return $this->redirectToRoute('back_topic_index');
        }

        return $this->render('back/topic/new.html.twig', [
            'topic' => $topic,
            'form' => $form->createView(),
        ]);
    }

    /**
     * @Route("/{id}", name="show", methods={"GET"})
     * @param User $user
     * @return Response
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
     * @param Topic $topic
     * @return Response
     */
    public function edit(Request $request, Topic $topic): Response
    {
        $form = $this->createForm(TopicType::class, $topic);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $this->getDoctrine()->getManager()->flush();
            $this->addFlash('success', "Vous avez modifié le topic ".$topic->getTitle());

            return $this->redirectToRoute('back_topic_index');
        }

        return $this->render('back/topic/edit.html.twig', [
            'topic' => $topic,
            'form' => $form->createView(),
        ]);
    }

    /**
     * @Route("/{id}", name="delete", methods={"DELETE"})
     * @param Request $request
     * @param Topic $topic
     * @return Response
     */
    public function delete(Request $request, Topic $topic): Response
    {
        if ($this->isCsrfTokenValid('delete' . $topic->getId(), $request->request->get('_token'))) {
            $entityManager = $this->getDoctrine()->getManager();
            $entityManager->remove($topic);
            $entityManager->flush();
            $this->addFlash('success', "Vous avez supprimé le topic ".$topic->getTitle());

        }

        return $this->redirectToRoute('back_topic_index');
    }
}
