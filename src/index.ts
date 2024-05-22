import express from "express";
import { env } from "./env";
import { registerMiddlewares } from "./utils";

const app = express();
registerMiddlewares(app);

app.listen(env.PORT, () => {
  console.log(`Listening on port ${env.PORT}`);
});
