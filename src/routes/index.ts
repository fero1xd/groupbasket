import { Router, type RequestHandler } from "express";
import {
  createProduct,
  getAllProducts,
  getProduct,
} from "../controllers/products";
import type { z } from "zod";
import {
  createAffiliateLinkSchema,
  insertOrderSchema,
  insertProductSchema,
  loginSchema,
  registerSchema,
} from "../db/zod";
import { ApiError } from "../utils/errors";
import { getMe, login, registerUser } from "../controllers/auth";
import {
  assureAdmin,
  assureAffiliate,
  authMiddleware,
} from "../auth/middleware";
import {
  createAffiliateLink,
  getAffiliateOrders,
  getMyAffiliateLinks,
} from "../controllers/affiliate";
import { getMyOrders, orderProduct } from "../controllers/orders";

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
    // (req, res, next) => {
    //   if (typeof req.body.isAffiliate === "boolean") {
    //     return authMiddleware(req, res, next);
    //   }
    //   return next();
    // },
    // (req, res, next) => {
    //   if (typeof req.body.isAffiliate === "boolean") {
    //     return assureAdmin(req, res, next);
    //   }

    //   return next();
    // },
    registerUser,
  );
  router.post("/auth/login", checkPayload(loginSchema), login);

  router.get("/products", getAllProducts);
  router.get("/products/:id", getProduct);

  // Protected routes
  router.use(authMiddleware);

  router.post(
    "/products",
    assureAdmin,
    checkPayload(insertProductSchema),
    createProduct,
  );
  router.get("/auth/me", getMe);

  // Orders Route
  router.post("/orders", checkPayload(insertOrderSchema), orderProduct);
  router.get("/orders/my", getMyOrders);

  // Affiliate routes
  router.use(assureAffiliate);

  router.post(
    "/affiliates",
    checkPayload(createAffiliateLinkSchema),
    createAffiliateLink,
  );
  router.get("/affiliates/my", getMyAffiliateLinks);
  router.get("/affiliates/orders/:id", getAffiliateOrders);

  return router;
};
