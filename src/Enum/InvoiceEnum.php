<?php

namespace App\Enum;

abstract class InvoiceEnum {

    // Status choices
    public const STATUS_UNPAID = "unpaid";
    public const STATUS_ONGOING = "ongoing";
    public const STATUS_PAID = "paid";

    public const INVOICE_FILENAME = "filename";
    public const INVOICE_FILEPATH = "filepath";
    public const INVOICE_DATE = "invoice_date";
    public const INVOICE_STATUS = "status";

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

    public static function getAvailableStatus() {
        return [
            self::STATUS_UNPAID,
            self::STATUS_ONGOING,
            self::STATUS_PAID
        ];
    }

    public static function getInvoiceAvailableChoices() {
        return [
            self::INVOICE_FILENAME,
            self::INVOICE_FILEPATH,
            self::INVOICE_DATE,
            self::INVOICE_STATUS
        ];
    }

    public static function getChoices() {
        $choices = [];

        foreach(self::getAvailableStatus() as $choice) {
            $choices[static::$typeName[$choice]] = $choice;
        }

        return $choices;
    }
}