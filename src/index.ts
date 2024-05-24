import express from "express";
import { env } from "./env";
import { registerMiddlewares } from "./utils";
import type { Session, User } from "lucia";

const app = express();
registerMiddlewares(app);

app.listen(env.PORT, () => {
  console.log(`Listening on port ${env.PORT}`);
});

declare global {
  namespace Express {
    interface Locals {
      user: User | null;
      session: Session | null;
    }
  }
}
