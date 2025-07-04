import mongoose from 'mongoose'

let AppointmentSchema = new mongoose.Schema({
    date:{
        type: mongoose.Schema.Types.String,
        required: true
    },
    time:{
        type: mongoose.Schema.Types.String,
        required:true,
    },
    patientEmail:{
        type: mongoose.Schema.Types.String,
        required: true
    },
    address:{
        type: mongoose.Schema.Types.String,
        required: true
    },
    doctorEmail:{
        type: mongoose.Schema.Types.String,
        required: true
    },
    fee:{
        type: mongoose.Schema.Types.Number,
        required: true
    },
    doctorName:{
        type: mongoose.Schema.Types.String,
        required: true
    },
    doctorSpecialisation:{
        type: mongoose.Schema.Types.String,
        required: true
    },
    doctorImage:{
        type: mongoose.Schema.Types.String,
        required: true
    },
    patientName:{
        type: mongoose.Schema.Types.String,
        required: true
    },
    patientPhone:{
        type: mongoose.Schema.Types.Number,
        required: true
    },
    patientImage:{
        type: mongoose.Schema.Types.String,
        required: true
    },
    isPaid:{
        type: mongoose.Schema.Types.Boolean,
        required: true
    },
    isCancelled:{
        type: mongoose.Schema.Types.Boolean,
        required: true,
        default: false
    },
    isCompleted:{
        type: mongoose.Schema.Types.Boolean,
        required: true,
        default: false
    },
    completedOn:{
        type: mongoose.Schema.Types.String,
        required: false
    }
})

export let Appointment = mongoose.model('Appointment',AppointmentSchema);