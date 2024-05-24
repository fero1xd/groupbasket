<<<<<<< HEAD
import { Router, type Application, type RequestHandler } from "express";
import {
  createProduct,
  demandProduct,
=======
import { Router, type RequestHandler } from "express";
import {
  createProduct,
  orderProduct,
>>>>>>> ac38c7d (reinit)
  getAllProducts,
  getProduct,
} from "../controllers/products";
import type { z } from "zod";
<<<<<<< HEAD
import { insertDemandSchema, insertProductSchema } from "../db/zod";
import { ApiError } from "../utils/errors";

const checkPayload = (schema: z.ZodSchema): RequestHandler => {
  return (req, res, next) => {
=======
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
>>>>>>> ac38c7d (reinit)
    const data = schema.safeParse(req.body);
    if (!data.success) {
      return next(new ApiError(400, data.error.flatten()));
    }

    next();
  };
};

<<<<<<< HEAD
export const registerRoutes = (app: Application) => {
=======
export const registerRoutes = () => {
>>>>>>> ac38c7d (reinit)
  const router = Router();

  router.get("/products", getAllProducts);
  router.get("/products/:id", getProduct);
  router.post("/products", checkPayload(insertProductSchema), createProduct);
<<<<<<< HEAD
  router.post(
    "/products/demand",
    checkPayload(insertDemandSchema),
    demandProduct
  );
=======
  router.post("/products/order", checkPayload(insertOrderSchema), orderProduct);

  router.post("/auth/register", checkPayload(registerSchema), registerUser);
  router.post("/auth/login", checkPayload(loginSchema), login);
  router.get("/auth/me", authMiddleware, getMe);
>>>>>>> ac38c7d (reinit)

  return router;
};
