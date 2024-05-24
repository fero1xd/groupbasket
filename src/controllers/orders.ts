import { operations } from "../db/operations";
import { createOrder } from "../payments";
import { sendEmail } from "../sendgrid";
import { createEmailTemplate } from "../utils";
import { ApiError } from "../utils/errors";
import type { GetMyOrdersHandler, OrderProductHandler } from "./types";

export const orderProduct: OrderProductHandler = async (req, res, next) => {
  let result;

  if (req.body.affiliateLinkId) {
    const aff = await operations.affiliate.getAffiliate(
      req.body.affiliateLinkId
    );
    if (!aff) {
      return next(new ApiError(404, "couldnt find affiliate"));
    }
    result = await operations.orders.create({
      ...req.body,
      userId: res.locals.user!.id,
    });
  } else {
    result = await operations.orders.create({
      address: req.body.address,
      productId: req.body.productId,
      userId: res.locals.user!.id,
    });
  }

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
            order.id,
            result.product.sellingPrice
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

export const getMyOrders: GetMyOrdersHandler = async (_req, res) => {
  const orders = await operations.orders.getAllForUser(res.locals.user!.id);

  return res.json({ orders });
};
