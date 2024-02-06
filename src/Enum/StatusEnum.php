<?php

namespace App\Enum;

abstract class StatusEnum {
    public const STATUS_SEND = "send";
    public const STATUS_UNPAID = "unpaid";
    public const STATUS_ONGOING = "ongoing";
    public const STATUS_ONGOING_PAIEMENT = "paiement_ongoing";
    public const STATUS_PAID = "paid";
    public const STATUS_SIGNED = "signed";

    protected static $typeName = [
        self::STATUS_SEND => "send",
        self::STATUS_UNPAID => "Unpaid",
        self::STATUS_ONGOING => "Ongoing",
        self::STATUS_ONGOING_PAIEMENT => "Paiement Ongoing",
        self::STATUS_PAID => "Paid",
        self::STATUS_SIGNED => "signed"
    ];

    public function getStatus(string $status) {
        if (!isset(static::$typeName[$status])) {
            return "Unknown type ($status)";
        }

        return static::$typeName[$status];
    }

    public static function getAvailableChoices() {
        return [
            self::STATUS_SEND,
            self::STATUS_UNPAID,
            self::STATUS_ONGOING,
            self::STATUS_ONGOING_PAIEMENT,
            self::STATUS_PAID,
            self::STATUS_SIGNED
        ];
    }

    public static function getChoices() {
        $choices = [];

        foreach(self::getAvailableChoices() as $choice) {
            $choices[static::$typeName[$choice]] = $choice;
        }

        return $choices;
    }
}