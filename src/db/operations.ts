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
};
