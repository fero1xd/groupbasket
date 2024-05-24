import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { orders, products, users } from "./schema";
import { z } from "zod";

export const insertProductSchema = createInsertSchema(products, {
  images: z.string().array(),
})
  .omit({
    id: true,
    createdAt: true,
    updatedAt: true,
    currentDemand: true,
  })
  .strict();

export const selectProductSchema = createSelectSchema(products, {
  images: z.string().array(),
}).strict();

export const insertOrderSchema = createInsertSchema(orders)
  .omit({
    createdAt: true,
    isPaid: true,
  })
  .strict();
export const selectOrderSchema = createSelectSchema(orders).strict();

export const registerSchema = createInsertSchema(users, {
  password: z.string().min(6, "password must be atleast 6 characters long"),
})
  .omit({
    id: true,
    createdAt: true,
    updatedAt: true,
    isAdmin: true,
    isAffiliate: true,
  })
  .strict();

export const loginSchema = registerSchema.omit({
  name: true,
});

export type InsertProductSchema = z.infer<typeof insertProductSchema>;
export type InsertOrderSchema = z.infer<typeof insertOrderSchema>;
export type InsertUserSchema = z.infer<typeof registerSchema>;
export type LoginSchema = z.infer<typeof loginSchema>;

export type Product = z.infer<typeof selectProductSchema>;
export type Order = z.infer<typeof selectOrderSchema>;
export type RawUser = typeof users.$inferSelect;
