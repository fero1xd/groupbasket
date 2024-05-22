import { Router, type Application } from "express";
import {
  createProduct,
  demandProduct,
  getAllProducts,
  getProduct,
} from "../controllers/products";

export const registerRoutes = (app: Application) => {
  const router = Router();

  router.get("/products", getAllProducts);
  router.get("/products/:id", getProduct);
  router.post("/products", createProduct);
  router.post("/products/demand", demandProduct);

  return router;
};
