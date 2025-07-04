import express from 'express';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import { userPassport, doctorPassport } from './passportconfig.mjs';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';

dotenv.config();

const mongoOptions = {
  retryWrites: true,
  w: "majority",
  tls: true,
  tlsInsecure: false,
  // tlsAllowInvalidCertificates: true
};

const sessionDatabaseHandler = (app) => {
  mongoose.connect(process.env.DATABASE_URI, mongoOptions)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));

  app.use(cookieParser('CookieSecret'));
  app.use(
    session({
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // Only use secure in production
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax'
      },
      store: MongoStore.create({
        client: mongoose.connection.getClient(),
      }),
    }));

  app.use(userPassport.initialize());
  app.use(userPassport.session());
  app.use(doctorPassport.initialize());
  app.use(doctorPassport.session());

  app.get('/', (req, res) => {
    console.log(req.session);
    req.session.visited = true;
    res.status(200).send('Hello from the home route!');
  })
};

export default sessionDatabaseHandler;