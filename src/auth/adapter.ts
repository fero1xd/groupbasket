import { DrizzlePostgreSQLAdapter } from "@lucia-auth/adapter-drizzle";
import { db } from "../db";
import { sessions, users } from "../db/schema";
import { Lucia } from "lucia";
import type { RawUser } from "../db/zod";

export const adapter = new DrizzlePostgreSQLAdapter(db, sessions, users);

export const lucia = new Lucia(adapter, {
  sessionCookie: {
    attributes: {
      // set to `true` when using HTTPS
      secure: process.env.NODE_ENV === "production",
    },
  },
  getUserAttributes: ({ name, email, isAdmin, isAffiliate }) => {
    return {
      name,
      email,
      isAdmin,
      isAffiliate,
    };
  },
});

declare module "lucia" {
  interface Register {
    Lucia: typeof lucia;
    DatabaseUserAttributes: Omit<RawUser, "id">;
  }
}
