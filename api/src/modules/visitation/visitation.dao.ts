import prisma from "../../../prisma/client";
import { Prisma, User, Visitor, Visit } from "@prisma/client";

interface VisitorExistsParams {
  email?: string;
  phone?: string;
  id_number?: string;
}

const VisitationDao = {

  async getAllHosts(): Promise<User[]> {
    return prisma.user.findMany({
      where: {
        role: {
          type: { in: ["host", "receptionist"] },
        },
      },
    });
  },

  async getHostById(id: number): Promise<User | null> {
    return prisma.user.findUnique({
      where: { id },
    });
  },

  async getHostByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { email },
    });
  },

  async searchHostsByName(name: string): Promise<User[]> {
    return prisma.user.findMany({
      where: {
        role: {
          type: { in: ["host", "receptionist"] },
        },
        name: { contains: name, mode: "insensitive" },
      },
    });
  },


  async createVisitor(data: Prisma.VisitorCreateInput): Promise<Visitor> {
    return prisma.visitor.create({ data });
  },

  async updateVisitor(
    id: number,
    data: Prisma.VisitorUpdateInput
  ): Promise<Visitor> {
    return prisma.visitor.update({
      where: { id },
      data,
    });
  },

  async getVisitorById(
    id: number
  ): Promise<(Visitor & { created_by: User | null }) | null> {
    return prisma.visitor.findUnique({
      where: { id },
      include: { created_by: true },
    });
  },

  async getVisitorByEmail(email: string): Promise<Visitor | null> {
    return prisma.visitor.findUnique({
      where: { email },
    });
  },

  async searchVisitorsByName(name: string): Promise<Visitor[]> {
    return prisma.visitor.findMany({
      where: {
        name: { contains: name, mode: "insensitive" },
      },
    });
  },

  async searchVisitors(query: string): Promise<Visitor[]> {
    return prisma.visitor.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: "insensitive" } },
          { email: { contains: query, mode: "insensitive" } },
          { phone: { contains: query, mode: "insensitive" } },
          { id_number: { contains: query, mode: "insensitive" } },
        ],
      },
    });
  },

  async getAllVisitors(): Promise<Visitor[]> {
    return prisma.visitor.findMany();
  },

  async visitorExists(params: VisitorExistsParams): Promise<Visitor | null> {
    const { email, phone, id_number } = params;

    return prisma.visitor.findFirst({
      where: {
        OR: [
          email ? { email } : undefined,
          phone ? { phone } : undefined,
          id_number ? { id_number } : undefined,
        ].filter(Boolean) as Prisma.VisitorWhereInput[],
      },
    });
  },

  async createVisit(data: Prisma.VisitCreateInput): Promise<Visit> {
    return prisma.visit.create({ data });
  },

  async updateVisit(id: number, data: Prisma.VisitUpdateInput): Promise<Visit> {
    return prisma.visit.update({
      where: { id },
      data,
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

  async getVisitsByVisitor(visitor_id: number) {
    return prisma.visit.findMany({
      where: { visitor_id },
      include: { visitor: true },
    });
  },

  async getVisitsByStatus(status: string) {
    return prisma.visit.findMany({
      where: { status },
      include: { visitor: true },
    });
  },

  async getAllVisits() {
    return prisma.visit.findMany({
      include: { visitor: true, badge: true },
    });
  },

  async hasActiveVisit(visitor_id: number) {
    return prisma.visit.findFirst({
      where: {
        visitor_id,
        status: { in: ["pending", "waiting", "approved"] },
      },
    });
  },
};

export default VisitationDao;
