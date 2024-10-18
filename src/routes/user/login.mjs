import { Router } from "express";
import '../../strategies/localStrategy.mjs';
import { userPassport } from '../../utils/passportconfig.mjs';

const router = Router();

router.post('/loginuser', (req, res, next) => {
  userPassport.authenticate('user-local', (err, user, info) => {
    if (err) {
      console.error('Authentication error:', err);
      return res.status(500).json({ message: "An unexpected error occurred" });
    }
    if (!user) {
      return res.status(401).json({
        message: info.message || "Authentication failed",
        auth: false
      });
    }
    req.login(user, { session: true }, (err) => {  // Changed to session: true
      if (err) {
        console.error('Login error:', err);
        return res.status(500).json({ message: "An unexpected error occurred" });
      }
      console.log('User logged in successfully');
      console.log(req.user);
      req.session.isAuthenticated = true;
      req.session.email = req.user.email;
      req.session.userType = 'user';
      req.session.user = req.user;
      // res.session.cookies = req.cookies;
      console.log(req.cookies);
      
      
      req.session.save((err) => {
        if (err) {
          console.error('Session save error:', err);
          return res.status(500).json({ message: 'Could not save session' });
        }
        return res.status(200).json({
          message: "Login successful",
          user: {
            email: user.email,
          },
          auth: true
        });
      });
    });
  })(req, res, next);
});

export default router;