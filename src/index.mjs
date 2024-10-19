import express from 'express';
import cors from 'cors';
import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import sessionDatabaseHandler from './utils/sessionDatabaseHandler.mjs';
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
import emergencyRouter from './routes/emergency/Emergency.mjs';
import DoctorSchema from './schema/DoctorSchema.mjs';
import { EmergencyRequest } from './schema/Emergency.mjs';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.set('trust proxy', 1);
const server = http.createServer(app);

const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:5175',
  'https://doc-cures-user.vercel.app',
  'https://doc-cures-doctor.vercel.app',
  'https://doc-cures-admin.vercel.app',
];

const corsOptions = {
  origin: function (origin, callback) {
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.header('Access-Control-Allow-Credentials', true);
  next();
});

app.use(express.json());

app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});


const io = new SocketIOServer(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
    credentials: true,
    transports: ['websocket', 'polling']
  },
  allowEIO3: true, // Allow Engine.IO 3 client
  path: '/socket.io/'
});

let a;

// Apply all your existing routes
sessionDatabaseHandler(app);
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
app.use(emergencyRouter);

io.on('connection', (socket) => {
  console.log('New client connected');

  socket.on('joinDoctorRoom', (doctorId) => {
    socket.join(`doctor_${doctorId}`);
    console.log(`Doctor ${doctorId} joined personal room`);
  });

  socket.on('leaveDoctorRoom', (doctorId) => {
    socket.leave(`doctor_${doctorId}`);
    console.log(`Doctor ${doctorId} left personal room`);
  });

  socket.on('searchEmergencyDoctors', async () => {
    try {
      const availableDoctors = await DoctorSchema.find({ availableForEmergency: true });
      if (availableDoctors.length > 0) {
        socket.emit('emergencyDoctorsList', availableDoctors);
        console.log('Emergency doctors found:', availableDoctors);
      } else {
        socket.emit('emergencyDoctorsList', {
          message: 'No doctors available for emergency'
        });
        console.log('No doctors available for emergency');
      }
    } catch (error) {
      console.error('Error searching for emergency doctors:', error);
    }
  });

  socket.on('sendEmergencyRequest', async ({ userId, doctorId }) => {
    try {
      console.log('Received emergency request:', { userId, doctorId });

      if (!userId || !doctorId) {
        throw new Error('Both userId and doctorId are required');
      }

      const newRequest = new EmergencyRequest({
        user: userId,
        doctor: doctorId,
        status: 'pending'
      });

      const savedRequest = await newRequest.save();
      console.log('Emergency request saved:', savedRequest);

      io.to(`doctor_${doctorId}`).emit('newEmergencyRequest', savedRequest);
      socket.emit('emergencyRequestSent', savedRequest);
    } catch (error) {
      console.error('Error sending emergency request:', error);
      socket.emit('emergencyRequestError', { message: error.message });
    }
  });

  socket.on('emergencyRequestResponse', (request) => {
    console.log('Emergency request response received:', request);
    io.emit('emergencyRequestResponse', request);
  });

  socket.on('joinEmergencyRoom', (roomName) => {
    socket.join(roomName);
    console.log(`Client joined emergency room: ${roomName}`);
  });

  socket.on('emergencyMessage', (messageData) => {
    console.log('Emergency message received:', messageData);
    io.to(messageData.room).emit('emergencyMessage', messageData);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`DocCures Server is running on port ${PORT}`);
});

export default app;
export { io };