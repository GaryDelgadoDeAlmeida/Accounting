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
    public const FREELANCE_PHONE_NUMBER = "phone";

    public static array $typeName = [
        self::FREELANCE_NAME => "Name",
        self::FREELANCE_JURIDIC_STATUS => "Status",
        self::FREELANCE_ADDRESS => "Address",
        self::FREELANCE_ZIPCODE => "Zip code",
        self::FREELANCE_CITY => "City",
        self::FREELANCE_COUNTRY => "Country",
        self::FREELANCE_SIREN => "Siren",
        self::FREELANCE_SIRET => "Siret",
        self::FREELANCE_DUNS_NUMBER => "DUNS number",
        self::FREELANCE_PHONE_NUMBER => "Phone number"
    ];

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
            self::FREELANCE_PHONE_NUMBER
        ];
    }

    public static function getChoices() : array {
        $choices = [];

        foreach(self::getAvalaibleChoices() as $choice) {
            $choice[self::$typeName[$choice]] = $choice;
        }

        return $choices;
    }
}