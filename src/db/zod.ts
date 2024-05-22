import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { demands, products } from "./schema";
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

export const insertDemandSchema = createInsertSchema(demands)
  .omit({
    id: true,
    createdAt: true,
  })
  .strict();
export const selectDemandSchema = createSelectSchema(demands).strict();

export type InsertProductSchema = z.infer<typeof insertProductSchema>;
export type Product = z.infer<typeof selectProductSchema>;
export type InsertProductDemandSchema = z.infer<typeof insertDemandSchema>;
export type ProductDemand = z.infer<typeof selectDemandSchema>;
