<?php

namespace App\Repository;

use App\Entity\Quote;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Common\Persistence\ManagerRegistry;
use Knp\Component\Pager\Pagination\PaginationInterface;
use Knp\Component\Pager\PaginatorInterface;
use Symfony\Component\HttpFoundation\Request;

/**
 * @method Quote|null find($id, $lockMode = null, $lockVersion = null)
 * @method Quote|null findOneBy(array $criteria, array $orderBy = null)
 * @method Quote[]    findAll()
 * @method Quote[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class QuoteRepository extends ServiceEntityRepository
{
    /**
     * @var PaginatorInterface
     */
    private $paginator;

    public function __construct(ManagerRegistry $registry, PaginatorInterface $paginator)
    {
        parent::__construct($registry, Quote::class);
        $this->paginator = $paginator;
    }

    /**
     * Récupère tous les devis
     * @param Request $request
     * @param array|null $data
     * @return PaginationInterface
     */
    public function getAll(Request $request, array $data = null)
    {
        $query = $this->createQueryBuilder('quote')->select('quote');
        if (!empty($data) && $data['search'] !== null) {
            $search = strtolower($data['search']);
            $query->andWhere("
                lower(quote.company) LIKE :search
                OR lower(quote.email) LIKE :search
                OR lower(quote.phone) LIKE :search
            ");
            $query->setParameter('search', "%{$search}%");
        }
        $query->orderBy('quote.id', 'desc');
        return $this->paginator->paginate($query, $request->query->getInt('page', 1), 20);
    }

}
