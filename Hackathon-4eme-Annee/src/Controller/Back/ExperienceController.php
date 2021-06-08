<?php

namespace App\Controller\Back;

use App\Entity\Experience;
use App\Entity\Topic;
use App\Entity\User;
use App\Form\ExperienceType;
use App\Form\SearchType;
use App\Form\TopicType;
use App\Form\UserType;
use App\Repository\TopicRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

/**
 * @Route("/experience", name="experience_")
 */
class ExperienceController extends AbstractController
{

    /**
     * @Route("/", name="index", methods={"GET"})
     * @return Response
     */
    public function index(): Response
    {
        return $this->redirectToRoute('back_profile_index');
    }

    /**
     * @Route("/new", name="new", methods={"GET","POST"})
     * @param Request $request
     * @return Response
     */
    public function new(Request $request): Response
    {
        $experience = new Experience();
        $form = $this->createForm(ExperienceType::class, $experience);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $entityManager = $this->getDoctrine()->getManager();
            $experience->setUserAccount($this->getUser());
            $entityManager->persist($experience);
            $entityManager->flush();

            $this->addFlash('success', 'Une nouvelle expérience a été ajouté');

            return $this->redirectToRoute('back_profile_index');
        }

        return $this->render('back/experience/new.html.twig', [
            'experience' => $experience,
            'form' => $form->createView(),
        ]);
    }


    /**
     * @Route("/{id}/edit", name="edit", methods={"GET","POST"})
     * @param Request $request
     * @param Experience $experience
     * @return Response
     */
    public function edit(Request $request, Experience $experience): Response
    {
        $form = $this->createForm(ExperienceType::class, $experience);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $this->getDoctrine()->getManager()->flush();
            $this->addFlash('success', "L'experience ".$experience->getTitle()." a été modifié");

            return $this->redirectToRoute('back_profile_index');
        }

        return $this->render('back/experience/edit.html.twig', [
            'experience' => $experience,
            'form' => $form->createView(),
        ]);
    }

    /**
     * @Route("/{id}", name="delete", methods={"DELETE"})
     * @param Request $request
     * @param Experience $experience
     * @return Response
     */
    public function delete(Request $request, Experience $experience): Response
    {
        if ($this->isCsrfTokenValid('delete' . $experience->getId(), $request->request->get('_token'))) {
            $entityManager = $this->getDoctrine()->getManager();
            $entityManager->remove($experience);
            $entityManager->flush();
            $this->addFlash('success', "L'experience ".$experience->getTitle()." a été supprimé");

        }

        return $this->redirectToRoute('back_profile_index');
    }
}
