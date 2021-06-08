<?php

namespace App\Controller\Front;

use App\Entity\Category;
use App\Repository\ProductRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\{JsonResponse, Request, Response};
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Serializer\SerializerInterface;

/**
 * @Route("/category", name="category_")
 */
class CategoryController extends AbstractController
{
    /**
     * @Route("/{slug}", name="index", methods={"GET"}, defaults={"page"="1"})
     * @param Request $request
     * @param Category $category
     * @param ProductRepository $productRepository
     * @param SerializerInterface $serializer
     * @return Response|JsonResponse
     */
    public function index(Request $request, Category $category, ProductRepository $productRepository, SerializerInterface $serializer): Response
    {
        if ($request->isXmlHttpRequest()){
            $products = $productRepository->findByCategoryByPage($category,
                $request->query->has('page') ? $request->query->get('page') : 1);

            return new JsonResponse($serializer->serialize($products, 'json', ['groups' => 'product']));
        }

        $response = $this->render('front/category/index.html.twig', [
            'category' => $category
        ]);

        $response->setSharedMaxAge(43200);
        $response->headers->addCacheControlDirective('must-revalidate', true);

        return $response;
    }
}
