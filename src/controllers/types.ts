import type { RequestHandler } from "express";
import type {
  InsertOrderSchema,
  InsertProductSchema,
  Product,
  Order,
  InsertUserSchema,
  LoginSchema,
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

export type OrderProductHandler = RequestHandler<
  unknown,
  { order: Order } | string,
  InsertOrderSchema
>;

export type RegisterUserHandler = RequestHandler<
  unknown,
  string,
  InsertUserSchema
>;

export type LoginHandler = RequestHandler<unknown, string, LoginSchema>;

export type CreateAffiliateHandler = RequestHandler<
  unknown,
  string,
  InsertUserSchema
>;
