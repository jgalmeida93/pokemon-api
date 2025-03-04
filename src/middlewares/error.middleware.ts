import { Request, Response, NextFunction, ErrorRequestHandler } from "express";

export class ApiError extends Error {
  constructor(
    public statusCode: number,
    public message: string
  ) {
    super(message);
    this.statusCode = statusCode;
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

const errorMiddleware: ErrorRequestHandler = (err, req, res, next) => {
  console.error(err);

  if (err instanceof ApiError) {
    res.status(err.statusCode).json({
      status: "error",
      message: err.message,
    });
  } else {
    res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};

export default errorMiddleware;
