import type { RequestHandler } from "express";
import type {
<<<<<<< HEAD
  InsertProductDemandSchema,
  InsertProductSchema,
  Product,
  ProductDemand,
=======
  InsertOrderSchema,
  InsertProductSchema,
  Product,
  Order,
  InsertUserSchema,
  LoginSchema,
>>>>>>> ac38c7d (reinit)
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

<<<<<<< HEAD
export type DemandProductHandler = RequestHandler<
  unknown,
  { demand: ProductDemand } | string,
  InsertProductDemandSchema
>;
=======
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
>>>>>>> ac38c7d (reinit)
