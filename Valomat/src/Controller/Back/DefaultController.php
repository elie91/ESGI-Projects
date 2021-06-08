<?php
namespace App\Controller\Back;

use App\Repository\{ProductRepository,QuoteRepository,UserRepository};
use Sensio\Bundle\FrameworkExtraBundle\Configuration\IsGranted;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class DefaultController extends AbstractController
{

    /**
     * @Route("/", name="index", methods={"GET"})
     * @param UserRepository $userRepository
     * @param ProductRepository $productRepository
     * @param QuoteRepository $quoteRepository
     * @return Response
     * @IsGranted("ROLE_ADMIN")
     */
    public function index(UserRepository $userRepository, ProductRepository $productRepository, QuoteRepository $quoteRepository):Response
    {
        $users = $userRepository->findAll();
        $products = $productRepository->findBy(in_array(
            'ROLE_ADMIN',
            $this->getUser()->getRoles()) ? ['active' => 1] : ['active' => 1, 'userId' => $this->getUser()->getId()]
        );
        $quotes = $quoteRepository->findAll();

        return $this->render('back/index.html.twig', [
            'nb_users' => count($users) - 1,
            'nb_product' => count($products),
            'nb_quotes' => count($quotes)
        ]);
    }

}