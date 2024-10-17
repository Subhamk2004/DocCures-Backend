import express from 'express';
import cors from 'cors';
import sessionDatabaseHandler from './utils/sessionDatabaseHandler.mjs';

// Import all your route handlers
import loginRouter from './routes/admin/adminLogin.mjs';
import logoutRouter from './routes/admin/adminLogout.mjs';
import doctorRouter from './routes/doctor/doctor.mjs';
import userRouter from './routes/user/userRoute.mjs';
import userSignupRouter from './routes/user/signup.mjs';
import userLoginRouter from './routes/user/login.mjs';
import userLogoutRouter from './routes/user/logout.mjs';
import userdeleteRouter from './routes/user/delete.mjs';
import userEditRouter from './routes/user/edit.mjs';
import getUser from './routes/admin/getUser.mjs';
import AppointmentBookingRouter from './routes/appointment/booking.mjs';
import getAppointments from './routes/appointment/getAppointments.mjs';
import DoctorRouter from './routes/doctor/doctorRoute.mjs';
import doctorSignup from './routes/doctor/signup.mjs';
import doctorLogin from './routes/doctor/login.mjs';
import doctorLogout from './routes/doctor/logout.mjs';
import doctorUpdate from './routes/doctor/edit.mjs';
import doctorDelete from './routes/doctor/delete.mjs';

const app = express();

const corsOptions = {
  origin: ['http://localhost:5175', 'http://localhost:5174', 'http://localhost:5173'],
  credentials: true,
  methods: 'GET,POST,PUT,DELETE'
};

app.use(cors(corsOptions));
app.use(express.json());

// Apply session and passport initialization
sessionDatabaseHandler(app);

// Apply all your routes
app.use(loginRouter);
app.use(logoutRouter);
app.use(doctorRouter);
app.use(userRouter);
app.use(userSignupRouter);
app.use(userLoginRouter);
app.use(userLogoutRouter);
app.use(userdeleteRouter);
app.use(userEditRouter);
app.use(getUser);
app.use(AppointmentBookingRouter);
app.use(getAppointments);
app.use(DoctorRouter);
app.use(doctorSignup);
app.use(doctorLogin);
app.use(doctorLogout);
app.use(doctorUpdate);
app.use(doctorDelete);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`DocCures Server is running on port ${PORT}`);
});

export default app;