import { Router } from "express";
import DoctorSchema from "../../schema/DoctorSchema.mjs";
import cloudinary from 'cloudinary';
import multer from "multer";
import dotenv from 'dotenv'
import '../../strategies/docLocalStrategies.mjs';

dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const router = Router();


router.get('/doctor/allDoctors',
    async (req, res) => {
        try {
            let allUsers = await DoctorSchema.find();
            res.status(200).json({
                users: allUsers,
                usersFound: true
            });
        } catch (error) {
            console.error('Failed to fetch users:', error);
            res.status(200).json({
                message: `Can't fetch users, try again later`,
                usersFound: false
            });
        }
    })



router.get('/doctor/auth/status', (req, res) => {
    console.log('inside login status doctor');
    console.log(req.session);
    
    if (req.session.doctor) {
        console.log(req.session.doctor);
        let data = req.session.doctor;

        return res.json({
            doctor: data,
            auth: true
        });
    }
    return res.status(200).send({ message: "User already logged out" });
})


export default router