<?php

namespace App\Controller\Back;

use App\Entity\FeatureValue;
use App\Form\FeatureValueType;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\IsGranted;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\{Request, Response};
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Contracts\Translation\TranslatorInterface;

/**
 * @IsGranted("ROLE_ADMIN")
 * @Route("/feature/value", name="feature_value_")
 */
class FeatureValueController extends AbstractController
{
    /**
     * @Route("/new", name="new", methods={"GET","POST"})
     * @param Request $request
     * @param TranslatorInterface $translator
     * @return Response
     */
    public function new(Request $request, TranslatorInterface $translator): Response
    {
        $featureValue = new FeatureValue();
        $form = $this->createForm(FeatureValueType::class, $featureValue);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $entityManager = $this->getDoctrine()->getManager();
            $entityManager->persist($featureValue);
            $entityManager->flush();

            $this->addFlash('success', $translator->trans('featureValue.flash.new'));

            return $this->redirectToRoute('back_feature_index');
        }

        return $this->render('back/feature_value/new.html.twig', [
            'feature_value' => $featureValue,
            'form' => $form->createView(),
        ]);
    }

    /**
     * @Route("/{id}/edit", name="edit", methods={"GET","POST"})
     * @param Request $request
     * @param FeatureValue $featureValue
     * @param TranslatorInterface $translator
     * @return Response
     */
    public function edit(Request $request, FeatureValue $featureValue, TranslatorInterface $translator): Response
    {
        $form = $this->createForm(FeatureValueType::class, $featureValue);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $this->getDoctrine()->getManager()->flush();

            $this->addFlash('success', $translator->trans('featureValue.flash.update'));

            return $this->redirectToRoute('back_feature_index');
        }

        return $this->render('back/feature_value/edit.html.twig', [
            'feature_value' => $featureValue,
            'form' => $form->createView(),
        ]);
    }

    /**
     * @Route("/{id}", name="delete", methods={"DELETE"})
     * @param Request $request
     * @param FeatureValue $featureValue
     * @param TranslatorInterface $translator
     * @return Response
     */
    public function delete(Request $request, FeatureValue $featureValue, TranslatorInterface $translator): Response
    {
        if ($this->isCsrfTokenValid('delete' . $featureValue->getId(), $request->request->get('_token'))) {
            $entityManager = $this->getDoctrine()->getManager();
            $entityManager->remove($featureValue);
            $entityManager->flush();

            $this->addFlash('success', $translator->trans('featureValue.flash.deleted'));
        }

        return $this->redirectToRoute('back_feature_index');
    }
}
