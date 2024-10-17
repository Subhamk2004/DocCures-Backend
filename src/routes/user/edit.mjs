import { Router } from "express";
import { User } from "../../schema/UserSchema.mjs";
import cloudinary from 'cloudinary';
import multer from "multer";
import dotenv from 'dotenv';
import { checkSchema, validationResult, matchedData } from 'express-validator';
import { hashPassword } from '../../utils/passwordEncrypt.mjs';
import { UserUpdateValidationSchema } from "../../utils/userUpdateValidationSchema.mjs";

dotenv.config();
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const router = Router();
const upload = multer({ dest: 'uploads/' });

router.put('/user/update',
    upload.single('image'),
    async (req, res, next) => {
        const updates = req.body;

        if (req.file) {
            const result = await cloudinary.uploader.upload(req.file.path);
            updates.image = result.secure_url;
        }
        req.updates = updates;
        next();
    },
    checkSchema(UserUpdateValidationSchema),
    async (req, res) => {
        let errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({
                message: errors.errors[0].msg,
                isUpdated: false
            });
        }

        let validatedData = matchedData(req);
        console.log(validatedData, 'Validated data');

        const { phone } = validatedData;

        if (!phone) {
            return res.status(400).json({
                message: 'Phone number is required',
                isUpdated: false
            });
        }

        try {
            if (validatedData.email) {
                const existingUser = await User.findOne({
                    email: validatedData.email,
                    phone: { $ne: phone }
                });

                if (existingUser) {
                    return res.status(400).json({
                        message: 'Email already in use by another user',
                        isUpdated: false
                    });
                }
            }

            const updatedUser = await User.findOneAndUpdate(
                { phone: phone },
                validatedData,
                { new: true, runValidators: true }
            );

            if (!updatedUser) {
                return res.status(404).json({
                    message: 'User not found',
                    isUpdated: false
                });
            }
            else {
                console.log(req.session, 'inside logs');
                
                req.session.email = updatedUser.email;
                req.session.user = updatedUser;
                console.log(req.session.user, 'inside logs');
                console.log(req.session.email, 'inside logs');
                
                
                return res.status(200).json({
                    message: 'User updated successfully',
                    isUpdated: true,
                    user: updatedUser
                });
            }
        } catch (error) {
            console.log(error);
            return res.status(500).json({
                message: error.message,
                isUpdated: false
            });
        }
    }
);

export default router;