import express from 'express';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import { userPassport, doctorPassport } from './passportconfig.mjs';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const sessionDatabaseHandler = (app) => {
  // MongoDB connection
  mongoose.connect(process.env.DATABASE_URI, {})
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));

  // Session middleware
  app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.DATABASE_URI,
      collectionName: 'sessions'
    }),
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: 24 * 60 * 60 * 1000 * 7 // 1 week
    }
  }));

  // Initialize Passport for users and doctors
  app.use(userPassport.initialize());
  app.use(userPassport.session());
  app.use(doctorPassport.initialize());
  app.use(doctorPassport.session());

  app.get('/', (req, res) => {
    res.send('DocCures server is running');
  });
};

export default sessionDatabaseHandler;