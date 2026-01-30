import { z } from "zod";

const AdminSchema = z.object({
  id: z.number().int().optional(),
  name: z.string({ error: "Name is required" }).nonempty(),
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 chars"),
  role: z.enum(["admin", "host", "reception"]).default("host"),
  createdAt: z.date().optional(),
});

export { AdminSchema };
