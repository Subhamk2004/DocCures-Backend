import { Router } from 'express';
import DoctorSchema from '../../schema/DoctorSchema.mjs';
import cloudinary from 'cloudinary';
import multer from 'multer';
import dotenv from 'dotenv';

dotenv.config();

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const router = Router();

const upload = multer({ dest: 'uploads/' });

router.post('/admin/doctor/add', upload.single('image'), async (req, res) => {
    try {
        const doctor = req.body;

        if (req.file) {
            const result = await cloudinary.uploader.upload(req.file.path);
            doctor.image = result.secure_url;
        }

        const newDoctor = new DoctorSchema(doctor);
        const savedDoctor = await newDoctor.save();

        console.log(savedDoctor);
        return res.status(201).json({
            message: 'Doctor added successfully',
            isSaved: true,
            doctor: newDoctor
        });
    } catch (error) {
        console.log(error);
        return res.status(200).json({
            message: error.message,
            isSaved: false
        });
    }
});

router.get('/admin/doctor/allDoctors',
    async (req, res) => {
        try {
            let allDoctors = await DoctorSchema.find();
            res.status(200).json({
                doctors: allDoctors,
                doctorsFound: true
            });
        } catch (error) {
            console.error('Failed to fetch food items:', error);
            res.status(200).json({ 
                message: `Can't fetch Doctors, try again later`,
                doctorsFound: false
            });
        }
    })

export default router;