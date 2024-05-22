import { operations } from "../db/operations";
import { createOrder } from "../payments";
import { sendEmail } from "../sendgrid";
import { createEmailTemplate } from "../utils";
import type {
  CreateProductHandler,
  DemandProductHandler,
  GetAllProductsHandler,
  GetProductHandler,
} from "./types";

export const getAllProducts: GetAllProductsHandler = async (_, res) => {
  const products = await operations.getAllProducts();
  return res.json({ products });
};

export const getProduct: GetProductHandler = async (req, res) => {
  const { id } = req.params;
  if (!id || isNaN(Number(id))) {
    return res.status(404);
  }

  const product = await operations.getProduct(parseInt(id));

  if (!product) {
    return res.status(404).end();
  }

  return res.json({ product });
};

export const createProduct: CreateProductHandler = async (req, res) => {
  const product = await operations.createProduct(req.body);
  if (!product) {
    return res.status(400).end();
  }

  return res.json({ product });
};

export const demandProduct: DemandProductHandler = async (req, res) => {
  const result = await operations.addProductDemand(req.body);
  if (!result) {
    return res.status(400).end();
  }

  if (result.hasReachedTarget) {
    if (!result.demand) {
      return res.status(400).send("Product target already reached");
    }
    const users = await operations.getProductDemands(req.body.productId);

    sendEmail(
      await Promise.all(
        users.map(async (user) => {
          const orderId = await createOrder(
            result.product.sellingPrice,
            user.address
          );

          return {
            to: user.email,
            subject: "Your deal is now available",
            html: createEmailTemplate(
              result.product.name,
              user.address,
              orderId
            ),
          };
        })
      )
    );

    return res.json({ demand: result.demand });
  }
  if (!result.demand) {
    return res.status(400).send("Cannot create demand right now");
  }

  return res.json({ demand: result.demand });
};
