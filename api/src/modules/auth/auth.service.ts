import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import config from "../../config/config";
import UserDAO from "./user.dao";
import prisma from "../../../prisma/client";
import { sendMail } from "../../utils/notify/sendEmail";
import AppError from "../../core/errors/appError";

class AuthService {
  async superAdminSignUp({
    email,
    name,
    password,
  }: {
    email: string;
    name: string;
    password: string;
  }) {
    const existingUsers = await UserDAO.countUsers();

    if (existingUsers > 0) {
      throw new AppError("Signup is disabled", 403);
    }

    const hashPassword = await bcrypt.hash(password, 10);

    return UserDAO.createUser({
      email,
      name,
      password: hashPassword,
      roleId: 1,
      email_verified: true,
      status: "active",
      isEnabled: true,
    });
  }

  async logIn({ email, password }: { email: string; password: string }) {
    const user = await UserDAO.getUserByEmail(email);

    if (!user) {
      throw new AppError("Invalid credentials", 401);
    }

    if (user.status !== "active") {
      throw new AppError("Account not activated", 403);
    }

    if (!user.password) {
      throw new AppError("Password not set", 403);
    }

    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
      throw new AppError("Invalid credentials", 401);
    }

    return user;
  }


  async logOut(email: string, token: string) {
    const ex = await UserDAO.getUserByEmail(email);
    if (!ex) {
      return false;
    }
    await UserDAO.removeRefreshToken(email, token);
    return true;
  }

  async generateToken(user: any, exp: `${number}${"s" | "m" | "h" | "d"}`, label: string) {
    // console.log(user)
    const token = jwt.sign(
      { id: user.id, email: user.email, roleId: user.roleId },
      config.JWT_SECRET!,
      { expiresIn: exp }
    )
    return token;
  }

  // password reset and forgot service
  async generateResetToken({ email }: { email: string }) {
    const user = await UserDAO.getUserByEmail(email);
    if (!user) throw new AppError("User not found", 404);

    const token = jwt.sign({ email }, config.JWT_RESET_SECRET!, {
      expiresIn: "1h",
    });

    await prisma.passwordReset.create({
      data: { email, token, expiresAt: new Date(Date.now() + 3600000) },
    });

    return token;
  }

  async verifyResetToken(token: string) {
    try {
      const decoded: any = jwt.verify(token, config.JWT_RESET_SECRET!);

      const record = await prisma.passwordReset.findFirst({
        where: { email: decoded.email, token, expiresAt: { gte: new Date() } },
      });

      if (!record) return null;

      return await UserDAO.getUserByEmail(decoded.email);
    } catch (err) {
      return null;
    }
  }

  async updatePassword(email: string, newPassword: string) {
    const hashed = await bcrypt.hash(newPassword, 10);
    return await prisma.user.update({
      where: { email },
      data: { password: hashed },
    })
  }
}

export default new AuthService();
