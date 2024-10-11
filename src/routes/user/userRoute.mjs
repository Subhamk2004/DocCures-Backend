import { Router } from "express";
import { User } from "../../schema/UserSchema.mjs";
import cloudinary from 'cloudinary';
import multer from "multer";
import dotenv from 'dotenv'
import { checkSchema, validationResult, matchedData } from 'express-validator';
import { hashPassword } from '../../utils/passwordEncrypt.mjs';
import { UserValidationSchema } from "../../utils/userValidationSchema.mjs";
import '../../strategies/localStrategy.mjs';
import passport from 'passport';

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
            return res.status(200).json({
                message: errors.message,
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
                message: 'Used registered successfully',
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

router.post('/loginuser', passport.authenticate("local"), (req, res) => {
    console.log('Entered login endpoint');

    console.log(req.session.passport.user);
    req.session.isAuthenticated = true;
    req.session.email = req.user.email;
    console.log(req.session);


    req.session.save((err) => {
        if (err) {
            return res.status(500).json({ message: 'Could not save session' });
        }
        res.json({ user: req.user });
    });
})

router.get('/user/auth/status', (req, res) => {
    console.log('inside login status');
    console.log(req.user);
    console.log(req.cookies);
    console.log(req.session);


    if (req.user) {
        let data = req.user;
        console.log("req.user is ", data);

        return res.json({ user: data });

    }
    return res.status(404).send({ message: "User already logged out" });
})

export default router