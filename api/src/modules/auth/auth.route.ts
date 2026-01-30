import express from "express";
import authController from "../auth/auth.controller";
import { protect } from "../../middlewares/auth.middleware";
import passport from "passport";
const router = express.Router();


router.post("/sign-up", authController.signUp);
router.post("/log-in", authController.logIn);
router.post("/log-out", protect, authController.logOut);

router.post("/forgot-pass", protect, authController.forgotPassword);
router.post("/reset-pass", protect, authController.resetPassword);

// OAuth
["google", "facebook", "github"].forEach((provider) => {
  router.get(
    `/auth/${provider}`,
    passport.authenticate(provider, { scope: ["email"] })
  );
  router.get(
    `/auth/${provider}/callback`,
    passport.authenticate(provider, { failureRedirect: "/login" }),
    (req, res) => {
      // Successful login
      res.redirect("/dashboard");
    }
  );
});

export default router;
