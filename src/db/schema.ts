<<<<<<< HEAD
=======
import { createId } from "@paralleldrive/cuid2";
>>>>>>> ac38c7d (reinit)
import { relations, sql } from "drizzle-orm";
import {
  pgTable,
  serial,
  text,
  varchar,
  integer,
  timestamp,
<<<<<<< HEAD
} from "drizzle-orm/pg-core";

=======
  boolean,
  primaryKey,
} from "drizzle-orm/pg-core";

function timestamps() {
  return {
    createdAt: timestamp("createdAt").notNull().defaultNow(),
    updatedAt: timestamp("updatedAt")
      .notNull()
      .defaultNow()
      .$onUpdateFn(() => new Date()),
  };
}

>>>>>>> ac38c7d (reinit)
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

<<<<<<< HEAD
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
=======
  ...timestamps(),
});

export const productsRelation = relations(products, ({ many }) => ({
  orders: many(orders),
}));

export const orders = pgTable(
  "orders",
  {
    productId: integer("productId")
      .notNull()
      .references(() => products.id),
    userId: text("userId")
      .notNull()
      .references(() => users.id),
    address: text("address").notNull(),
    isPaid: boolean("isPaid").default(false).notNull(),
    createdAt: timestamp("createdAt").notNull().defaultNow(),
  },
  (t) => ({ pk: primaryKey({ columns: [t.productId, t.userId] }) })
);

export const ordersRelations = relations(orders, ({ one }) => ({
  product: one(products, {
    fields: [orders.productId],
    references: [products.id],
  }),
  user: one(users, {
    fields: [orders.userId],
    references: [users.id],
  }),
}));

export const users = pgTable("users", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId())
    .notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).unique().notNull(),
  password: text("password").notNull(),
  isAdmin: boolean("isAdmin").default(false).notNull(),
  isAffiliate: boolean("isAffiliate").default(false).notNull(),
  ...timestamps(),
});

export const usersRelations = relations(users, ({ many }) => ({
  orders: many(orders),
}));

export const sessions = pgTable("sessions", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id),
  expiresAt: timestamp("expires_at", {
    withTimezone: true,
    mode: "date",
  }).notNull(),
});
>>>>>>> ac38c7d (reinit)
