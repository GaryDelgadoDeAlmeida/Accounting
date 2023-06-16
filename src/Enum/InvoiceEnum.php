<?php

namespace App\Enum;

abstract class InvoiceEnum {

    public const STATUS_UNPAID = "unpaid";
    public const STATUS_ONGOING = "ongoing";
    public const STATUS_PAID = "paid";
}