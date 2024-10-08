import express, { json } from 'express';
import cors from 'cors';
import sessionDatabseHandler from './utils/sessionDatabaseHandler.mjs';
import loginRouter from './routes/adminLogin.mjs';

let app = express();

const corsOptions = {
    origin: 'http://localhost:5174',
    credentials: true,
    methods: 'GET,POST',
};

app.use(cors(corsOptions));

app.use(express.json());
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`DocCures Server is running on port ${PORT}`);
});

app.use(sessionDatabseHandler);
app.use(loginRouter);

