export const UserUpdateValidationSchema = {
    email:{
        in:['body'],
        isEmail:{
            errorMessage: "Not a valid email"
        },
        notEmpty: {
            errorMessage: "Email is required"
        }
    },
    name: {
        in: ['body'],
        isString: {
            errorMessage: 'Name must be a string'
        },
        notEmpty: {
            errorMessage: 'Name must not be empty'
        }
    },
    address: {
        in: ['body'],
        isString: {
            errorMessage: 'Address must be a string'
        },
        notEmpty: {
            errorMessage: 'Please enter address'
        }
    },
    phone: {
        in: ['body'],
        isNumber: {
            errorMessage: 'Phone number must be in numbers'
        },
        notEmpty: {
            errorMessage: 'Please enter your phone number'
        },
        isLength: {
            options: { min: 10, max: 10 },
            errorMessage: 'Phone number must be exactly 10 digits long'
        }
    },
    image: {
        in: ['body'],
        isString: {
            errorMessage: 'Image URL must be a string'
        },
    },
}