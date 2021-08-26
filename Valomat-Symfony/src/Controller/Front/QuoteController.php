<?php

namespace App\Controller\Front;

use App\Entity\{Product,Quote};
use App\Form\QuoteType;
use App\Service\NotificationService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\{Request,Response};
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Contracts\Translation\TranslatorInterface;

/**
 * Class QuoteController
 * @package App\Controller\Front
 * @Route("/quote", name="quote_")
 */
class QuoteController extends AbstractController
{
    /**
     * @Route("/new", name="new", methods={"GET","POST"})
     * @param Request $request
     * @param NotificationService $notificationService
     * @param TranslatorInterface $translator
     * @return Response
     */
    public function new(Request $request, NotificationService $notificationService, TranslatorInterface $translator): Response
    {
        $entityManager = $this->getDoctrine()->getManager();

        $product = null;
        $slug = $request->query->get('slug');
        if (!empty($slug)) {
            $product = $entityManager->getRepository(Product::class)->findOneBy([
                "slug" => $slug
            ]);
        }

        $quote = new Quote();
        $form = $this->createForm(QuoteType::class, $quote, ['product' => $product]);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {

            $entityManager->persist($quote);
            $entityManager->flush();

            if (!$notificationService->sendEmail(
                $_ENV['VALOMAT_EMAIL'],
                $_ENV['VALOMAT_EMAIL'],
                $translator->trans('mail.quote.subject'),
                'email/quote.html.twig',
                ['quote' => $quote]
            )){
                $this->addFlash('danger', $translator->trans('quote.flash.error'));
            }

            $this->addFlash('success', $translator->trans('quote.flash.send'));
            return $this->redirectToRoute('front_quote_new');
        }

        $response = $this->render('front/quote/new.html.twig', [
            'quote' => $quote,
            'form' => $form->createView(),
        ]);

        $response->setSharedMaxAge(43200);
        $response->headers->addCacheControlDirective('must-revalidate', true);

        return $response;
    }
}