<?php

namespace App\Repository;

use App\Data\SearchProductData;
use App\Entity\Category;
use App\Entity\Product;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Common\Persistence\ManagerRegistry;
use Doctrine\ORM\QueryBuilder;
use Knp\Component\Pager\Pagination\PaginationInterface;
use Knp\Component\Pager\PaginatorInterface;
use Symfony\Component\HttpFoundation\Request;

/**
 * @method Product|null find($id, $lockMode = null, $lockVersion = null)
 * @method Product|null findOneBy(array $criteria, array $orderBy = null)
 * @method Product[]    findAll()
 * @method Product[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class ProductRepository extends ServiceEntityRepository
{
    /**
     * @var PaginatorInterface
     */
    private $paginator;

    public function __construct(ManagerRegistry $registry, PaginatorInterface $paginator)
    {
        parent::__construct($registry, Product::class);
        $this->paginator = $paginator;
    }

    /**
     * Récupère tous les produits
     * @param Request $request
     * @param array $data
     * @return PaginationInterface
     */
    public function getAll(Request $request, array $data = null)
    {
        $query = $this->createQueryBuilder('product')->select('product');

        if (!empty($data) && isset($data['search'])) {
            $search = strtolower($data['search']);
            $query->andWhere("
                lower(product.name) LIKE :search
                OR lower(product.reference) LIKE :search
            ");
            $query->setParameter('search', "%{$search}%");
        }

        $query->orderBy('product.id', 'asc');
        return $this->paginator->paginate($query, $request->query->getInt('page', 1), 20);
    }

    /**
     * Récupère tous les produits d'un user
     * @param Request $request
     * @param string $id
     * @param array $data
     * @return PaginationInterface
     */
    public function getByUser(Request $request, string $id, array $data = null)
    {
        $query = $this->createQueryBuilder('product')
            ->select('product')
            ->where('product.userId = :userId');

        if (isset($data['search']) && $data['search'] !== null) {
            $search = strtolower($data['search']);
            $query->andWhere("
                lower(product.name) LIKE :search
                OR lower(product.reference) LIKE :search
            ");
            $query->setParameter('search', "%{$search}%");
        }

        $query->orderBy('product.id', 'asc')
            ->setParameter('userId', $id);
        return $this->paginator->paginate($query, $request->query->getInt('page', 1), 20);
    }


    /**
     * Récupére les produits en lien avec une recherche
     * @param array $params
     * @return array
     */
    public function findResearch(array $params)
    {
        return $this->getResearchQuery($params)->getQuery()->getResult();
    }


    /**
     * Génére et retourne la requête SQL de recherche
     * @param array $search
     * @return QueryBuilder
     */
    private function getResearchQuery(array $search): QueryBuilder
    {
        $query = $this
            ->createQueryBuilder('product')
            ->select('product');

        $params = [];

        if (!empty($search["name"])) {
            $name = strtolower($search["name"]);
            $query->andWhere('lower(product.name) LIKE :name');
            $params['name'] = "%{$name}%";
        }
        if (!empty($search["categories"])) {
            $query
                ->leftJoin('product.categories', 'categories')
                ->andWhere('categories.id = :category');
            $params['category'] = $search["categories"];
        }
        if (!empty($search["aloy"])) {
            $query
                ->leftJoin('product.featureValues', 'featureValues')
                ->andWhere('featureValues.value = :aloy');
            $params['aloy'] = $search["aloy"];
        }

        $query
            ->setFirstResult($search["page"] == 1 ? 0 : ($search["page"] - 1) * 30)
            ->setMaxResults(30)
            ->setParameters($params);

        return $query;
    }

    public function findByCategoryByPage(Category $category, int $page = 1)
    {
        $query = $this->createQueryBuilder('p')
            ->join('p.categories', 'c')
            ->where('c.id = :id')
            ->setFirstResult($page == 1 ? 0 : ($page - 1) * 20)
            ->setMaxResults(20)
            ->setParameter('id', $category->getId());

        return $query->getQuery()->getResult();
    }
}
