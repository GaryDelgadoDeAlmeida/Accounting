<?php

namespace App\Repository;

use App\Entity\User;
use App\Entity\Company;
use Doctrine\Persistence\ManagerRegistry;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;

/**
 * @extends ServiceEntityRepository<Company>
 *
 * @method Company|null find($id, $lockMode = null, $lockVersion = null)
 * @method Company|null findOneBy(array $criteria, array $orderBy = null)
 * @method Company[]    findAll()
 * @method Company[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class CompanyRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Company::class);
    }

    /**
     * @param Company entity
     * @param bool flush
     * @return void
     */
    public function save(Company $entity, bool $flush = false): void
    {
        $this->getEntityManager()->persist($entity);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

    /**
     * @param Company 
     * @param bool flush
     * @return void
     */
    public function remove(Company $entity, bool $flush = false): void
    {
        $this->getEntityManager()->remove($entity);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

    /**
     * @param int offset
     * @param int limit
     * @return array
     */
    public function getCompanies(int $offset = 1, int $limit = 10)
    {
        return $this->createQueryBuilder("company")
            ->setMaxResults($limit)
            ->setFirstResult(($offset - 1) * $limit)
            ->orderBy("company.name", "ASC")
            ->getQuery()
            ->getResult()
        ;
    }

    /**
     * @param User user
     * @param int offset
     * @param int limit
     * @return array
     */
    public function getCompaniesByUser(User $user, int $offset = 1, int $limit = 10)
    {
        return $this->createQueryBuilder("company")
            ->leftJoin("company.users", "user")
            ->where("user = :user")
            ->setParameter("user", $user)
            ->setMaxResults($limit)
            ->setFirstResult(($offset - 1) * $limit)
            ->orderBy("company.name", "ASC")
            ->getQuery()
            ->getResult()
        ;
    }

    /**
     * Count all clients of an user
     * 
     * @param int user
     * @return void
     */
    public function countCompanies(User $user) {
        return $this->createQueryBuilder("company")
            ->select("COUNT(company.id) as nbrCompanies")
            ->where("company.user = :user")
            ->setParameter("user", $user)
            ->getQuery()
            ->getSingleResult()["nbrCompanies"]
        ;
    }
}
