import type { ErrorRequestHandler } from "express";
import { env } from "../env";

export class ApiError extends Error {
  public readonly isJson: boolean;

  constructor(
    public readonly code: number,
    message: Record<string, unknown> | string
  ) {
    super(typeof message === "string" ? message : JSON.stringify(message));
    this.isJson = typeof message !== "string";
  }
}

const getDevMessage = (err: Error) => {
  const message =
    err instanceof ApiError
      ? err.isJson
        ? JSON.parse(err.message)
        : err.message
      : err.message;
  if (err instanceof ApiError) {
    return {
      code: err.code,
      message,
      stack: err.stack,
      name: err.name,
    };
  }

  // Unintentional error
  return {
    code: 500,
    message,
    stack: err.stack,
    name: err.name,
  };
};

const getProdMessage = (err: Error) => {
  if (err instanceof ApiError) {
    return {
      code: err.code,
      message: err.isJson ? JSON.parse(err.message) : err.message,
    };
  }

  // Unintentional error
  return {
    code: 500,
    message: "Something went very wrong!",
  };
};

export const globalErrorHandler: ErrorRequestHandler = (
  err,
  _req,
  res,
  _next
) => {
  const msg =
    env.DEVELOPMENT === "true" ? getDevMessage(err) : getProdMessage(err);
  return res.status(msg.code).json(msg);
};
