import { Request, Response, NextFunction } from "express";
import AppError from "../core/errors/appError";
import logger from "../core/logger/winston.logger";
import config from "../config/config";
import { Prisma } from "@prisma/client";

const handlePrismaError = (err: any) => {
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    switch (err.code) {
      case "P2002":
        const fields = (err.meta?.target as string[])?.join(", ");
        return {
          statusCode: 400,
          message: `Duplicate value for field(s): ${fields}`,
          status: "fail",
        };
      case "P2025":
        return {
          statusCode: 404,
          message: "Record not found",
          status: "fail",
        };
      default:
        return null;
    }
  }

  if (err instanceof Prisma.PrismaClientValidationError) {
    return {
      statusCode: 400,
      message: err.message,
      status: "fail",
    };
  }

  return null;
};

const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal server error";
  let status = err.status || "error";

  const prismaErrorData = handlePrismaError(err);
  if (prismaErrorData) {
    statusCode = prismaErrorData.statusCode;
    message = prismaErrorData.message;
    status = prismaErrorData.status;
  }

  if (statusCode >= 500) {
    logger.error("SERVER ERROR 💥", err);
  } else {
    logger.warn("CLIENT ERROR ⚠️", err);
  }

  return res.status(statusCode).json({
    success: false,
    status,
    statusText: message,
    ...(config.NODE_ENV === "development" && { stack: err.stack }),
  });
};

export default errorHandler;
