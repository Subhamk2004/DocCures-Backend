import express, { json } from 'express';
import cors from 'cors';
import sessionDatabseHandler from './utils/sessionDatabaseHandler.mjs';
import loginRouter from './routes/admin/adminLogin.mjs';
import logoutRouter from './routes/admin/adminLogout.mjs';
import doctorRouter from './routes/admin/doctor.mjs';
import userRouter from './routes/user/userRoute.mjs'

let app = express();

const corsOptions = {
    origin: ['http://localhost:5174', 'http://localhost:5173'],
    credentials: true,
    methods: 'GET,POST',
};

app.use(cors(corsOptions));

app.use(express.json());
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`DocCures Server is running on port ${PORT}`);
});

app.use(sessionDatabseHandler);
app.use(loginRouter);
app.use(logoutRouter);
app.use(doctorRouter);
app.use(userRouter)
