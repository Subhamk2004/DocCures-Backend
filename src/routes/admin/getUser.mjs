import { Router } from "express";
import { User } from "../../schema/UserSchema.mjs";
import DoctorSchema from "../../schema/DoctorSchema.mjs";
import '../../strategies/localStrategy.mjs';

const router = Router();


router.post('/user/getOne',
    async (req, res) => {
        let id = req.body.id;
        let userType = req.body.userType;
        console.log(id);
        if (userType === 'doctor') {
            try {
                const findDoctor = await DoctorSchema.findById(id);
                res.status(200).json({
                    user: findDoctor,
                    userFound: true
                });
                console.log(findDoctor);

            } catch (error) {
                console.error('Failed to fetch doctor:', error);
                res.status(200).json({
                    message: `Can't fetch doctor, try again later`,
                    userFound: false
                });
            }
        }
        else {
            try {
                const findUser = await User.findById(id);
                res.status(200).json({
                    user: findUser,
                    userFound: true
                });
                console.log(findUser);

            } catch (error) {
                console.error('Failed to fetch user:', error);
                res.status(200).json({
                    message: `Can't fetch user, try again later`,
                    userFound: false
                });
            }
        }
    })


export default router