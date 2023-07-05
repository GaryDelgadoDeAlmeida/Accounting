<?php

namespace App\Enum;

abstract class EstimateEnum {

    public const STATUS_SEND = "send";
    public const STATUS_ONGOING = "ongoing";
    public const STATUS_SIGNED = "signed";

    protected static array $typeName = [
        self::STATUS_SEND => "Send",
        self::STATUS_ONGOING => "Ongoing",
        self::STATUS_SIGNED => "Signed"
    ];

    public function getEstimateStatus($status) {
        if (!isset(static::$typeName[$status])) {
            return "Unknown type ($status)";
        }

        return static::$typeName[$status];
    }

    public function getAvailableChoice() {
        return [
            self::STATUS_SEND,
            self::STATUS_ONGOING,
            self::STATUS_SIGNED
        ];
    }

    public function getChoices() {
        $choices = [];

        foreach(self::getAvailableChoice() as $key => $choice) {
            $choices[static::$typeName[$key]] = $choice;
        }

        return $choices;
    }
}