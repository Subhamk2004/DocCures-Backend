import mongoose, { mongo } from "mongoose";

let DoctorSchema = mongoose.Schema({
    name: {
        type: mongoose.Schema.Types.String,
        required: true
    },
    email: {
        type: mongoose.Schema.Types.String,
        required: true,
        unique: true
    },
    phone: {
        type: mongoose.Schema.Types.Number,
        required: true,
        unique: true
    },
    speciality: {
        type: mongoose.Schema.Types.String,
        required: true
    },
    address: {
        type: mongoose.Schema.Types.String,
        required: true
    },
    password: {
        type: mongoose.Schema.Types.String,
        required: true
    },
    degree: {
        type: mongoose.Schema.Types.String,
        required: true
    },
    xp: {
        type: mongoose.Schema.Types.Number,
        required: true
    },
    image: {
        type: mongoose.Schema.Types.String,
        required: true
    },
    available: {
        type: mongoose.Schema.Types.Boolean,
        required: true
    },
    fees: {
        type: mongoose.Schema.Types.Number,
        required: true
    },
    availableForEmergency: {
        type: Boolean,
        default: true
    }
})

export default mongoose.model('Doctor', DoctorSchema);