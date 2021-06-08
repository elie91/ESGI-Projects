<?php

namespace App\Controller\Back;

use App\Entity\Quote;
use App\Form\{QuoteType,SearchInTableType};
use App\Repository\QuoteRepository;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\IsGranted;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\{Request,Response};
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Contracts\Translation\TranslatorInterface;

/**
 * @Route("/quote")
 * @IsGranted("ROLE_ADMIN")
 */
class QuoteController extends AbstractController
{
    /**
     * @Route("/", name="quote_index", methods={"GET"})
     * @param QuoteRepository $quoteRepository
     * @param Request $request
     * @return Response
     */
    public function index(QuoteRepository $quoteRepository, Request $request): Response
    {
        $form = $this->createForm(SearchInTableType::class);
        $form->handleRequest($request);

        return $this->render('back/quote/index.html.twig', [
            'quotes' => $quoteRepository->getAll($request, $form->getData()),
            'form' => $form->createView()
        ]);
    }

    /**
     * @Route("/new", name="quote_new", methods={"GET","POST"})
     * @param Request $request
     * @param TranslatorInterface $translator
     * @return Response
     */
    public function new(Request $request, TranslatorInterface $translator): Response
    {
        $quote = new Quote();
        $form = $this->createForm(QuoteType::class, $quote);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $entityManager = $this->getDoctrine()->getManager();
            $entityManager->persist($quote);
            $entityManager->flush();

            $this->addFlash('success', $translator->trans('quote.flash.new'));

            return $this->redirectToRoute('quote_index');
        }

        return $this->render('back/quote/new.html.twig', [
            'quote' => $quote,
            'form' => $form->createView(),
        ]);
    }

    /**
     * @Route("/{id}", name="quote_show", methods={"GET"})
     * @param Quote $quote
     * @return Response
     */
    public function show(Quote $quote): Response
    {
        return $this->render('back/quote/show.html.twig', [
            'quote' => $quote,
        ]);
    }

    /**
     * @Route("/{id}/edit", name="quote_edit", methods={"GET","POST"})
     * @param Request $request
     * @param TranslatorInterface $translator
     * @param Quote $quote
     * @return Response
     */
    public function edit(Request $request, TranslatorInterface $translator, Quote $quote): Response
    {
        $form = $this->createForm(QuoteType::class, $quote);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $this->getDoctrine()->getManager()->flush();

            $this->addFlash('success', $translator->trans('quote.flash.update'));

            return $this->redirectToRoute('back_quote_index');
        }

        return $this->render('back/quote/edit.html.twig', [
            'quote' => $quote,
            'form' => $form->createView(),
        ]);
    }

    /**
     * @Route("/{id}", name="quote_delete", methods={"DELETE"})
     * @param Request $request
     * @param Quote $quote
     * @param TranslatorInterface $translator
     * @return Response
     */
    public function delete(Request $request, Quote $quote, TranslatorInterface $translator): Response
    {
        if ($this->isCsrfTokenValid('delete' . $quote->getId(), $request->request->get('_token'))) {
            $entityManager = $this->getDoctrine()->getManager();
            $entityManager->remove($quote);
            $entityManager->flush();

            $this->addFlash('success', $translator->trans('quote.flash.delete'));
        }

        return $this->redirectToRoute('back_quote_index');
    }
}
