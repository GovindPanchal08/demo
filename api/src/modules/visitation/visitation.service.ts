import VisitationDao from "./visitation.dao";
import prisma from "../../../prisma/client";
import { sendMail } from "../../utils/notify/sendEmail";
import AppError from "../../core/errors/appError";
import { sendVisitCreatedMail } from "../../utils/mail/sendVisitCreatedMail";

class VisitationService {

    async createVisitorWithVisitation(data: any, user: any) {
        const result = await prisma.$transaction(async (tx) => {

            const existing = await tx.visitor.findFirst({
                where: {
                    OR: [
                        { email: data.visitor.email },
                        { phone: data.visitor.phone },
                        { id_number: data.visitor.id_number },
                    ],
                },
            });

            const visitor =
                existing || (await tx.visitor.create({ data: data.visitor }));


            const active = await tx.visit.findFirst({
                where: {
                    visitor_id: visitor.id,
                    checkout_time: null,
                },
            });

            if (active) {
                throw new AppError("Visitor already has an active/open visit.", 400);
            }


            const badge = await tx.badge.create({
                data: {
                    type: "visitor",
                    qr_code: visitor.uuid,
                },
            });


            const visit = await tx.visit.create({
                data: {
                    visitor_id: visitor.id,
                    host_id: user.id,
                    time_from: data.visit.time_from,
                    time_to: data.visit.time_to,
                    preregistered: data.visit.preregistered ?? true,
                    badge_id: badge.id,
                    checked_by: user.id,
                    status: "pending",
                    isApproved: false,


                    departments: {
                        create: data.visit.facilities.map((id: number) => ({
                            department_id: id,
                        })),
                    },
                },
                include: {
                    visitor: true,
                    host: true,
                    badge: true,
                    checkedUser: true,
                    departments: {
                        include: {
                            department: true,
                        },
                    },
                },
            });


            return { visit, visitor, badge };
        });

        await sendVisitCreatedMail(result.visit);


        return result.visit;
    }

    async createBulkVisitorWithVisitation(data: any, user: any) {
        if (!Array.isArray(data.visitors) || data.visitors.length === 0) {
            throw new AppError("Visitors array is required", 400);
        }

        const result = await prisma.$transaction(async (tx) => {
            if (!Array.isArray(data.visit?.department_ids) || data.visit.department_ids.length === 0) {
                throw new AppError("At least one department is required", 400);
            }

            const validDepartments = await tx.department.count({
                where: { id: { in: data.visit.department_ids } },
            });

            if (validDepartments !== data.visit.department_ids.length) {
                throw new AppError("Invalid department selected", 400);
            }

            const group = await tx.group.create({
                data: {
                    name: data.group?.name,
                    lead_email: data.group?.lead_email,
                    size: data.visitors.length,
                },
            });

            const created: any[] = [];

            for (const v of data.visitors) {
                let visitor = await tx.visitor.findFirst({
                    where: {
                        OR: [
                            { email: v.email },
                            { phone: v.phone },
                            ...(v.id_number ? [{ id_number: v.id_number }] : []),
                        ],
                    },
                });

                if (!visitor) {
                    visitor = await tx.visitor.create({
                        data: {
                            ...v,
                            groupId: group.id,
                        },
                    });
                } else if (!visitor.groupId) {
                    visitor = await tx.visitor.update({
                        where: { id: visitor.id },
                        data: { groupId: group.id },
                    });
                }

                const activeVisit = await tx.visit.findFirst({
                    where: {
                        visitor_id: visitor.id,
                        checkout_time: null,
                    },
                });

                if (activeVisit) {
                    throw new AppError(
                        `Visitor ${visitor.name} already has an active visit`,
                        400
                    );
                }

                const badge = await tx.badge.create({
                    data: {
                        type: "visitor",
                        qr_code: visitor.uuid,
                    },
                });

                // 6️⃣ Create visit WITH departments
                const visit = await tx.visit.create({
                    data: {
                        visitor_id: visitor.id,
                        host_id: user.id,
                        time_from: data.visit?.time_from,
                        time_to: data.visit?.time_to,
                        preregistered: data.visit?.preregistered ?? true,
                        badge_id: badge.id,
                        checked_by: user.id,
                        status: "pending",
                        isApproved: false,

                        departments: {
                            create: data.visit.department_ids.map((deptId: number) => ({
                                department_id: deptId,
                            })),
                        },
                    },
                    include: {
                        visitor: {
                            include: { group: true },
                        },
                        host: true,
                        badge: true,
                        checkedUser: true,
                        departments: {
                            include: {
                                department: true,
                            },
                        },
                    },
                });

                created.push({ visitor, visit, badge });
            }

            return created;
        });

        for (const item of result) {
            await sendMail(item.visitor.email, "Visit Created");
        }

        return result.map((r) => r.visit);
    }

    async assignOrReassignVisit(
        visitId: number,
        assignedTo: number,
        currentUser: any
    ) {
        return prisma.$transaction(async (tx) => {
            const visit = await tx.visit.findUnique({
                where: { id: visitId },
                include: {
                    host: true,
                    checkedUser: true
                },
            });

            if (!visit) {
                throw new AppError("Visit not found", 404);
            }

            const isHost = visit.host_id === currentUser.id;
            const isSuperAdmin = currentUser.roleId === 2;

            if (!isHost && !isSuperAdmin) {
                throw new AppError("You are not allowed to assign this visit", 403);
            }

            if (visit.assigned_to === assignedTo) {
                throw new AppError("Visit is already assigned to this user", 400);
            }

            const user = await tx.user.findUnique({
                where: { id: assignedTo },
            });

            if (!user) {
                throw new AppError("Assigned user not found", 404);
            }

            const updatedVisit = await tx.visit.update({
                where: { id: visitId },
                data: {
                    assigned_to: assignedTo,
                },
                include: {
                    checkedUser: true
                },
            });

            return updatedVisit;
        });
    }

    async getVisitation(id: number) {
        if (isNaN(id)) throw new Error("Invalid visitation id");

        const visit = await VisitationDao.getVisitById(id);
        if (!visit) throw new Error("Visitation not found");

        return visit;
    }

    async getVisitor(id: number) {
        if (isNaN(id)) throw new Error("Invalid visitor id");
        return VisitationDao.getVisitorById(id);
    }

    async getAllVisitors() {
        return VisitationDao.getAllVisitors();
    }

    async getAllVisitations() {
        return VisitationDao.getAllVisits();
    }

    async updateVisitor(id: number, data: any) {
        return VisitationDao.updateVisitor(id, data);
    }

    async updateVisitation(id: number, data: any, user: any) {
        const visit = await VisitationDao.getVisitById(id);
        if (!visit) throw new Error("Visitation not found");

        // Disallowed fields
        const forbidden = ["visitor_id", "badge_id", "host_id"];
        forbidden.forEach((key) => {
            if (key in data) {
                throw new Error(`Cannot modify protected field: ${key}`);
            }
        });

        // Admin-only rules
        if (data.isApproved === true || data.status === "approved") {
            if (user.role !== "admin") {
                throw new Error("Only admin can approve a visit");
            }
        }

        // Allowed fields for visitation
        const allowed = [
            "time_from",
            "time_to",
            "status",
            "checkin_time",
            "checkout_time",
            "isApproved",
            "preregistered",
        ];

        const updates: any = {};
        allowed.forEach((key) => {
            if (data[key] !== undefined) updates[key] = data[key];
        });

        const updated = await prisma.visit.update({
            where: { id },
            data: updates,
            include: {
                visitor: true,
                host: true,
                badge: true,
                checkedUser: true,
            },
        });

        return updated;
    }

    async requestToAdmin(hostId: number, message?: string) {
        // 1. Create request record
        const request = await prisma.guestRequest.create({
            data: {
                host_id: hostId,
                message: message || "Host requests permission to create a Guest",
            },
            include: {
                host: true,
            },
        });

        // 2. Get admin email/phone
        const admin = await prisma.user.findFirst({
            where: {
                role: { type: "admin" },
            },
            include: { role: true },
        });

        console.log(admin);
        if (admin) {
            // Send Email
            await sendMail(admin.email, "New Host Request for Guest Creation", {
                text: `Host ${request.host.name} requested permission`,
            });

            // // Send WhatsApp (optional)
            // if (admin.phone) {
            //   await sendWhatsAppMessage(
            //     admin.phone,
            //     `New Guest Creation Request\nHost: ${request.host.name}\nMessage: ${request.message}`
            //   );
            // }
        }

        return request;
    }

}

export default new VisitationService();
