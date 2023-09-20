<?php

namespace App\Manager;

use App\Enum\FreelanceEnum;
use App\Repository\FreelanceRepository;

class FreelanceManager {

    private FreelanceRepository $freelanceRepository;

    function __construct(FreelanceRepository $freelanceRepository) {
        $this->freelanceRepository = $freelanceRepository;
    }

    public function checkFields(array $fields) : array {
        // 
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