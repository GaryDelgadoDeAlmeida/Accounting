<?php

namespace App\Manager;

use App\Entity\User;
use App\Entity\Company;
use App\Enum\CompanyEnum;
use App\Enum\MessageEnum;
use App\Manager\FormManager;
use App\Repository\CompanyRepository;
use Doctrine\ORM\EntityManagerInterface;

class CompanyManager {

    private EntityManagerInterface $em;
    private FormManager $formManager;
    private CompanyRepository $companyRepository;

    function __construct(
        EntityManagerInterface $em,
        FormManager $formManager,
        CompanyRepository $companyRepository
    ) {
        $this->em = $em;
        $this->formManager = $formManager;
        $this->companyRepository = $companyRepository;
    }

    /**
     * Check if all company fields respect the restriction
     * 
     * @param array json content
     * @return array fields
     */
    public function checkCompanyFields(array $jsonContent) {
        $fields = [];
        $companyFieldName = CompanyEnum::getAvailableChoices();
        
        foreach($jsonContent as $key => $value) {
            if(!in_array($key, $companyFieldName)) {
                continue;
            }
            
            if(in_array($key, [CompanyEnum::COMPANY_NAME, CompanyEnum::COMPANY_ADDRESS, CompanyEnum::COMPANY_EMAIL]) && strlen($value) > 255) {
                throw new \Exception(
                    str_replace(["%INPUT_VALUE%", "%CARACTER_LENGTH%"], [$key, 255], MessageEnum::FORM_CARACTER_LENGTH_ERROR)
                );
            }

            if(in_array($key, [CompanyEnum::COMPANY_SIREN, CompanyEnum::COMPANY_SIRET, CompanyEnum::COMPANY_NUM_DNS])) {
                if(!is_numeric($value)) {
                    throw new \Exception(
                        str_replace("%INPUT_VALUE%", $key, MessageEnum::FORM_NUMERIC_ERROR)
                    );
                }

                $maxLength = 9;
                if($key === CompanyEnum::COMPANY_SIRET) {
                    $maxLength = 14;
                }

                if(strlen($value) > $maxLength) {
                    throw new \Exception(
                        str_replace(["%INPUT_VALUE%", "%CARACTER_LENGTH%"], [$key, $maxLength], MessageEnum::FORM_CARACTER_LENGTH_ERROR)
                    );
                }
            }

            if($key === CompanyEnum::COMPANY_ZIPCODE && strlen($value) > 5) {
                throw new \Exception(
                    str_replace(["%INPUT_VALUE%", "%CARACTER_LENGTH%"], [$key, 5], MessageEnum::FORM_CARACTER_LENGTH_ERROR)
                );
            }

            if($key === CompanyEnum::COMPANY_EMAIL && !$this->formManager->isEmail($value)) {
                throw new \Exception(
                    str_replace("%INPUT_VALUE%", $key, MessageEnum::FORM_INVALID_MAIL_ERROR)
                );
            }

            $fields[$key] = $value;
        }

        return $fields;
    }

    /**
     * @param array fields
     * @param User user
     * @param ?Company Company object
     * @return Company Return the new company object
     */
    public function fillCompany(array $fields, User $user, Company $company = new Company()) {
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

        if($company->getId() == null) {
            $company->addUser($user);
        }

        $this->companyRepository->save($company, true);

        return $company;
    }
}