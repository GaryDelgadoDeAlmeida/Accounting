<?php

namespace App\Repository;

use App\Entity\Company;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

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
     * @param int offset
     * @param int limit
     * @return array
     */
    public function getCompaniesByUser(int $userID, int $offset = 1, int $limit = 10)
    {
        return $this->createQueryBuilder("company")
            ->leftJoin("company.users", "user")
            ->where("user.id = :userID")
            ->setParameter("userID", $userID)
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
    public function countCompanies(int $userID) {
        return $this->createQueryBuilder("company")
            ->select("COUNT(company.id) as nbrCompanies")
            ->leftJoin("company.users", "user")
            ->where("user.id = :userID")
            ->setParameter("userID", $userID)
            ->getQuery()
            ->getSingleResult()["nbrCompanies"]
        ;
    }
}
