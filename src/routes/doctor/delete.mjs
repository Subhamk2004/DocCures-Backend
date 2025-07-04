import { Router } from "express";
import DoctorSchema from "../../schema/DoctorSchema.mjs";
import '../../strategies/localStrategy.mjs';

const router = Router();

router.delete('/doctor/delete', async (req, res) => {

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
        if (!req.session.doctor) return res.sendStatus(401);

        req.session.doctor = null;

        if (req.body.email) {
            let result = await DoctorSchema.deleteOne({ email: req.body.email });
            console.log(result);
            if (result.deletedCount > 0) {
                return res.status(200).send({
                    message: "Doctor Deleted Successfully",
                    isDeleted: true
                });
            }
            return res.status(404).send({
                message: "Doctor not found",
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