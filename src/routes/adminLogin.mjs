import express from "express";
import passport from "passport";
import dotenv from "dotenv";

dotenv.config();
let adminEmail = process.env.ADMIN_EMAIL;
let adminPassword = process.env.ADMIN_PASSWORD;


let loginRouter = express.Router();

loginRouter.post('/admin/login', (req, res) => {
    let { email, password } = req.body;
    console.log(email, password);

    if (email === adminEmail && password === adminPassword) {
        console.log('Authenticated');
        req.session.isAuthenticated = true;
        req.session.user = 'Admin'
        req.session.email = email
        console.log(req.session);

        return res.send({
            'isAuthenticated': true,
            'email': email,
        }).status(200);
    }
    else if (email && password !== adminPassword) {
        return res.send({ 'isAuthenticated': false }).status(401);
    }
    return res.send({ message: 'Not Authenticated' }).status(401);
})

loginRouter.get('/admin/login/status', (req, res) => {
    if (req.session.isAuthenticated) {     
        console.log('Authenticated');
        return res.send({
            'isAuthenticated': true,
            'email': req.session.email,
        }).status(200);
    }
    else {
        console.log(req.sessionID,'Not Authenticated');
        return res.send({ 'isAuthenticated': false }).status(401);
    }
});

export default loginRouter;