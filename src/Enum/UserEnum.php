<?php

namespace App\Enum;

abstract class UserEnum {

    public const USER_FIRSTNAME = "firstname";
    public const USER_LASTNAME = "lastname";
    public const USER_ADDRESS = "address";
    public const USER_ZIPCODE = "zipcode";
    public const USER_CITY = "city";
    public const USER_COUNTRY = "country";
    public const USER_PHONE = "phone";
    public const USER_EMAIL = "email";
    public const USER_PASSWORD = "password";
    public const USER_ROLES = "roles";

    public static array $typeName = [
        self::USER_FIRSTNAME => "Firstname",
        self::USER_LASTNAME => "Lastname",
        self::USER_ADDRESS => "Address",
        self::USER_ZIPCODE => "ZipCode",
        self::USER_CITY => "City",
        self::USER_COUNTRY => "Country",
        self::USER_PHONE => "Phone",
        self::USER_EMAIL => "Email",
        self::USER_PASSWORD => "Password",
        self::USER_ROLES => "Roles"
    ];

    public function getAvailableChoices() {
        return [
            self::USER_FIRSTNAME,
            self::USER_LASTNAME,
            self::USER_ADDRESS,
            self::USER_ZIPCODE,
            self::USER_CITY,
            self::USER_COUNTRY,
            self::USER_PHONE,
            self::USER_EMAIL,
            self::USER_PASSWORD
        ];
    }

    public function getChoices() 
    {
        $choices = [];

        foreach(self::getAvailableChoices() as $key => $choice) {
            $choices[static::$typeName[$key]] = $choice;
        }

        return $choices;
    }
}