import type { RequestHandler } from "express";
import type {
  InsertProductDemandSchema,
  InsertProductSchema,
  Product,
  ProductDemand,
} from "../db/zod";

export type GetProductHandler = RequestHandler<
  {
    id: string;
  },
  { product: Product }
>;

export type GetAllProductsHandler = RequestHandler<
  unknown,
  { products: Product[] }
>;

export type CreateProductHandler = RequestHandler<
  unknown,
  { product: Product },
  InsertProductSchema
>;

export type DemandProductHandler = RequestHandler<
  unknown,
  { demand: ProductDemand } | string,
  InsertProductDemandSchema
>;
