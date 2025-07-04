import { Router } from "express";

const router = Router();

router.post("/logout", (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ message: "No authenticated session found" });
  }

  else {
    req.session.user = null;
    res.status(200).json({ message: "User logged out successfully" });
  }
});

export default router;