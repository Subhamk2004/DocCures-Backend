import express from "express";
import session from 'express-session';
import mongoose from "mongoose";
import Mongostore from "connect-mongo";
import cookieParser from "cookie-parser";
import passport from "passport";
import dotenv from "dotenv";

dotenv.config();

const mongoURI = process.env.DATABASE_URI;

let router = express();

const mongoOptions = {
    retryWrites: true,
    w: "majority",
    tls: true,
    tlsInsecure: false,
  };

const mongoConnect = () => {
    mongoose.connect(mongoURI, mongoOptions)
        .then((data) => {
            console.log('Database connected');
        })
        .catch((err) => {
            console.log('Failed to connect');
        })
}

mongoConnect();

router.use(express.json());

router.use(cookieParser('CookieSecret'));
router.use(
    session({
        secret: process.env.SESSION_SECRET,
        saveUninitialized: false,
        resave: false,
        cookie: {
            maxAge: 1000 * 60 * 60 * 24,
            httpOnly: true,
        },
        store: Mongostore.create({
            client: mongoose.connection.getClient(),
        })
    })
)

router.use(passport.initialize());
router.use(passport.session());

router.get('/', (req, res) => {
    req.session.visited = true;
    console.log(req.session);
    res.send('DocCures Server is running').status(200);
})

export default router;