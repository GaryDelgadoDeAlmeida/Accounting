<?php

namespace App\Manager;

use App\Enum\FreelanceEnum;
use App\Manager\FormManager;
use App\Repository\FreelanceRepository;

class FreelanceManager {

    private FormManager $formManager;
    private FreelanceRepository $freelanceRepository;

    function __construct(FormManager $formManager, FreelanceRepository $freelanceRepository) {
        $this->formManager = $formManager;
        $this->freelanceRepository = $freelanceRepository;
    }

    /**
     * @param array sended json data
     */
    public function checkFields(array $jsonFields) : array {
        $fields = [];
        $allowedFreelanceFields = [];

        foreach($jsonFields as $key => $row) {
            if(!in_array($key, $allowedFreelanceFields)) {
                continue;
            }

            if(!$this->formManager->isEmpty($row)) {
                throw new \Exception(sprintf("The field %s can't be empty", $key));
            }

            if($key === FreelanceEnum::USER_ADDRESS) {
                if(!$this->formManager->checkMaxLength($row, 255)) {
                    throw new \Exception("Address exceed 255 characters length");
                }
            } elseif($key === FreelanceEnum::USER_ZIPCODE) {
                if(!$this->formManager->checkMaxLength($row, 10)) {
                    throw new \Exception("Zip code exceed 10 characters length");
                }

                if(!$this->formManager->isNumber($row)) {
                    throw new \Exception("Zip code format isn't valid. Allow number only");
                }
            } elseif($key === FreelanceEnum::USER_CITY) {
                if(!$this->formManager->checkMaxLength($row, 255)) {
                    throw new \Exception("The city exceed 255 characters length");
                }
            } elseif($key === FreelanceEnum::USER_COUNTRY) {
                // 
            } elseif($key === FreelanceEnum::USER_PHONE) {
                // Remove all spaces
                $row = str_replace(" ", "", $row);

                // Check the length of the phone number
                if(!$this->formManager->checkMaxLength($row, 10)) {
                    throw new \Exception("The phone number exceed 10 characters length");
                }

                // Check if the phone contains numbers only
                if(!$this->formManager->isNumber($row)) {
                    throw new \Exception("The phone number format isn't valid. Allow number only");
                }
            } 

            $fields[$key] = $row;
        }

        return $fields;
    }

    /**
     * Fill the freelance object
     * 
     * @param array fields
     * @param Freelance
     * @return Freelance
     */
    public function fillFreelance(array $fields, Freelance $freelance = new Freelance()) : Freelance {
        foreach($fields as $field => $value) {
            if($field === FreelanceEnum::FREELANCE_NAME) $freelance->setName($value);
            elseif($field === FreelanceEnum::FREELANCE_JURIDIC_STATUS) $freelance->setStatus($value);
            elseif($field === FreelanceEnum::FREELANCE_ADDRESS) $freelance->setAddress($value);
            elseif($field === FreelanceEnum::FREELANCE_ZIPCODE) $freelance->setZipCode($value);
            elseif($field === FreelanceEnum::FREELANCE_CITY) $freelance->setCity($value);
            elseif($field === FreelanceEnum::FREELANCE_COUNTRY) $freelance->setCountry($value);
            elseif($field === FreelanceEnum::FREELANCE_SIREN) $freelance->setSiren($value);
            elseif($field === FreelanceEnum::FREELANCE_SIRET) $freelance->setSiret($value);
            elseif($field === FreelanceEnum::FREELANCE_DUNS_NUMBER) $freelance->setDunsNumber($value);
        }

        $this->freelanceRepository->save($company, true);

        return $freelance;
    }
}