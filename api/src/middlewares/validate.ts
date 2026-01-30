import { ZodError, ZodSchema } from "zod";
import type { RequestHandler } from "express";

type SchemaBag = {
  body?: ZodSchema<any>;
  query?: ZodSchema<any>;
  params?: ZodSchema<any>;
};

export const validate = ({ body, query, params }: SchemaBag): RequestHandler => {
  return (req, res, next) => {
    try {
      if (body) body.parse(req.body);
      if (query) query.parse(req.query);
      if (params) params.parse(req.params);
      next();
    } catch (error: any) {
      console.error("Validation error:", error);
      if (!(error instanceof ZodError)) {
        return res.status(500).json({
          success: false,
          message: "Internal validation error",
        });
      }

      const formatted: Record<string, string> = {};
      if (Array.isArray(error)) {
        error.forEach((err: any) => {
          const key = Array.isArray(err.path) && err.path.length ? err.path.join(".") : "unknown";
          formatted[key] = err.message;
        });
      }

      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors: formatted,
      });
    }
  };
};

export default validate;
