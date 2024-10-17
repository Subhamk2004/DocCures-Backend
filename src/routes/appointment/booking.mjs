import { Router } from "express";
import { Appointment } from "../../schema/AppointmentSchema.mjs";

let router = Router();


router.post('/appointment/booking',
    async (req, res) => {
        let appointment = req.body;
        console.log(appointment);
        const newBooking = new Appointment(appointment);
        try {
            const savedBooking = await newBooking.save();

            return res.status(201).json({
                message: 'Booking saved successfully',
                isSaved: true,
                booking: savedBooking
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