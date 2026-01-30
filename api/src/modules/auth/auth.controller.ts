import UserDAO from "../auth/user.dao";
import userService from "./auth.service";

import config from "../../config/config";
import { NextFunction, Request, Response } from "express";
import { sendMail } from "../../utils/notify/sendEmail";
import AppError from "../../core/errors/appError";

class authController {
  signUp = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, name, password } = req.body;

      const user = await userService.superAdminSignUp({
        email,
        name,
        password,
      });

      res.status(201).json({
        success: true,
        data: {
          email: user.email,
          name: user.name,
          roleId: user.roleId,
        },
      });
    } catch (error) {
      next(error)
    }
  };

  logIn = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body;

      const user = await userService.logIn({ email, password });

      const accessToken = await userService.generateToken(user, "1d", "access");
      const refreshToken = await userService.generateToken(user, "1d", "refresh");

      res.cookie("accessToken", accessToken, {
        maxAge: 24 * 60 * 60 * 1000,
        httpOnly: true,
      });

      res.cookie("refreshToken", refreshToken, {
        maxAge: 2_592_000_000,
        httpOnly: true,
      });

      res.status(200).json({
        success: true,
        data: {
          email: user.email,
          name: user.name,
          roleId: user.roleId,
          isEnabled: user.isEnabled,
        },
        accessToken,
      });
    } catch (error) {
      next(error);
    }
  };


  logOut = async function (req: Request, res: Response) {
    try {
      const refreshToken = req.cookies?.refreshToken;
      const email = req.user?.email;
      if (!email) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
      }
      await userService.logOut(email, refreshToken);

      res.clearCookie("accessToken", { httpOnly: true });
      res.clearCookie("refreshToken", { httpOnly: true });
      res.clearCookie("__l", { httpOnly: true });

      return res
        .status(200)
        .json({ success: true, message: "Logged out successfully" });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ err: "Internal Server Error" });
    }
  };

  forgotPassword = async (req: Request, res: Response) => {
    const { email } = req.body;
    if (!email) {
      return res
        .status(400)
        .json({ success: false, message: "Email is required" });
    }

    const resetToken = await userService.generateResetToken({ email });
    await sendMail(
      email,
      `${config.NODE_ENV === "production"
        ? "https://testdog.in"
        : "http://localhost:3000"
      }/api/v1/auth/reset-password?token=${resetToken}`
    );

    res.status(200).json({
      success: true,
      message: "Password reset email sent",
    });
  };
  resetPassword = async (req: Request, res: Response) => {
    const { token } = req.query;
    const { newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Token and new password are required",
      });
    }

    // Verify token and get user
    const user = await userService.verifyResetToken(token as string);
    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid or expired token" });
    }

    // Update user password
    await userService.updatePassword(user.email, newPassword);

    res.status(200).json({
      success: true,
      message: "Password reset successfully",
    });
  };
}

export default new authController();
