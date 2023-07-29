<?php

namespace App\Manager;

use App\Enum\RegexEnum;

class FormManager {

    public function isEmpty($value): bool
    {
        $isValid = true;

        if(empty($value)) {
            $isValid = false;
        }

        return $isValid;
    }

    public function isEmail(string $value)
    {
        $isValid = true;

        if(!preg_match(RegexEnum::REGEX_EMAIL, $value)) {
            $isValid = false;
        }

        return $isValid;
    }

    public function isNumber($value): bool
    {
        $isValid = true;

        if(!preg_match(RegexEnum::REGEX_ONLY_NUMERIC, $value)) {
            $isValid = false;
        }

        return $isValid;
    }

    public function isSecurePassword(string $value)
    {
        $isValid = true;

        if(!preg_match(RegexEnum::REGEX_SECURE_PASSWORD, $value)) {
            $isValid = false;
        }

        return $isValid;
    }

    public function checkMaxLength(string $value, int $maxLength = 255): bool
    {
        $isValid = true;

        if(strlen($value) > 255) {
            $isValid = false;
        }

        return $isValid;
    }

    public function checkMinLength(string $value, int $minLength = 1): bool
    {
        $isValid = true;

        if(strlen($value) < $minLength) {
            $isValid = false;
        }

        return $isValid;
    }

    public function checkLimitLength(string $value, int $minLength, int $maxLength): bool
    {
        $isValid = true;

        if(!$this->checkMinLength($value, $minLength) || !$this->checkMaxLength($value, $maxLength)) {
            $isValid = false;
        }

        return $isValid;
    }
}