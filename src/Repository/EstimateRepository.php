<?php

namespace App\Repository;

use App\Entity\User;
use App\Entity\Company;
use App\Entity\Estimate;
use Doctrine\Persistence\ManagerRegistry;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;

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
     * @param User user
     * @param int offset
     * @param int limit
     * @return Estimate[]
     */
    public function getEstimates(User $user, int $offset, int $limit) {
        return $this->createQueryBuilder("estimate")
            ->where("estimate.user = :user")
            ->setParameter("user", $user)
            ->setFirstResult(($offset - 1) * $limit)
            ->setMaxResults($limit)
            ->getQuery()
            ->getResult()
        ;
    }

    /**
     * @param Company company
     * @param User user
     * @return Estimate[]
     */
    public function getEstimatesByCompanyAndUser(Company $company, User $user) {
        return $this->createQueryBuilder("estimate")
            ->where("estimate.company = :company")
            ->andWhere("estimate.user = :user")
            ->setParameters([
                "company" => $company,
                "user" => $user
            ])
            ->getQuery()
            ->getResult()
        ;
    }

    /**
     * @param User user
     * @return int
     */
    public function countEstimatesByUser(User $user): int {
        return $this->createQueryBuilder("estimate")
            ->select("COUNT(estimate.id) as nbrEstimate")
            ->where("estimate.user = :user")
            ->setParameter("user", $user)
            ->getQuery()
            ->getOneOrNullResult()["nbrEstimate"] ?? 0
        ;
    }

    /**
     * 
     * @param Company company
     * @param User user
     * @return int
     */
    public function countEstimatesByCompanyAndUser(Company $company, User $user): int {
        return $this->createQueryBuilder("estimate")
            ->select("COUNT(estimate.id) as nbrEstimate")
            ->where("estimate.company = :company")
            ->andWhere("estimate.user = :user")
            ->setParameters([
                "company" => $company,
                "user" => $user
            ])
            ->getQuery()
            ->getOneOrNullResult()["nbrEstimate"] ?? 0
        ;
    }
}
