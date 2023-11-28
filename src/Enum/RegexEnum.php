<?php

namespace App\Enum;

abstract class RegexEnum {
    
    public const REGEX_ONLY_NUMERIC = '/[0-9]/i';
    // public const REGEX_EMAIL = "[a-z0-9]+@[a-z]+\.[a-z]{2,3}";
    public const REGEX_EMAIL = "/^[_a-zA-Z0-9-]+(\.[_a-zA-Z0-9-]+)*@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*(\.[a-zA-Z]{2,})$/";
    public const REGEX_SECURE_PASSWORD = "/[\'\/~`\!@#\$%\^&\*\(\)_\-\+=\{\}\[\]\|;:\"\<\>,\.\?\\\]/";
}