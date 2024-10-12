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

router.post('/loginuser', (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (err) {
            return res.status(500).json({ message: "An unexpected error occurred" });
        }
        if (!user) {
            return res.status(401).json({
                message: info.message,
                auth: false
            });
        }
        req.logIn(user, (err) => {
            if (err) {
                return res.status(500).json({ message: "An unexpected error occurred" });
            }

            console.log('Entered login endpoint');
            req.session.isAuthenticated = true;
            req.session.email = user.email;
            console.log(req.session);

            req.session.save((err) => {
                if (err) {
                    return res.status(500).json({ message: 'Could not save session' });
                }
                return res.status(200).json({
                    message: "Login successful",
                    user: {
                        email: user.email,
                    },
                    auth: true
                });
            });
        });
    })(req, res, next);
});

router.get('/user/auth/status', (req, res) => {
    console.log('inside login status');
    console.log(req.user);
    console.log(req.cookies);
    console.log(req.session);


    if (req.user) {
        let data = req.user;
        console.log("req.user is ", data);

        return res.json({
            user: {
                email: data.email,
                name: data.name,
                image: data.image,
                phone: data.phone,
                address: data.address
            },
            auth: true
        });

    }
    return res.status(200).send({ message: "User already logged out" });
})

router.post("/logout", (req, res) => {
    if (!req.user) return res.sendStatus(401);
  
    req.logout((err) => {
      if (err) return res.sendStatus(400);
      req.cookies.isAuthenticated = false;
      req.cookies.useremail = "";
      res.status(200).send("User logged out successfully");
    });
  });

export default router