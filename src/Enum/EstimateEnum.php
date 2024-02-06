<?php

namespace App\Enum;

abstract class EstimateEnum {

    public const ESTIMATE_COMPANY = "company";
    public const ESTIMATE_USER = "user";
    public const ESTIMATE_LABEL = "label";
    public const ESTIMATE_DATE = "estimateDate";
    public const ESTIMATE_STATUS = "status";
    public const ESTIMATE_APPLY_TVA = "applyTVA";
    public const ESTIMATE_TVA = "tva";
    public const ESTIMATE_DETAILS = "details";

    protected array $typeName = [
        self::ESTIMATE_COMPANY => "Company",
        self::ESTIMATE_USER => "User",
        self::ESTIMATE_LABEL => "Label",
        self::ESTIMATE_DATE => "Estimate date",
        self::ESTIMATE_STATUS => "Status",
        self::ESTIMATE_APPLY_TVA => "Apply TVA",
        self::ESTIMATE_TVA => "TVA",
        self::ESTIMATE_DETAILS => "Details"
    ];

    public static function getAvailableChoices() : array {
        return [
            self::ESTIMATE_COMPANY,
            self::ESTIMATE_USER,
            self::ESTIMATE_LABEL,
            self::ESTIMATE_DATE,
            self::ESTIMATE_STATUS,
            self::ESTIMATE_APPLY_TVA,
            self::ESTIMATE_TVA,
            self::ESTIMATE_DETAILS
        ];
    }

    public static function getChoices() : array {
        $choices = [];

        foreach(self::getAvailableChoices() as $choice) {
            $choices[self::$typeName[$choice]] = $choice;
        }

        return $choices;
    }
}