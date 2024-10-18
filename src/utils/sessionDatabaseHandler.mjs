import express from 'express';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import { userPassport, doctorPassport } from './passportconfig.mjs';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const sessionDatabaseHandler = (app) => {
  mongoose.connect(process.env.DATABASE_URI, {})
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));

  app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.DATABASE_URI,
      collectionName: 'sessions'
    }),
    cookie: {
      secure: true, // Always use secure cookies in production
      sameSite: 'none', // Required for cross-site cookie
      maxAge: 24 * 60 * 60 * 1000 * 7 // 1 week
    }
  }));

  app.use(userPassport.initialize());
  app.use(userPassport.session());
  app.use(doctorPassport.initialize());
  app.use(doctorPassport.session());
};

export default sessionDatabaseHandler;