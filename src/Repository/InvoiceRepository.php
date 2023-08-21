<?php

namespace App\Repository;

use App\Entity\User;
use App\Entity\Company;
use App\Entity\Invoice;
use Doctrine\Persistence\ManagerRegistry;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;

/**
 * @extends ServiceEntityRepository<Invoice>
 *
 * @method Invoice|null find($id, $lockMode = null, $lockVersion = null)
 * @method Invoice|null findOneBy(array $criteria, array $orderBy = null)
 * @method Invoice[]    findAll()
 * @method Invoice[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class InvoiceRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Invoice::class);
    }

    public function save(Invoice $entity, bool $flush = false): void
    {
        $this->getEntityManager()->persist($entity);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

    public function remove(Invoice $entity, bool $flush = false): void
    {
        $this->getEntityManager()->remove($entity);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

    /**
     * Get invoice attached to an user
     * 
     * @param int userID
     * @param int offset
     * @param int limit
     * @return Invoice[]
     */
    function getInvoices(int $userID, int $offset, int $limit) {
        return $this->createQueryBuilder("invoice")
            ->leftJoin("invoice.user", "user")
            ->where("user.id = :userID")
            ->orderBy("invoice.id", "DESC")
            ->setParameter("userID", $userID)
            ->setFirstResult(($offset - 1) * $limit)
            ->setMaxResults($limit)
            ->getQuery()
            ->getResult()
        ;
    }

    /**
     * @param Company company
     * @param User user
     * @return Invoice[]
     */
    public function getInvoicesByClientAndUser(Company $company, User $user) {
        return $this->createQueryBuilder("invoice")
            ->where("invoice.company = :company")
            ->andWhere("invoice.user = :user")
            ->setParameters([
                "company" => $company,
                "user" => $user
            ])
            ->getQuery()
            ->getResult()
        ;
    }
}
