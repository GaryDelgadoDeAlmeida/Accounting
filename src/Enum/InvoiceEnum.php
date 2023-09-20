<?php

namespace App\Enum;

abstract class InvoiceEnum {

    // Status choices
    public const STATUS_UNPAID = "unpaid";
    public const STATUS_ONGOING = "ongoing";
    public const STATUS_PAID = "paid";

    protected static $typeName = [
        self::STATUS_UNPAID => "Unpaid",
        self::STATUS_ONGOING => "Ongoing",
        self::STATUS_PAID => "Paid"
    ];

    public function getInvoiceStatus(string $status) {
        if (!isset(static::$typeName[$status])) {
            return "Unknown type ($status)";
        }

        return static::$typeName[$status];
    }

    public function getAvailableChoices() {
        return [
            self::STATUS_UNPAID,
            self::STATUS_ONGOING,
            self::STATUS_PAID
        ];
    }

    public function getChoices() {
        $choices = [];

        foreach(self::getAvailableChoices() as $key => $choice) {
            $choices[static::$typeName[$key]] = $choice;
        }

        return $choices;
    }
}