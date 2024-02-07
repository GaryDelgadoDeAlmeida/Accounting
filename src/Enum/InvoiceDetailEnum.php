<?php

namespace App\Enum;

abstract class InvoiceDetailEnum {
    
    public const INVOICE_DETAIL_DESCRIPTION = "description";
    public const INVOICE_DETAIL_QUANTITY = "quantity";
    public const INVOICE_DETAIL_PRICE = "price";

    public array $fieldName = [];

    public function getAvailableChoices() {
        return [
            self::INVOICE_DETAIL_DESCRIPTION,
            self::INVOICE_DETAIL_QUANTITY,
            self::INVOICE_DETAIL_PRICE,
        ];
    }
}