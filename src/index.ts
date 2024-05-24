import express from "express";
import { env } from "./env";
import { registerMiddlewares } from "./utils";
<<<<<<< HEAD
=======
import type { Session, User } from "lucia";
>>>>>>> ac38c7d (reinit)

const app = express();
registerMiddlewares(app);

app.listen(env.PORT, () => {
  console.log(`Listening on port ${env.PORT}`);
});
<<<<<<< HEAD
=======

declare global {
  namespace Express {
    interface Locals {
      user: User | null;
      session: Session | null;
    }
  }
}
>>>>>>> ac38c7d (reinit)
