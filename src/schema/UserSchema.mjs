import mongoose from 'mongoose'

let UserSchema = new mongoose.Schema({
    name:{
        type: mongoose.Schema.Types.String,
        required: true
    },
    email:{
        type: mongoose.Schema.Types.String,
        required:true,
        unique: true
    },
    phone: {
        type: mongoose.Schema.Types.Number,
        required: true,
        unique: true
    },
    password:{
        type: mongoose.Schema.Types.String,
        required: true
    },
    address:{
        type: mongoose.Schema.Types.String,
        required: true
    },
    image:{
        type: mongoose.Schema.Types.String,
    }
})

export let User = mongoose.model('User',UserSchema);