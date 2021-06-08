<?php

namespace App\Controller\Back;

use App\Entity\Product;
use App\Form\{ImportType,ProductType,SearchInTableType};
use App\Repository\ProductRepository;
use App\Service\{FileUploader,ImportProduct};
use Sensio\Bundle\FrameworkExtraBundle\Configuration\IsGranted;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\{Request,Response};
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Contracts\Translation\TranslatorInterface;

/**
 * @Route("/product", name="product_")
 */
class ProductController extends AbstractController
{
    /**
     * @Route("/", name="index", methods={"GET"})
     * @param ProductRepository $productRepository
     * @param Request $request
     * @return Response
     */
    public function index(ProductRepository $productRepository, Request $request): Response
    {
        $products = null;

        $form = $this->createForm(SearchInTableType::class);
        $form->handleRequest($request);

        if (!in_array('ROLE_ADMIN', $this->getUser()->getRoles())) {
            $products = $productRepository->getByUser($request, $this->getUser()->getId(), $form->getData());
        } else {
            $products = $productRepository->getAll($request, $form->getData());
        }

        return $this->render('back/product/index.html.twig', [
            'products' => $products,
            'form' => $form->createView()
        ]);
    }

    /**
     * @IsGranted("ROLE_ADMIN")
     * @Route("/import", name="import", methods={"POST", "GET"})
     * @param Request $request
     * @param FileUploader $fileUploader
     * @param ImportProduct $importProduct
     * @param TranslatorInterface $translator
     * @return Response
     */
    public function import(Request $request, FileUploader $fileUploader, ImportProduct $importProduct, TranslatorInterface $translator): Response
    {
        $form = $this->createForm(ImportType::class);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $file = $form['file']->getData();
            if($file->getClientMimeType() !== 'text/csv'){
                $this->addFlash('danger', $translator->trans('product.flash.import.mime'));
                return $this->redirectToRoute('back_product_import');
            }
            if ($file) {
                $fileName = $fileUploader->upload($file);
                if ($fileName) {
                    $messages = $importProduct->exec($fileName);

                    $this->addFlash('success', $translator->trans('product.flash.import.success'));
                } else {
                    $this->addFlash('danger', $translator->trans('product.flash.import.error'));
                }
            }
        }

        return $this->render('back/product/import.html.twig', [
            'form' => $form->createView(),
            'messages' => isset($messages) ? $messages : null
        ]);

    }

    /**
     * @IsGranted("ROLE_ADMIN")
     * @Route("/new", name="new", methods={"GET","POST"})
     * @param Request $request
     * @param TranslatorInterface $translator
     * @return Response
     */
    public function new(Request $request, TranslatorInterface $translator): Response
    {
        $product = new Product();
        $form = $this->createForm(ProductType::class, $product);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $entityManager = $this->getDoctrine()->getManager();
            $entityManager->persist($product);
            $entityManager->flush();

            $this->addFlash('success', $translator->trans('product.flash.new'));

            return $this->redirectToRoute('back_product_index');
        }

        return $this->render('back/product/new.html.twig', [
            'product' => $product,
            'form' => $form->createView(),
        ]);
    }

    /**
     * @Route("/{id}", name="show", methods={"GET"})
     * @param Product $product
     * @param TranslatorInterface $translator
     * @return Response
     */
    public function show(Product $product, TranslatorInterface $translator): Response
    {
        if (!in_array("ROLE_ADMIN", $this->getUser()->getRoles()) &&
            $this->getUser()->getId() !== $product->getUserId()->getId()) {

            $this->addFlash('danger', $translator->trans('product.flash.denied'));

            return $this->redirectToRoute('back_product_index');
        }

        return $this->render('back/product/show.html.twig', [
            'product' => $product,
        ]);
    }

    /**
     * @IsGranted("ROLE_ADMIN")
     * @Route("/{id}/edit", name="edit", methods={"GET","POST"})
     * @param Request $request
     * @param TranslatorInterface $translator
     * @param Product $product
     * @return Response
     */
    public function edit(Request $request, TranslatorInterface $translator, Product $product): Response
    {
        $form = $this->createForm(ProductType::class, $product);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $this->getDoctrine()->getManager()->flush();

            $this->addFlash('success', $translator->trans('product.flash.updated'));

            return $this->redirectToRoute('back_product_index');
        }

        return $this->render('back/product/edit.html.twig', [
            'product' => $product,
            'form' => $form->createView(),
        ]);
    }

    /**
     * @IsGranted("ROLE_ADMIN")
     * @Route("/{id}", name="delete", methods={"DELETE"})
     * @param Request $request
     * @param TranslatorInterface $translator
     * @param Product $product
     * @return Response
     */
    public function delete(Request $request, TranslatorInterface $translator, Product $product): Response
    {
        if ($this->isCsrfTokenValid('delete' . $product->getId(), $request->request->get('_token'))) {
            $entityManager = $this->getDoctrine()->getManager();
            $entityManager->remove($product);
            $entityManager->flush();

            $this->addFlash('success', $translator->trans('product.flash.deleted'));
        }

        return $this->redirectToRoute('back_product_index');
    }
}
