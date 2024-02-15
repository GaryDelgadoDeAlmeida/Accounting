<?php

namespace App\Enum;

abstract class EstimateDetailEnum {

    public const DETAIL_LABEL = "label";
    public const DETAIL_DESCRIPTION = "description";
    public const DETAIL_QUANTITY = "quantity";
    public const DETAIL_NBR_DAYS = "nbr_days";
    public const DETAIL_PRICE = "price";

    public static function getAvailableChoices() {
        return [
            self::DETAIL_LABEL,
            self::DETAIL_DESCRIPTION,
            self::DETAIL_QUANTITY,
            self::DETAIL_NBR_DAYS,
            self::DETAIL_PRICE,
        ];
    }
}