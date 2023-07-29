export default class FormControl {

    /**
     * Check the min length of a string
     * 
     * @param {*} value
     * @param {*} minLength
     */
    checkMinLength(value, minLength = 0) {
        let isValid = true

        if(value.length < minLength) {
            isValid = false
        }

        return isValid
    }

    /**
     * Check the max length of a string
     * 
     * @param {*} value
     * @param {*} maxLength
     */
    checkMaxLength(value, maxLength = 255) {
        let isValid = true
        
        console.log(
            value.length,
            maxLength,
            value.length > maxLength
        )
        if(value.length > maxLength) {
            isValid = false
        }

        return isValid
    }

    /**
     * Check the length of a string
     * 
     * @param {*} value
     * @param {*} minLength
     * @param {*} maxLength
     */
    checkLength(value, minLength = 0, maxLength = 255) {
        let isValid = true
        
        console.log(
            value,
            minLength,
            maxLength,
            !this.checkMinLength(value, minLength), 
            !this.checkMaxLength(value, maxLength),
            !this.checkMinLength(value, minLength) || !this.checkMaxLength(value, maxLength)
        )
        if(!this.checkMinLength(value, minLength) || !this.checkMaxLength(value, maxLength)) {
            isValid = false
        }

        return isValid
    }

    /**
     * Check if a string is a numeric value
     * 
     * @param {*} value
     */
    checkNumber(value) {
        let isValid = true
        
        if(isNaN(value)) {
            isValid = false
        }

        return isValid
    }

    /**
     * Check if the string is a valid phone number
     */
    checkPhone(value) {
        let isValid = true

        if(!(new RegExp(/[0-9]{2}[0-9]{2}[0-9]{2}[0-9]{2}[0-9]{2}/)).test(value)) {
            isValid = false
        }

        return isValid
    }

    /**
     * Check if a string is a valid email
     * 
     * @param {*} value
     */
    checkEmail(value) {
        let isValid = true

        if(!(new RegExp(/[a-z0-9]+@[a-z]+\.[a-z]{2,3}/)).test(value)) {
            isValid = false
        }

        return isValid
    }

    /**
     * Check if the string can be a secure password
     * 
     * (?=.*[a-z]) : The string must contain at least 1 lowercase alphabetical character
     * (?=.*[A-Z]) : The string must contain at least 1 uppercase alphabetical character
     * (?=.*[0-9]) : The string must contain at least 1 numeric character
     * (?=.*[!@#$%^&*]) : The string must contain at least one special character, but we are escaping reserved RegEx characters to avoid conflict
     * (?=.{8,}) : The string must be eight characters or longer
     * 
     * @param {*} password
     * @return {boolean} Return true or false
     */
    checkPassword(value) {
        let isValid = true
        
        if(!(new RegExp(/(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/).test(value))) {
            isValid = false
        }

        return isValid
    }
}