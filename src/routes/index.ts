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
import { assureAdmin, authMiddleware } from "../auth/middleware";

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

  router.post(
    "/auth/register",
    checkPayload(registerSchema),
    (req, res, next) => {
      if (typeof req.body.isAffiliate === "boolean") {
        return authMiddleware(req, res, next);
      }
      return next();
    },
    (req, res, next) => {
      if (typeof req.body.isAffiliate === "boolean") {
        return assureAdmin(req, res, next);
      }

      return next();
    },
    registerUser
  );
  router.post("/auth/login", checkPayload(loginSchema), login);

  router.use(authMiddleware);

  router.get("/products", getAllProducts);
  router.get("/products/:id", getProduct);
  router.post("/products", checkPayload(insertProductSchema), createProduct);
  router.post("/products/order", checkPayload(insertOrderSchema), orderProduct);
  router.get("/auth/me", getMe);

  return router;
};
