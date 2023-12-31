<?php

namespace App\Enum;

abstract class EstimateDetailEnum {

    public const DETAIL_TITLE = "title";
    public const DETAIL_DESCRIPTION = "description";
    public const DETAIL_QUANTITY = "quantity";
    public const DETAIL_NBR_DAYS = "nbr_days";
    public const DETAIL_BUDGET = "budget";

    public static function getAvailableChoices() {
        return [
            self::DETAIL_TITLE,
            self::DETAIL_DESCRIPTION,
            self::DETAIL_QUANTITY,
            self::DETAIL_NBR_DAYS,
            self::DETAIL_BUDGET,
        ];
    }
}