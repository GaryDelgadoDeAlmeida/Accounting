<?php

namespace App\Repository;

use App\Entity\User;
use App\Entity\Company;
use App\Entity\Invoice;
use Doctrine\ORM\Query\Expr\Join;
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

    /**
     * Get the total benefit of a given month
     * 
     * @param User user id
     * @param \DateTime month
     * @return int
     */
    public function getMonthBenefit(User $user, int $month) {
        return $this->createQueryBuilder("invoice")
            ->innerJoin("App\Entity\InvoiceDetail", "invoiceDetail", Join::WITH, "invoice.id = invoiceDetail.invoice")
            ->leftJoin("invoice.user", "user")
            ->where("invoice.createdAt = :month")
            ->andWhere("user.id = :user")
            ->setParameters([
                "month" => $month,
                "user" => $user->getId()
            ])
            ->getQuery()
            ->getOneOrNullResult()["benefits"] ?? 0
        ;
    }

    /**
     * Get the total benefit of a given year
     * 
     * @param User user id
     * @param DateTime date
     * @return int Return the benefit of a year
     */
    public function getYearBenefit(User $user, int $year) {
        return $this->createQueryBuilder("invoice")
            ->innerJoin("App\Entity\InvoiceDetail", "invoiceDetail", Join::WITH, "invoice.id = invoiceDetail.invoice")
            ->leftJoin("invoice.user", "user")
            ->select("SUM(invoiceDetail.price) as benefits")
            ->where("YEAR(invoice.createdAt) = :year")
            ->andWhere("user.id = :user")
            ->setParameters([
                "year" => $year,
                "user" => $user->getId()
            ])
            ->getQuery()
            ->getOneOrNullResult()["benefits"] ?? 0
        ;
    }

    /**
     * 
     * @param User user
     * @param \DateTime year
     * @return Invoice[]
     */
    public function getDetailYearBenefit(User $user, int $year) {
        return $this->createQueryBuilder("invoice")
            ->innerJoin("App\Entity\InvoiceDetail", "invoiceDetail", Join::WITH, "invoice.id = invoiceDetail.invoice")
            ->leftJoin("invoice.user", "user")
            ->where("YEAR(invoice.createdAt) = :year")
            ->andWhere("user.id = :user")
            ->setParameters([
                "year" => $year,
                "user" => $user->getId()
            ])
            ->getQuery()
            ->getResult()
        ;
    }
}
