<?php

namespace App\Repository;

use App\Entity\Estimate;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Estimate>
 *
 * @method Estimate|null find($id, $lockMode = null, $lockVersion = null)
 * @method Estimate|null findOneBy(array $criteria, array $orderBy = null)
 * @method Estimate[]    findAll()
 * @method Estimate[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class EstimateRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Estimate::class);
    }

    public function save(Estimate $entity, bool $flush = false): void
    {
        $this->getEntityManager()->persist($entity);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

    public function remove(Estimate $entity, bool $flush = false): void
    {
        $this->getEntityManager()->remove($entity);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

    /**
     * Get estimates
     * 
     * @param int userID
     * @param int offset
     * @param int limit
     * @return Estimate[]
     */
    public function getEstimates(int $userID, int $offset, int $limit) {
        return $this->createQueryBuilder("estimate")
            ->setFirstResult(($offset - 1) * $limit)
            ->setMaxResults($limit)
            ->getQuery()
            ->getResult()
        ;
    }

    /**
     * @param int companyID
     * @param int userID
     * @return Estimate[]
     */
    public function getEstimatesByCompanyAndUser(int $companyID, int $userID) {
        return $this->createQueryBuilder("estimate")
            ->leftJoin("estimate.company", "company")
            ->leftJoin("estimate.user", "user")
            ->where("company.id = :companyID")
            ->andWhere("user.id = :userID")
            ->setParameters([
                "companyID" => $companyID,
                "userID" => $userID
            ])
            ->getQuery()
            ->getResult()
        ;
    }
}
