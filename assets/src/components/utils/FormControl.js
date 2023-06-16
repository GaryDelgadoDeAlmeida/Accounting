export default function FormControl() {

    /**
     * Check the length of a string
     * 
     * @param {*} value
     * @param {*} minLength
     * @param {*} maxLength
     */
    checkLength = (value, minLength = 0, maxLength = 255) => {
        if(!checkMinLength(value, minLength) || !checkMaxLength(value, maxLength)) {
            return false
        }

        return true
    }

    /**
     * Check the max length of a string
     * 
     * @param {*} value
     * @param {*} maxLength
     */
    checkMaxLength = (value, maxLength = 255) => {
        if(value.length > maxLength) {
            return false
        }

        return true
    }

    /**
     * Check the min length of a string
     * 
     * @param {*} value
     * @param {*} minLength
     */
    checkMinLength = (value, minLength = 0) => {
        if(value.length < minLength) {
            return false
        }

        return true
    }

    /**
     * Check if a string is a numeric value
     * 
     * @param {*} value
     */
    checkNumber = (value) => {
        if(isNaN(value)) {
            return false
        }

        return true
    }

    /**
     * Check if a string is a valid email
     * 
     * @param {*} value
     */
    checkEmail = (value) => {
        if(!(new RegExp("[a-z0-9]+@[a-z]+\.[a-z]{2,3}")).test(value)) {
            return false
        }

        return true
    }
}