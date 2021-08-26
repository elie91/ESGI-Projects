<?php

namespace App\Controller\Front;

use App\Form\SearchProductType;
use App\Data\SearchProductData;
use App\Repository\CategoryRepository;
use App\Repository\ProductRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\{JsonResponse,Request,Response};
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Serializer\SerializerInterface;

class HomeController extends AbstractController
{
    /**
     * @Route("/", name="index", methods={"GET"})
     * @param Request $request
     * @param ProductRepository $productRepository
     * @param SerializerInterface $serializer
     * @return  Response|JsonResponse
     */
    public function index(Request $request, ProductRepository $productRepository, SerializerInterface $serializer)
    {
        $data = new SearchProductData();
        $form = $this->createForm(SearchProductType::class, $data);
        $form->handleRequest($request);

        if ($request->isXmlHttpRequest()) {
            $products = $productRepository->findResearch($request->query->all());

            return new JsonResponse($serializer->serialize($products, 'json', ['groups' => 'product']));
        }

        $response = $this->render('front/index.html.twig', [
            'form' => $form->createView()
        ]);

        $response->setSharedMaxAge(43200);
        $response->headers->addCacheControlDirective('must-revalidate', true);

        return $response;
    }
}