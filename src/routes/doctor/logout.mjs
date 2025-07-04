import { Router } from "express";
import { doctorPassport } from '../../utils/passportconfig.mjs';

const router = Router();

router.post("/logout/doctor", (req, res) => {
  if (!req.session.doctor) {
    return res.status(401).json({ message: "No authenticated session found" });
  }

  else {
    req.session.doctor = null;
    res.status(200).json({ message: "Doctor logged out successfully" });
  }
});

export default router;