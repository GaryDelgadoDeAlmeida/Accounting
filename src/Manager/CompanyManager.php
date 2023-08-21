<?php

namespace App\Manager;

use MessageEnum;
use App\Entity\Company;
use App\Enum\CompanyEnum;
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

    public function checkCompanyFields(array $contentCompany) {
        $fields = [];
        $companyFieldName = CompanyEnum::getAvailableChoices();
        
        foreach($contentCompany as $key => $value) {
            if(!in_array($key, $companyFieldName)) {
                continue;
            }
            
            if(in_array($key, [CompanyEnum::COMPANY_NAME, CompanyEnum::COMPANY_ADDRESS, CompanyEnum::COMPANY_EMAIL]) && strlen($value) > 255) {
                throw new \Error(
                    str_replace(["%INPUT_VALUE%", "%CARACTER_LENGTH%"], [$key, 255], MessageEnum::FORM_CARACTER_LENGTH_ERROR)
                );
            }

            if(in_array($key, [CompanyEnum::COMPANY_SIREN, CompanyEnum::COMPANY_SIRET, CompanyEnum::COMPANY_NUM_DNS])) {
                if(!is_numeric($value)) {
                    throw new \Error(
                        str_replace("%INPUT_VALUE%", $key, MessageEnum::FORM_NUMERIC_ERROR)
                    );
                }

                $maxLength = 9;
                if($key === CompanyEnum::COMPANY_SIREN) {
                    $maxLength = 14;
                }

                if(strlen($value) > $maxLength) {
                    throw new \Error(
                        str_replace(["%INPUT_VALUE%", "%CARACTER_LENGTH%"], [$key, $maxLength], MessageEnum::FORM_CARACTER_LENGTH_ERROR)
                    );
                }
            }

            if($key === CompanyEnum::COMPANY_ZIPCODE && strlen($value) > 5) {
                throw new \Error(
                    str_replace(["%INPUT_VALUE%", "%CARACTER_LENGTH%"], [$key, 5], MessageEnum::FORM_CARACTER_LENGTH_ERROR)
                );
            }

            if($key === CompanyEnum::COMPANY_EMAIL && !preg_match("", $value)) {
                throw new \Error(
                    str_replace("%INPUT_VALUE%", $key, MessageEnum::FORM_INVALID_MAIL_ERROR)
                );
            }

            $fields[$key] = $value;
        }

        return $fields;
    }

    /**
     * @param array field
     */
    public function fillCompany(array $fields, Company $company = new Company()) {
        foreach($fields as $field => $value) {
            if($field === CompanyEnum::COMPANY_NAME) $company->setName($value);
            elseif($field === CompanyEnum::COMPANY_SIREN) $company->setSiren($value);
            elseif($field === CompanyEnum::COMPANY_SIRET) $company->setSiret($value);
            elseif($field === CompanyEnum::COMPANY_NUM_DNS) $company->setDunsNumber($value);
            elseif($field === CompanyEnum::COMPANY_ADDRESS) $company->setAddress($value);
            elseif($field === CompanyEnum::COMPANY_ZIPCODE) $company->setZipCode($value);
            elseif($field === CompanyEnum::COMPANY_CITY) $company->setCity($value);
            elseif($field === CompanyEnum::COMPANY_COUNTRY) $company->setCountry($value);
            elseif($field === CompanyEnum::COMPANY_PHONE) $company->setPhone($value);
            elseif($field === CompanyEnum::COMPANY_EMAIL) $company->setEmail($value);
        }

        $this->companyRepository->save($company, true);

        return $company;
    }
}