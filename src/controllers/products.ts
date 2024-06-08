import { operations } from '../db/operations';
import { getPresignedUrl } from '../s3';

import type {
  CreateProductHandler,
  GetAllProductsHandler,
  GetImageUploadUrl,
  GetProductHandler,
} from './types';

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

export const getImageUploadUrls: GetImageUploadUrl = async (req, res) => {
  const urls = [];
  for (const file of req.body.fileTypes) {
    const { url, key } = await getPresignedUrl(file.split('/')[1] || 'jpg');
    urls.push({ url, key });
  }

  return res.json({
    urls,
  });
};
