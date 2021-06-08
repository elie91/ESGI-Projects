<?php

namespace App\Controller\Back;

use App\Entity\Feature;
use App\Form\{FeatureType,SearchInTableType};
use App\Repository\FeatureRepository;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\IsGranted;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\{Request,Response};
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Contracts\Translation\TranslatorInterface;

/**
 * @IsGranted("ROLE_ADMIN")
 * @Route("/feature", name="feature_")
 */
class FeatureController extends AbstractController
{
    /**
     * @Route("/", name="index", methods={"GET"})
     * @param FeatureRepository $featureRepository
     * @param Request $request
     * @return Response
     */
    public function index(FeatureRepository $featureRepository, Request $request): Response
    {
        $form = $this->createForm(SearchInTableType::class);
        $form->handleRequest($request);

        return $this->render('back/feature/index.html.twig', [
            'features' => $featureRepository->getAll($request, $form->getData()),
            'form'  => $form->createView()
        ]);
    }

    /**
     * @Route("/new", name="new", methods={"GET","POST"})
     * @param Request $request
     * @param TranslatorInterface $translator
     * @return Response
     */
    public function new(Request $request, TranslatorInterface $translator): Response
    {
        $feature = new Feature();
        $form = $this->createForm(FeatureType::class, $feature);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $entityManager = $this->getDoctrine()->getManager();
            $entityManager->persist($feature);
            $entityManager->flush();

            $this->addFlash('success', $translator->trans('feature.flash.new'));

            return $this->redirectToRoute('back_feature_index');
        }

        return $this->render('back/feature/new.html.twig', [
            'feature' => $feature,
            'form' => $form->createView(),
        ]);
    }

    /**
     * @Route("/{id}", name="show", methods={"GET"})
     * @param Feature $feature
     * @return Response
     */
    public function show(Feature $feature): Response
    {
        return $this->render('back/feature/show.html.twig', [
            'feature' => $feature,
        ]);
    }

    /**
     * @Route("/{id}/edit", name="edit", methods={"GET","POST"})
     * @param Request $request
     * @param TranslatorInterface $translator
     * @param Feature $feature
     * @return Response
     */
    public function edit(Request $request, TranslatorInterface $translator, Feature $feature): Response
    {
        $form = $this->createForm(FeatureType::class, $feature);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $this->getDoctrine()->getManager()->flush();

            $this->addFlash('success', $translator->trans('feature.flash.update'));

            return $this->redirectToRoute('back_feature_index');
        }

        return $this->render('back/feature/edit.html.twig', [
            'feature' => $feature,
            'form' => $form->createView(),
        ]);
    }

    /**
     * @Route("/{id}", name="delete", methods={"DELETE"})
     * @param Request $request
     * @param TranslatorInterface $translator
     * @param Feature $feature
     * @return Response
     */
    public function delete(Request $request, TranslatorInterface $translator, Feature $feature): Response
    {
        if ($this->isCsrfTokenValid('delete' . $feature->getId(), $request->request->get('_token'))) {
            $entityManager = $this->getDoctrine()->getManager();
            $entityManager->remove($feature);
            $entityManager->flush();

            $this->addFlash('success', $translator->trans('feature.flash.deleted'));
        }

        return $this->redirectToRoute('back_feature_index');
    }
}
