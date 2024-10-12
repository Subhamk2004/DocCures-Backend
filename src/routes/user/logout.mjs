import { Router } from "express";
import '../../strategies/localStrategy.mjs';

const router = Router();


router.post("/logout", (req, res) => {
    if (!req.user) return res.sendStatus(401);
  
    req.logout((err) => {
      if (err) return res.sendStatus(400);
      req.cookies.isAuthenticated = false;
      req.cookies.useremail = "";
      res.status(200).send("User logged out successfully");
    });
  });

export default router