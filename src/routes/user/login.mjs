import { Router } from "express";
import '../../strategies/localStrategy.mjs';
import passport from 'passport';

const router = Router();

router.post('/loginuser', (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (err) {
            return res.status(500).json({ message: "An unexpected error occurred" });
        }
        if (!user) {
            return res.status(401).json({
                message: info.message,
                auth: false
            });
        }
        req.logIn(user, (err) => {
            if (err) {
                return res.status(500).json({ message: "An unexpected error occurred" });
            }

            console.log('Entered login endpoint');
            req.session.isAuthenticated = true;
            req.session.email = user.email;
            console.log(req.session);

            req.session.save((err) => {
                if (err) {
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