import { operations } from "../db/operations";
import { createOrder } from "../payments";
import { sendEmail } from "../sendgrid";
import { createEmailTemplate } from "../utils";
import type {
  CreateProductHandler,
<<<<<<< HEAD
  DemandProductHandler,
=======
  OrderProductHandler,
>>>>>>> ac38c7d (reinit)
  GetAllProductsHandler,
  GetProductHandler,
} from "./types";

export const getAllProducts: GetAllProductsHandler = async (_, res) => {
<<<<<<< HEAD
  const products = await operations.getAllProducts();
=======
  const products = await operations.products.getAllProducts();
>>>>>>> ac38c7d (reinit)
  return res.json({ products });
};

export const getProduct: GetProductHandler = async (req, res) => {
  const { id } = req.params;
  if (!id || isNaN(Number(id))) {
    return res.status(404);
  }

<<<<<<< HEAD
  const product = await operations.getProduct(parseInt(id));
=======
  const product = await operations.products.getProduct(parseInt(id));
>>>>>>> ac38c7d (reinit)

  if (!product) {
    return res.status(404).end();
  }

  return res.json({ product });
};

export const createProduct: CreateProductHandler = async (req, res) => {
<<<<<<< HEAD
  const product = await operations.createProduct(req.body);
=======
  const product = await operations.products.createProduct(req.body);
>>>>>>> ac38c7d (reinit)
  if (!product) {
    return res.status(400).end();
  }

  return res.json({ product });
};

<<<<<<< HEAD
export const demandProduct: DemandProductHandler = async (req, res) => {
  const result = await operations.addProductDemand(req.body);
=======
export const orderProduct: OrderProductHandler = async (req, res) => {
  const result = await operations.orders.createOrder(req.body);
>>>>>>> ac38c7d (reinit)
  if (!result) {
    return res.status(400).end();
  }

  if (result.hasReachedTarget) {
<<<<<<< HEAD
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
=======
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
>>>>>>> ac38c7d (reinit)
              orderId
            ),
          };
        })
      )
    );

<<<<<<< HEAD
    return res.json({ demand: result.demand });
  }
  if (!result.demand) {
    return res.status(400).send("Cannot create demand right now");
  }

  return res.json({ demand: result.demand });
=======
    return res.json({ order: result.order });
  }
  if (!result.order) {
    return res.status(400).send("Cannot create order right now");
  }

  return res.json({ order: result.order });
>>>>>>> ac38c7d (reinit)
};
