<?php

namespace App\Controller\Front;

use App\Entity\Product;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

/**
 * @Route("/product", name="product_")
 */
class ProductController extends AbstractController
{
    /**
     * @Route("/{slug}", name="show", methods={"GET"})
     * @param Product $product
     * @return Response
     */
    public function show(Product $product): Response
    {
        $response = $this->render('front/product/show.html.twig', [
            'product' => $product,
        ]);

        $response->setSharedMaxAge(43200);
        $response->headers->addCacheControlDirective('must-revalidate', true);

        return $response;
    }
}
