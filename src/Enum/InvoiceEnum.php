<?php

namespace App\Enum;

abstract class InvoiceEnum {

    public const INVOICE_FILENAME = "filename";
    public const INVOICE_FILEPATH = "filepath";
    public const INVOICE_DATE = "invoice_date";
    public const INVOICE_STATUS = "status";
    public const INVOICE_APPLY_TVA = "apply_tva";
    public const INVOICE_TVA = "tva";
    
    protected static $typeName = [
        self::INVOICE_FILENAME => "Filename",
        self::INVOICE_FILEPATH => "Filepath",
        self::INVOICE_DATE => "Date",
        self::INVOICE_STATUS => "Status",
        self::INVOICE_APPLY_TVA => "Apply TVA",
        self::INVOICE_TVA => "TVA",
    ];

    public static function getInvoiceAvailableChoices() {
        return [
            self::INVOICE_FILENAME,
            self::INVOICE_FILEPATH,
            self::INVOICE_DATE,
            self::INVOICE_STATUS,
            self::INVOICE_APPLY_TVA,
            self::INVOICE_TVA,
        ];
    }

    public static function getInvoiceChoices() {
        $choices = [];

        foreach(self::getInvoiceAvailableChoices() as $choice) {
            $choices[static::$typeName[$choice]] = $choice;
        }

        return $choices;
    }
}