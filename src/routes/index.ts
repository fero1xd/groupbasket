import { Router, type RequestHandler } from "express";
import {
  createProduct,
  orderProduct,
  getAllProducts,
  getProduct,
} from "../controllers/products";
import type { z } from "zod";
import {
  insertOrderSchema,
  insertProductSchema,
  loginSchema,
  registerSchema,
} from "../db/zod";
import { ApiError } from "../utils/errors";
import { getMe, login, registerUser } from "../controllers/auth";
import { authMiddleware } from "../auth/middleware";

const checkPayload = (schema: z.ZodSchema): RequestHandler => {
  return (req, _res, next) => {
    const data = schema.safeParse(req.body);
    if (!data.success) {
      return next(new ApiError(400, data.error.flatten()));
    }

    next();
  };
};

export const registerRoutes = () => {
  const router = Router();

  router.get("/products", getAllProducts);
  router.get("/products/:id", getProduct);
  router.post("/products", checkPayload(insertProductSchema), createProduct);
  router.post("/products/order", checkPayload(insertOrderSchema), orderProduct);

  router.post("/auth/register", checkPayload(registerSchema), registerUser);
  router.post("/auth/login", checkPayload(loginSchema), login);
  router.get("/auth/me", authMiddleware, getMe);

  return router;
};
