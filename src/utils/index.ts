import type { Application } from "express";
import { json } from "express";
import cors from "cors";
import { registerRoutes } from "../routes";

export const registerMiddlewares = (app: Application) => {
  app.use(
    cors({
      origin: "*",
    })
  );
  app.use(json());

  app.use("/api", registerRoutes(app));
};

export const createEmailTemplate = (productName: string) =>
  `<p>${productName} is now available to purchase. Click the link below to purchase now!</p><a href="https://google.com">http://localhost:3000</a>`;
