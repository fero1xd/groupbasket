import type { RequestHandler } from "express";
import type {
  InsertOrderSchema,
  InsertProductSchema,
  Product,
  Order,
  InsertUserSchema,
  LoginSchema,
  AffiliateLink,
  InsertAffiliateLinkSchema,
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

export type GetMyOrdersHandler = RequestHandler<unknown, { orders: Order[] }>;

export type RegisterUserHandler = RequestHandler<
  unknown,
  string,
  InsertUserSchema
>;

export type LoginHandler = RequestHandler<unknown, string, LoginSchema>;

export type CreateAffiliateLink = RequestHandler<
  unknown,
  { link: AffiliateLink },
  InsertAffiliateLinkSchema
>;

export type GetAffilateLinks = RequestHandler<
  unknown,
  { links: AffiliateLink[] }
>;

export type GetAffiliateOrders = RequestHandler<
  {
    id: string;
  },
  { orders: Order[] }
>;
