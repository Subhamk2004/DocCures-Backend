import { Router } from "express";
import { User } from "../../schema/UserSchema.mjs";
import cloudinary from 'cloudinary';
import multer from "multer";
import dotenv from 'dotenv'
import '../../strategies/localStrategy.mjs';

dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const router = Router();


router.get('/user/allUsers',
    async (req, res) => {
        try {
            let allUsers = await User.find();
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



router.get('/user/auth/status', (req, res) => {
    console.log('inside login status');
    console.log( req.session.user);
    console.log(req.user);
    console.log(req.session);
    console.log(req.cookies);
    
    
    if (req.session.user) {
        console.log('really exist');
        
        let data = req.session.user;
        return res.json({
            user: {
                email: data.email,
                name: data.name,
                image: data.image,
                phone: data.phone,
                address: data.address,
                id: data._id
            }, 
            auth: true
        });
    } 
    return res.status(200).json({ message: "User not authenticated", auth: false });
});

export default router