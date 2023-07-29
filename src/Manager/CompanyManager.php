<?php

namespace App\Manager;

use App\Entity\Company;
use App\Repository\CompanyRepository;
use Doctrine\ORM\EntityManagerInterface;

class CompanyManager {

    private EntityManagerInterface $em;
    private CompanyRepository $companyRepository;

    function __construct(
        EntityManagerInterface $em,
        CompanyRepository $companyRepository
    ) {
        $this->em = $em;
        $this->companyRepository = $companyRepository;
    }

    /**
     * @param string company name
     */
    public function newCompany($requestContent) {
        $company = (new Company())
            ->setName($requestContent["name"] ?? "")
            ->setAddress($requestContent["address"] ?? "")
            ->setZipCode($requestContent["zip_code"] ?? "")
            ->setCity($requestContent["city"] ?? "")
            ->setCountry($requestContent["country"] ?? "")
            ->setSiren($requestContent["siren"] ?? "")
            ->setSiret($requestContent["siret"] ?? "")
            ->setDunsNumber($requestContent["dns_number"] ?? "")
            ->setPhone($requestContent["phone"] ?? "")
            ->setEmail($requestContent["email"] ?? "")
        ;

        $this->companyRepository->save($company, true);

        return $company;
    }
}