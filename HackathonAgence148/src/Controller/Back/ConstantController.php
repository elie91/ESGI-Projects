<?php

namespace App\Controller\Back;

use App\Entity\Constant;
use App\Form\ConstantType;
use App\Repository\ConstantRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

/**
 * @Route("/constant", name="constant_")
 */
class ConstantController extends AbstractController
{
    /**
     * @Route("/", name="index", methods={"GET"})
     * @param ConstantRepository $constantRepository
     * @return Response
     */
    public function index(ConstantRepository $constantRepository): Response
    {
        return $this->render('back/constant/index.html.twig', [
            'constants' => $constantRepository->findAll(),
        ]);
    }

    /**
     * @Route("/new", name="new", methods={"GET","POST"})
     * @param Request $request
     * @return Response
     */
    public function new(Request $request): Response
    {
        $constant = new Constant();
        $form = $this->createForm(ConstantType::class, $constant);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $entityManager = $this->getDoctrine()->getManager();
            $entityManager->persist($constant);
            $entityManager->flush();

            return $this->redirectToRoute('constant_index');
        }

        return $this->render('back/constant/new.html.twig', [
            'constant' => $constant,
            'form' => $form->createView(),
        ]);
    }

    /**
     * @Route("/{id}/edit", name="edit", methods={"GET","POST"})
     * @param Request $request
     * @param Constant $constant
     * @return Response
     */
    public function edit(Request $request, Constant $constant): Response
    {
        $form = $this->createForm(ConstantType::class, $constant, ['edit' => true]);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $this->getDoctrine()->getManager()->flush();

            return $this->redirectToRoute('back_constant_index');
        }

        return $this->render('back/constant/edit.html.twig', [
            'constant' => $constant,
            'form' => $form->createView(),
        ]);
    }

    /**
     * @Route("/{id}", name="delete", methods={"DELETE"})
     * @param Request $request
     * @param Constant $constant
     * @return Response
     */
    public function delete(Request $request, Constant $constant): Response
    {
        if ($this->isCsrfTokenValid('delete'.$constant->getId(), $request->request->get('_token'))) {
            $entityManager = $this->getDoctrine()->getManager();
            $entityManager->remove($constant);
            $entityManager->flush();
        }

        return $this->redirectToRoute('back_constant_index');
    }
}
