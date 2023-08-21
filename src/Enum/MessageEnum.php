<?php

namespace App\Enum;

abstract class MessageEnum {
    public const FORM_CARACTER_LENGTH_ERROR = "The value of the field %INPUT_VALUE% is greater than %CARACTER_LENGTH% caracters length";
    public const FORM_NUMERIC_ERROR = "The value of field %INPUT_VALUE% isn't numeric.";
    public const FORM_INVALID_MAIL_ERROR = "The email in the field %INPUT_VALUE% isn't valid";
}