import { operations } from "../db/operations";

import type {
  CreateProductHandler,
  GetAllProductsHandler,
  GetProductHandler,
} from "./types";

export const getAllProducts: GetAllProductsHandler = async (_, res) => {
  const products = await operations.products.getAllProducts();
  return res.json({ products });
};

export const getProduct: GetProductHandler = async (req, res) => {
  const { id } = req.params;
  if (!id || isNaN(Number(id))) {
    return res.status(404);
  }

  const product = await operations.products.getProduct(parseInt(id));

  if (!product) {
    return res.status(404).end();
  }

  return res.json({ product });
};

export const createProduct: CreateProductHandler = async (req, res) => {
  const product = await operations.products.createProduct(req.body);
  if (!product) {
    return res.status(400).end();
  }

  return res.json({ product });
};
