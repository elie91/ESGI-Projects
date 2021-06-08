<?php

namespace App\Repository;

use App\Entity\Category;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Common\Persistence\ManagerRegistry;
use Knp\Component\Pager\Pagination\PaginationInterface;
use Knp\Component\Pager\PaginatorInterface;
use Symfony\Component\HttpFoundation\Request;

/**
 * @method Category|null find($id, $lockMode = null, $lockVersion = null)
 * @method Category|null findOneBy(array $criteria, array $orderBy = null)
 * @method Category[]    findAll()
 * @method Category[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class CategoryRepository extends ServiceEntityRepository
{
    /**
     * @var PaginatorInterface
     */
    private $paginator;

    public function __construct(ManagerRegistry $registry, PaginatorInterface $paginator)
    {
        parent::__construct($registry, Category::class);
        $this->paginator = $paginator;
    }

    /**
     * Récupère tous les catégories
     * @param Request $request
     * @param array|null $data
     * @return PaginationInterface
     */
    public function getAll(Request $request, array $data = null)
    {
        $query = $this->createQueryBuilder('category')->select('category');

        if (!empty($data) && $data['search'] !== null) {
            $search = strtolower($data['search']);
            $query->andWhere("
                lower(category.title) LIKE :search
            ");
            $query->setParameter('search', "%{$search}%");
        }

        $query->orderBy('category.id', 'asc');
        return $this->paginator->paginate($query, $request->query->getInt('page', 1), 20);
    }

}
