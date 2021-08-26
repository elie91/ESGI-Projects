<?php

namespace App\Service;

use App\Repository\CategoryRepository;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;

class NavigationService
{
    private $categoryRepository;

    private $token;

    public function __construct(CategoryRepository $categoryRepository, TokenStorageInterface $token)
    {
        $this->categoryRepository = $categoryRepository;
        $this->token = $token;
    }

    public function getAll(){
        return $this->categoryRepository->findAll();
    }

    public function isAdmin(){
        if (in_array('ROLE_ADMIN', $this->token->getToken()->getUser()->getRoles())){
            return true;
        }
        return false;
    }
}