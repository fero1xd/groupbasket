import { operations } from "../db/operations";
import { createOrder } from "../payments";
import { sendEmail } from "../sendgrid";
import { createEmailTemplate } from "../utils";
import type {
  CreateProductHandler,
  OrderProductHandler,
  GetAllProductsHandler,
  GetProductHandler,
} from "./types";

export const getAllProducts: GetAllProductsHandler = async (_, res) => {
  const products = await operations.products.getAllProducts();
  return res.json({ products });
};

export const getProduct: GetProductHandler = async (req, res) => {
  const { id } = req.params;
  if (!id || isNaN(Number(id))) {
    return res.status(404);
  }

  const product = await operations.products.getProduct(parseInt(id));

  if (!product) {
    return res.status(404).end();
  }

  return res.json({ product });
};

export const createProduct: CreateProductHandler = async (req, res) => {
  const product = await operations.products.createProduct(req.body);
  if (!product) {
    return res.status(400).end();
  }

  return res.json({ product });
};

export const orderProduct: OrderProductHandler = async (req, res) => {
  const result = await operations.orders.createOrder(req.body);
  if (!result) {
    return res.status(400).end();
  }

  if (result.hasReachedTarget) {
    if (!result.order) {
      return res.status(400).send("Product target already reached");
    }
    const orders = await operations.orders.getProductOrders(req.body.productId);

    sendEmail(
      await Promise.all(
        orders.map(async (order) => {
          const orderId = await createOrder(
            result.product.sellingPrice,
            order.address
          );

          return {
            to: order.user.email,
            subject: "Your deal is now available",
            html: createEmailTemplate(
              result.product.name,
              order.address,
              orderId
            ),
          };
        })
      )
    );

    return res.json({ order: result.order });
  }
  if (!result.order) {
    return res.status(400).send("Cannot create order right now");
  }

  return res.json({ order: result.order });
};
