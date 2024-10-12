import { Router } from "express";
import { User } from "../../schema/UserSchema.mjs";
import DoctorSchema from "../../schema/DoctorSchema.mjs";
import '../../strategies/localStrategy.mjs';

const router = Router();

router.delete('/user/delete', async (req, res) => {

    console.log(req.body.email, 'Initial stage at deleting');
    console.log(req.session, req.cookies);

    if (req.body.from === 'admin') {
        console.log('Admin is deleting user');
        console.log(req.body.userType);
        
        if (req.body.email) {

            let schemaSelector;
            if( req.body.userType === 'doctor'){
                schemaSelector = DoctorSchema;
            }
            else {
                schemaSelector = User;
            }
            let result = await schemaSelector.deleteOne({ email: req.body.email });
            console.log(result);
            if (result.deletedCount > 0) {
                return res.status(200).send({
                    message: "User Deleted Successfully",
                    isDeleted: true
                });
            }
            return res.status(404).send({
                message: "User not found",
                isDeleted: false
            });
        }
    }
    else {
        if (!req.user) return res.sendStatus(401);

        req.logout((err) => {
            if (err) return res.sendStatus(400);
            req.cookies.isAuthenticated = false;
            req.cookies.useremail = "";
        });

        if (req.body.email) {
            let result = await User.deleteOne({ email: req.body.email });
            console.log(result);
            if (result.deletedCount > 0) {
                return res.status(200).send({
                    message: "User Deleted Successfully",
                    isDeleted: true
                });
            }
            return res.status(404).send({
                message: "User not found",
                isDeleted: false
            });
        }
    }

    return res.status(400).send({
        message: "Email is required",
        isDeleted: false
    });
});

export default router