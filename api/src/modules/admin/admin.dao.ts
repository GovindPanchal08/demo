import prisma from "../../../prisma/client";

const adminDAO = {

  async getAllHosts() {
    return prisma.user.findMany({
      where: {
        role: { type: { in: ["host", "receptionist"] } },
      },
    });
  },

  async getHostById(id: number) {
    return prisma.user.findUnique({
      where: { id },
    });
  },

  async toggleHostStatus(id: number, isEnabled: boolean) {
    return prisma.user.update({
      where: { id },
      data: { isEnabled },
    });
  },

  async getAllVisitors() {
    return prisma.visitor.findMany();
  },

  async getVisitorById(id: number) {
    return prisma.visitor.findUnique({
      where: { id },
    });
  },

  async getVisitorByEmail(email: string) {
    return prisma.visitor.findUnique({
      where: { email },
    });
  },

  async toggleVisitorStatus(id: number, isEnabled: boolean) {
    return prisma.user.update({
      where: { id },
      data: { isEnabled },
    });
  },



  async getAllVisits() {
    return prisma.visit.findMany({
      include: {
        visitor: true,

        badge: true,
      },
    });
  },

  async getVisitById(id: number) {
    return prisma.visit.findUnique({
      where: { id },
      include: {
        visitor: true,

        badge: true,
      },
    });
  },

  async approveVisit(id: number) {
    return prisma.visit.update({
      where: { id },
      data: { status: "approved" },
    });
  },

  async approveVisitor(id: number) {
    return prisma.visit.update({
      where: { id },
      data: { isApproved: true },
    });
  },
};

module.exports = adminDAO;
