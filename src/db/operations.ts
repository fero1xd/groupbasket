<<<<<<< HEAD
import { count, eq, sql } from "drizzle-orm";
import { db } from ".";
import { demands, products } from "./schema";
import type { InsertProductDemandSchema, InsertProductSchema } from "./zod";

export const operations = {
  getAllProducts: () => db.query.products.findMany(),

  getProduct: (id: number) =>
    db.query.products.findFirst({ where: eq(products.id, id) }),

  createProduct: async (data: InsertProductSchema) =>
    (await db.insert(products).values(data).returning())[0],

  addProductDemand: async (data: InsertProductDemandSchema) => {
    const product = await operations.getProduct(data.productId);
    if (!product) {
      return;
    }

    if (product.currentDemand >= product.targetOrders) {
      return { demand: null, hasReachedTarget: true, product };
    }
    const demand = (await db.insert(demands).values(data).returning())[0];

    await db.update(products).set({
      currentDemand: product.currentDemand + 1,
    });

    return {
      demand,
      hasReachedTarget: product.currentDemand + 1 >= product.targetOrders,
      product,
    };
  },

  getProductDemands: (productId: number) =>
    db.query.demands.findMany({
      where: eq(demands.productId, productId),
      columns: {
        email: true,
        address: true,
      },
    }),
=======
import { eq } from "drizzle-orm";
import { db } from ".";
import { orders, products, users } from "./schema";
import type {
  InsertOrderSchema,
  InsertProductSchema,
  InsertUserSchema,
} from "./zod";

export const operations = {
  products: {
    getAllProducts: () => db.query.products.findMany(),

    getProduct: (id: number) =>
      db.query.products.findFirst({ where: eq(products.id, id) }),

    createProduct: async (data: InsertProductSchema) =>
      (await db.insert(products).values(data).returning())[0],
  },
  orders: {
    createOrder: async (data: InsertOrderSchema) => {
      const product = await operations.products.getProduct(data.productId);
      if (!product) {
        return;
      }

      if (product.currentDemand >= product.targetOrders) {
        return { order: null, hasReachedTarget: true, product };
      }
      const order = (await db.insert(orders).values(data).returning())[0];

      await db.update(products).set({
        currentDemand: product.currentDemand + 1,
      });

      return {
        order,
        hasReachedTarget: product.currentDemand + 1 >= product.targetOrders,
        product,
      };
    },

    getProductOrders: (productId: number) =>
      db.query.orders.findMany({
        where: eq(orders.productId, productId),
        with: {
          user: {
            columns: {
              email: true,
            },
          },
        },
        columns: {
          address: true,
        },
      }),
  },

  auth: {
    createUser: async (data: InsertUserSchema) =>
      (await db.insert(users).values(data).returning())[0],

    getUser: (email: string) =>
      db.query.users.findFirst({ where: eq(users.email, email) }),
  },
>>>>>>> ac38c7d (reinit)
};
