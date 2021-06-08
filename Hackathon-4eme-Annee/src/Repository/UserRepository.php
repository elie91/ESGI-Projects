<?php

namespace App\Repository;

use App\Entity\User;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Common\Persistence\ManagerRegistry;

/**
 * @method User|null find($id, $lockMode = null, $lockVersion = null)
 * @method User|null findOneBy(array $criteria, array $orderBy = null)
 * @method User[]    findAll()
 * @method User[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class UserRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, User::class);
    }

    public function searchBy(array $data = null, User $current_user)
    {
        $query = $this->createQueryBuilder('user')
            ->select('user')
            ->where('user.id != :current_user')
            ->setParameter('current_user', $current_user->getId());

        if ($data !== null) {
            $search = strtolower($data['search']);
            $query->andWhere("
                lower(user.name) LIKE :search
                OR lower(user.firstname) LIKE :search
                OR lower(user.email) LIKE :search
            ");
            $query->setParameter('search', "%{$search}%");
        }

        $query->orderBy('user.name', 'asc');
        return $query->getQuery()->getResult();
    }
}
