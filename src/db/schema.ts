import { createId } from "@paralleldrive/cuid2";
import { relations, sql } from "drizzle-orm";
import {
  pgTable,
  serial,
  text,
  varchar,
  integer,
  timestamp,
  boolean,
  unique,
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

  ...timestamps(),
});

export const productsRelation = relations(products, ({ many }) => ({
  orders: many(orders),
  affiliates: many(affiliateLinks),
}));

export const orders = pgTable(
  "orders",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => createId())
      .notNull(),
    productId: integer("productId")
      .notNull()
      .references(() => products.id),
    userId: text("userId")
      .notNull()
      .references(() => users.id),
    address: text("address").notNull(),
    affiliateLinkId: text("affiliateLinkId").references(
      () => affiliateLinks.id
    ),
    isPaid: boolean("isPaid").default(false).notNull(),
    createdAt: timestamp("createdAt").notNull().defaultNow(),
  },
  (t) => ({ uniq: unique().on(t.productId, t.userId) })
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
  affiliateLink: one(affiliateLinks, {
    fields: [orders.affiliateLinkId],
    references: [affiliateLinks.id],
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
  affiliates: many(affiliateLinks),
}));

export const affiliateLinks = pgTable(
  "links",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => createId())
      .notNull(),
    productId: integer("productId")
      .notNull()
      .references(() => products.id),
    userId: text("userId")
      .notNull()
      .references(() => users.id),
    expiresAt: timestamp("expiresAt").notNull(),
    ...timestamps(),
  },
  (self) => ({
    // There will be only 1 aff link for a product by a single user
    uniq: unique().on(self.productId, self.userId),
  })
);

export const affiliateLinksRelations = relations(
  affiliateLinks,
  ({ one, many }) => ({
    product: one(products, {
      fields: [affiliateLinks.productId],
      references: [products.id],
    }),
    user: one(users, {
      fields: [affiliateLinks.userId],
      references: [users.id],
    }),
    orders: many(orders),
  })
);

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
