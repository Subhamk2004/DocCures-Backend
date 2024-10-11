import { Router } from 'express';

let logoutRouter = Router();
logoutRouter.post("/admin/logout", (req, res) => {
    if (!req.session.isAuthenticated) {
        console.log('Not Authenticated', req.session);
        return res.sendStatus(401);
    }

    req.logout((err) => {
        console.log('Logged out');

        if (err) return res.sendStatus(400);
        req.session.isAuthenticated = false;
        req.session.email = "";
        res.status(200).json({
            message: 'Logged out',
            isAuthenticated: false,
        });
    });
});

export default logoutRouter;