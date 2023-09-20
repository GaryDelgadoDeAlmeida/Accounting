<?php

namespace App\Enum;

abstract class FreelanceEnum {

    public const FREELANCE_NAME = "name";
    public const FREELANCE_JURIDIC_STATUS = "status";
    public const FREELANCE_ADDRESS = "address";
    public const FREELANCE_ZIPCODE = "zip_code";
    public const FREELANCE_CITY = "city";
    public const FREELANCE_COUNTRY = "country";
    public const FREELANCE_SIREN = "siren";
    public const FREELANCE_SIRET = "siret";
    public const FREELANCE_DUNS_NUMBER = "duns_number";

    public static function getAvalaibleChoices() : array {
        return [
            self::FREELANCE_NAME,
            self::FREELANCE_JURIDIC_STATUS,
            self::FREELANCE_ADDRESS,
            self::FREELANCE_ZIPCODE,
            self::FREELANCE_CITY,
            self::FREELANCE_COUNTRY,
            self::FREELANCE_SIREN,
            self::FREELANCE_SIRET,
            self::FREELANCE_DUNS_NUMBER,
        ];
    }
}