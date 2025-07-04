import { Router } from "express";
import '../../strategies/docLocalStrategies.mjs';
import { doctorPassport } from '../../utils/passportconfig.mjs';

const router = Router();

router.post('/doctor/login', (req, res, next) => {
  doctorPassport.authenticate('doctor-local', (err, doctor, info) => {
    if (err) {
      console.error('Authentication error:', err);
      return res.status(500).json({ message: "An unexpected error occurred" });
    }
    if (!doctor) {
      return res.status(401).json({
        message: info.message || "Authentication failed",
        auth: false
      });
    }
    req.login(doctor, { session: false }, (err) => {
      if (err) {
        console.error('Login error:', err);
        return res.status(500).json({ message: "An unexpected error occurred" });
      }
      console.log('Doctor logged in successfully');
      console.log(req.user);
      
      req.session.isAuthenticated = true;
      req.session.email = doctor.email;
      req.session.userType = 'doctor';
      req.session.doctor = req.user;
      req.session.save((err) => {
        if (err) {
          console.error('Session save error:', err);
          return res.status(500).json({ message: 'Could not save session' });
        }
        return res.status(200).json({
          message: "Login successful",
          user: {
            email: doctor.email,
          },
          auth: true
        });
      });
    });
  })(req, res, next);
});

export default router;