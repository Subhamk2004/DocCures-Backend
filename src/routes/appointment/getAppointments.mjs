import { Router } from "express";
import { Appointment } from "../../schema/AppointmentSchema.mjs";
import '../../strategies/localStrategy.mjs';

const router = Router();

router.get('/user/getAppointments',
    async (req, res) => {
        let email = req.query.email;
        console.log(email);
        if (email === 'AdminSKR') {
            try {
                const fetchAppointments = await Appointment.find();
                res.status(200).json({
                    appointments: fetchAppointments,
                    appointmentsFound: true
                });
                console.log(fetchAppointments);

            } catch (error) {
                console.error('Failed to fetch appointments:', error);
                res.status(200).json({
                    message: `Can't fetch appointments, try again later`,
                    appointmentsFound: false
                });
            }
        }
        else {
            try {
                const fetchAppointments = await Appointment.find({ patientEmail: email });
                res.status(200).json({
                    appointments: fetchAppointments,
                    appointmentsFound: true
                });
                console.log(fetchAppointments);

            } catch (error) {
                console.error('Failed to fetch appointments:', error);
                res.status(200).json({
                    message: `Can't fetch appointments, try again later`,
                    appointmentsFound: false
                });
            }
        }
    })


export default router