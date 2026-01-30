import prisma from "../../../prisma/client";
import { User } from "@prisma/client";

const UserDAO = {
  async getUserById(id: number): Promise<User | null> {
    return prisma.user.findUnique({
      where: { id },
    });
  },

  async getAllUsers(): Promise<User[]> {
    return prisma.user.findMany();
  },

  async getUserByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { email },
    });
  },

  async createUser(data: {
    name: string;
    email: string;
    password: string;
    roleId: number;
    email_verified: boolean;
    status: any;
    isEnabled: boolean;
  }): Promise<User> {
    return prisma.user.create({
      data: {
        email: data.email,
        name: data.name,
        password: data.password,
        roleId: data.roleId,
        email_verified: data.email_verified,
        status: data.status,
        isEnabled: data.isEnabled,
      },
    });
  },

  async addRefreshToken(email: string, token: string): Promise<User | null> {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return null;

    // cast to any because refreshTokens is not defined on the generated User type
    const existing: string[] = Array.isArray((user as any).refreshTokens)
      ? ((user as any).refreshTokens as string[])
      : [];
    const updatedTokens = [...existing, token];

    return prisma.user.update({
      where: { email },
      // cast data as any to avoid TS error if refreshTokens isn't in the update type
      data: { refreshTokens: updatedTokens } as any,
    });
  },

  async removeRefreshToken(email: string, token: string): Promise<User | null> {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) return null;

    // cast to any because refreshTokens is not defined on the generated User type
    const existing: string[] = Array.isArray((user as any).refreshTokens)
      ? ((user as any).refreshTokens as string[])
      : [];
    const updatedTokens = existing.filter((t) => t !== token);

    return prisma.user.update({
      where: { email },
      // cast data as any to avoid TS error if refreshTokens isn't in the update type
      data: { refreshTokens: updatedTokens } as any,
    });
  },

  async countUsers() {
    return await prisma.user.count();
  },
};

export default UserDAO;
