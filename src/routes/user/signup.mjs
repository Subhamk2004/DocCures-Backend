import { Router } from "express";
import { User } from "../../schema/UserSchema.mjs";
import cloudinary from 'cloudinary';
import multer from "multer";
import dotenv from 'dotenv'
import { checkSchema, validationResult, matchedData } from 'express-validator';
import { hashPassword } from '../../utils/passwordEncrypt.mjs';
import { UserValidationSchema } from "../../utils/userValidationSchema.mjs";

dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const router = Router();

const upload = multer({ dest: 'uploads/' });

router.post('/user/signup',
    upload.single('image'),
    async (req, res, next) => {
        const user = req.body;
        console.log(user);
        console.log(req.file);
        
        if (req.file) {
            const result = await cloudinary.uploader.upload(req.file.path);
            user.image = result.secure_url;
        }
        next()
    },
    checkSchema(UserValidationSchema),
    async (req, res) => {

        let errors = validationResult(req);
        if (!errors.isEmpty()) {
            console.log(errors.errors[0].msg);

            return res.status(200).json({
                message: errors.errors[0].msg,
                isSaved: false
            });
        }

        let validatedData = matchedData(req)
        validatedData.password = hashPassword(validatedData.password)
        const newUser = new User(validatedData);

        console.log(newUser);

        try {
            const savedUser = await newUser.save();

            return res.status(201).json({
                message: 'User registered successfully',
                isSaved: true,
                user: savedUser
            });
        } catch (error) {
            console.log(error);
            return res.status(200).json({
                message: error.message,
                isSaved: false
            });
        }
    });

export default router;