import { relations, sql } from "drizzle-orm";
import {
  pgTable,
  serial,
  text,
  varchar,
  integer,
  timestamp,
} from "drizzle-orm/pg-core";

export const products = pgTable("products", {
  id: serial("id").primaryKey().notNull(),
  images: varchar("images")
    .array()
    .notNull()
    .default(sql`'{}'::text[]`),
  name: varchar("name", { length: 256 }).notNull(),
  modelNumber: varchar("modeNumber", { length: 256 }).notNull(),
  description: text("description").notNull(),
  marketPrice: integer("marketPrice").notNull(),
  sellingPrice: integer("sellingPrice").notNull(),
  targetOrders: integer("targetOrders").notNull(),
  currentDemand: integer("currentDemand").default(0).notNull(),

  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt")
    .notNull()
    .defaultNow()
    .$onUpdateFn(() => new Date()),
});

export const productsRelation = relations(products, ({ many }) => ({
  demands: many(demands),
}));

export const demands = pgTable("demand", {
  id: serial("id").notNull().primaryKey(),
  productId: integer("productId")
    .notNull()
    .references(() => products.id),

  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).unique().notNull(),
  address: text("address").notNull(),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
});

export const demandsRelations = relations(demands, ({ one }) => ({
  product: one(products, {
    fields: [demands.productId],
    references: [products.id],
  }),
}));
