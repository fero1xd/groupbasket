import { eq, getTableColumns } from "drizzle-orm";
import { db } from ".";
import { affiliateLinks, orders, products, users } from "./schema";
import type {
  InsertAffiliateLinkSchema,
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
    create: async (data: InsertOrderSchema & { userId: string }) => {
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

    getAllForUser: (userId: string) =>
      db.query.orders.findMany({
        where: eq(orders.userId, userId),
      }),

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
          id: true,
        },
      }),

    setOrderStatus: async (orderId: string, isPaid: boolean) =>
      (
        await db
          .update(orders)
          .set({ isPaid })
          .where(eq(orders.id, orderId))
          .returning()
      )[0],
  },

  auth: {
    createUser: async (data: InsertUserSchema) =>
      (await db.insert(users).values(data).returning())[0],

    getUser: (email: string) =>
      db.query.users.findFirst({ where: eq(users.email, email) }),
  },
  affiliate: {
    create: async (data: InsertAffiliateLinkSchema) =>
      (await db.insert(affiliateLinks).values(data).returning())[0],

    getAllForUser: (userId: string) =>
      db.query.affiliateLinks.findMany({
        where: eq(affiliateLinks.userId, userId),
        with: {
          product: true,
        },
      }),

    getAffiliate: (afId: string) =>
      db.query.affiliateLinks.findFirst({ where: eq(affiliateLinks.id, afId) }),

    getAffiliateOrders: async (affiliateId: string) => {
      const { password: _, ...rest } = getTableColumns(users);
      const { address, productId, userId, isPaid, ...restO } =
        getTableColumns(orders);

      return await db
        .select({ user: rest, ...restO, product: products })
        .from(orders)
        .where(eq(orders.affiliateLinkId, affiliateId))
        .leftJoin(products, eq(products.id, orders.productId))
        .leftJoin(users, eq(users.id, orders.userId));
    },
  },
};
