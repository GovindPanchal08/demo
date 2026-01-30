import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import config from "../config/config";
import UserDAO from "../modules/auth/user.dao";
import prisma from "../../prisma/client";

declare global {
  namespace Express {
    interface User {
      email: string;
      // roletype: string;
      [key: string]: any;
    }

    interface Request {
      user?: User;
    }
  }
}

interface TokenPayload extends JwtPayload {
  id: string;
  email: string;
  role: string;
}

export const protect = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {

  try {
    let token: string | undefined;

    if (req.cookies?.accessToken) {
      token = req.cookies.accessToken;
    } else if (req.headers.authorization?.startsWith("Bearer ")) {
      token = req.headers.authorization.split(" ")[1];
    }
    if (!token) {
      return res.status(401).json({ error: "No token provided" });
    }

    const decoded = jwt.verify(token, config.JWT_SECRET) as unknown as TokenPayload;


    if (!decoded?.email) {
      return res.status(401).json({ error: "Invalid token payload" });
    }
    const user = await UserDAO.getUserByEmail(decoded.email);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    req.user = user;

    next();
  } catch (error) {
    console.error("Auth Error:", error);
    return res.status(401).json({ error: "Authentication failed" });
  }
};

export const restrictTo = (...allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ error: "You are not authorized" });
    }

    next();
  };
};

export const checkPermission =
  (menuSlug: string) =>
    async (req: any, res: any, next: any) => {
      const roleId = req.user?.roleId;

      if (roleId == 1) return next()
      if (!roleId) {
        return res.status(401).json({ msg: "Unauthorized" });
      }

      // 🔹 find MAIN menu (parentId = null)
      const menu = await prisma.menu.findFirst({
        where: {
          slug: menuSlug
        },
        select: { id: true },
      });

      if (!menu) {
        return res.status(403).json({ msg: "Invalid permission" });
      }

      const rolePermission = await prisma.roleMenu.findUnique({
        where: { roleId },
      });

      if (
        !rolePermission ||
        !rolePermission.menuIds.includes(menu.id)
      ) {
        return res.status(403).json({ msg: "Permission denied" });
      }

      next();
    };


