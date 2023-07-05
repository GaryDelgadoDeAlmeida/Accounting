<?php

namespace App\Repository;

use App\Entity\Invoice;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

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
     * @param int companyID
     * @param int userID
     * @return Invoice[]
     */
    function getInvoicesByClientAndUser(int $companyID, int $userID) {
        return $this->createQueryBuilder("invoice")
            ->leftJoin("invoice.company", "company")
            ->leftJoin("invoice.user", "user")
            ->where("company.id = :companyID")
            ->where("user.id = :userID")
            ->setParameters([
                "companyID" => $companyID,
                "userID" => $userID
            ])
            ->getQuery()
            ->getResult()
        ;
    }
}
