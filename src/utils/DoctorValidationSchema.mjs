export const DoctorValidationSchema = {
    email:{
        in:['body'],
        isEmail:{
            errorMessage: "Not a valid email"
        },
        notEmpty: {
            errorMessage: "Email is required"
        }
    },
    password: {
        in: ['body'],
        isString: {
            errorMessage: 'password must be a string'
        },
        notEmpty: {
            errorMessage: 'password must not be empty'
        },
        isLength: {
            options: { min: 8 },
            errorMessage: 'password must be at least 8 characters long'
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
        notEmpty: {
            errorMessage: 'Please upload image'
        }
    },
    speciality: {
        in: ['body'],
        isString: {
            errorMessage: 'Specialization must be a string'
        },
        notEmpty: {
            errorMessage: 'Please enter specialization'
        }
    },
    xp: {
        in: ['body'],
        isString: {
            errorMessage: 'Experience must be a string'
        },
        notEmpty: {
            errorMessage: 'Please enter experience'
        }
    },
    degree: {
        in: ['body'],
        isString: {
            errorMessage: 'Qualification must be a string'
        },
        notEmpty: {
            errorMessage: 'Please enter qualification'
        }
    },
    fees: {
        in: ['body'],
        isNumber: {
            errorMessage: 'Fee must be a number'
        },
        notEmpty: {
            errorMessage: 'Please enter fee'
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
    available: {
        in: ['body'],
        notEmpty:{
            errorMessage:"Please check doctor availability"
        }
    }
}