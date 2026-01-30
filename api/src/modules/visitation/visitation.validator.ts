import { z } from "zod";

const VisitorSchema = z.object({
    id: z.number().int().optional(),

    name: z
        .string()
        .min(1, "Visitor name is required")
        .max(100, "Name must be under 100 characters"),

    email: z
        .string()
        .email("Invalid email address")
        .max(320, "Email too long"),

    phone: z
        .string()
        .regex(/^[6-9]\d{9}$/, "Phone number must be a valid 10-digit Indian number"),

    purpose: z
        .string()
        .min(1, "Purpose is required")
        .max(500, "Purpose too long"),

    user_id: z.number().int().optional(),

    id_type: z
        .enum(["Aadhar", "pan", "passport", "driving_license"])
        .optional(),

    // id_number: z
    //     .string()
    //     .optional()
    //     .refine(
    //         (val) => !val || /^\d{12}$/.test(val),
    //         { message: "Aadhaar must be exactly 12 digits" }
    //     )
    //     .refine(
    //         (val) => !val || validateAadhaar(val),
    //         { message: "Invalid Aadhaar number" }
    //     ),

    // id_scan_s3: z.string().url("Invalid S3 URL").optional(),
    // photo_s3: z.string().url("Invalid S3 URL").optional(),

    created_at: z.date().optional(),
});

const VisitStatusEnum = z.enum([
    "pending",
    "checked_in",
    "checked_out",
    "cancelled",
]);

const VisitSchema = z.object({
    id: z.number().int().optional(),

    visitor_id: z.number().int({
        error: "Visitor is required",
    }),

    host_id: z.number().int().optional(),

    time_from: z.coerce.date().optional(),
    time_to: z.coerce.date().optional(),

    checkin_time: z.date().optional(),
    checkout_time: z.date().optional(),

    status: VisitStatusEnum.default("pending"),

    preregistered: z.boolean().optional(),
    isApproved: z.boolean().optional(),

    badge_id: z.number().int().optional(),
    checked_by: z.number().int().optional(),
    department_id: z.number().int().optional(),

    created_at: z.date().optional(),
});

const VisitCreateSchema = VisitSchema
    .omit({ visitor_id: true })
    .superRefine((data, ctx) => {
        // time_from < time_to
        if (data.time_from && data.time_to && data.time_to <= data.time_from) {
            ctx.addIssue({
                path: ["time_to"],
                message: "time_to must be after time_from",
                code: z.ZodIssueCode.custom,
            });
        }

        // checkin_time must be after time_from
        if (data.checkin_time && data.time_from && data.checkin_time < data.time_from) {
            ctx.addIssue({
                path: ["checkin_time"],
                message: "Check-in cannot be before visit start time",
                code: z.ZodIssueCode.custom,
            });
        }

        // checkout must be after checkin
        if (
            data.checkin_time &&
            data.checkout_time &&
            data.checkout_time <= data.checkin_time
        ) {
            ctx.addIssue({
                path: ["checkout_time"],
                message: "Checkout must be after check-in",
                code: z.ZodIssueCode.custom,
            });
        }

        // status vs timestamps consistency
        if (data.status === "checked_in" && !data.checkin_time) {
            ctx.addIssue({
                path: ["checkin_time"],
                message: "checkin_time is required when status is checked_in",
                code: z.ZodIssueCode.custom,
            });
        }

        if (data.status === "checked_out" && !data.checkout_time) {
            ctx.addIssue({
                path: ["checkout_time"],
                message: "checkout_time is required when status is checked_out",
                code: z.ZodIssueCode.custom,
            });
        }
    });



const BadgeSchema = z.object({
    id: z.number().int().optional(),
    type: z.string(),
    qr_code: z.string(),
    issued_at: z.date().optional(),
    expires_at: z.date().optional(),
});

const CreateVisitorWithVisitSchema = z.object({
    visitor: VisitorSchema,
    visit: VisitCreateSchema
});

export {
    VisitSchema,
    VisitorSchema,
    CreateVisitorWithVisitSchema,
}