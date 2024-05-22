import { Router, type Application, type RequestHandler } from "express";
import {
  createProduct,
  demandProduct,
  getAllProducts,
  getProduct,
} from "../controllers/products";
import type { z } from "zod";
import { insertDemandSchema, insertProductSchema } from "../db/zod";
import { ApiError } from "../utils/errors";

const checkPayload = (schema: z.ZodSchema): RequestHandler => {
  return (req, res, next) => {
    const data = schema.safeParse(req.body);
    if (!data.success) {
      return next(new ApiError(400, data.error.flatten()));
    }

    next();
  };
};

export const registerRoutes = (app: Application) => {
  const router = Router();

  router.get("/products", getAllProducts);
  router.get("/products/:id", getProduct);
  router.post("/products", checkPayload(insertProductSchema), createProduct);
  router.post(
    "/products/demand",
    checkPayload(insertDemandSchema),
    demandProduct
  );

  return router;
};
