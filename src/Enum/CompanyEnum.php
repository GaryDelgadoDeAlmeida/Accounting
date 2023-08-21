<?php

namespace App\Enum;

abstract class CompanyEnum {

    public const COMPANY_NAME = "name";
    public const COMPANY_SIREN = "siren";
    public const COMPANY_SIRET = "siret";
    public const COMPANY_NUM_DNS = "numDns";
    public const COMPANY_ADDRESS = "address";
    public const COMPANY_ZIPCODE = "zip_code";
    public const COMPANY_CITY = "city";
    public const COMPANY_COUNTRY = "country";
    public const COMPANY_PHONE = "phone";
    public const COMPANY_EMAIL = "email";

    protected static array $typeName = [
        self::COMPANY_NAME => "Name",
        self::COMPANY_SIREN => "N° Siren",
        self::COMPANY_SIRET => "N° Siret",
        self::COMPANY_NUM_DNS => "N° DSN",
        self::COMPANY_ADDRESS => "Address",
        self::COMPANY_ZIPCODE => "Zip code",
        self::COMPANY_CITY => "City",
        self::COMPANY_COUNTRY => "Country",
        self::COMPANY_PHONE => "Phone",
        self::COMPANY_EMAIL => "Email"
    ];

    public static function getAvailableChoices() {
        return [
            self::COMPANY_NAME,
            self::COMPANY_SIREN,
            self::COMPANY_SIRET,
            self::COMPANY_NUM_DNS,
            self::COMPANY_ADDRESS,
            self::COMPANY_ZIPCODE,
            self::COMPANY_CITY,
            self::COMPANY_COUNTRY,
            self::COMPANY_PHONE,
            self::COMPANY_EMAIL
        ];
    }

    public static function getChoices() {
        $choices = [];

        foreach(self::getAvailableChoices() as $key => $value) {
            $choices[static::$typeName[$key]] = $value;
        }

        return $choices;
    }
}