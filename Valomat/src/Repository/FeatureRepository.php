<?php

namespace App\Repository;

use App\Entity\Feature;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Common\Persistence\ManagerRegistry;
use Knp\Component\Pager\Pagination\PaginationInterface;
use Knp\Component\Pager\PaginatorInterface;
use Symfony\Component\HttpFoundation\Request;

/**
 * @method Feature|null find($id, $lockMode = null, $lockVersion = null)
 * @method Feature|null findOneBy(array $criteria, array $orderBy = null)
 * @method Feature[]    findAll()
 * @method Feature[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class FeatureRepository extends ServiceEntityRepository
{
    /**
     * @var PaginatorInterface
     */
    private $paginator;

    public function __construct(ManagerRegistry $registry, PaginatorInterface $paginator)
    {
        parent::__construct($registry, Feature::class);
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
        $query = $this->createQueryBuilder('feature')->select('feature');
        if (!empty($data) && $data['search'] !== null) {
            $search = strtolower($data['search']);
            $query->andWhere("
                lower(feature.name) LIKE :search
            ");
            $query->setParameter('search', "%{$search}%");
        }
        $query->orderBy('feature.id', 'asc');
        return $this->paginator->paginate($query, $request->query->getInt('page', 1), 20);
    }

}
