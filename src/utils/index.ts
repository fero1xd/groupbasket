import type { Application } from "express";
import { json } from "express";
import cors from "cors";
import { registerRoutes } from "../routes";
import { createHmac } from "crypto";
import type { Orders } from "razorpay/dist/types/orders";
import { globalErrorHandler } from "./errors";
import { operations } from "../db/operations";

export const registerMiddlewares = (app: Application) => {
  app.use(
    cors({
      origin: "*",
    })
  );
  app.use(json());

  app.post("/", (req, res) => {
    const secret = "abcdefgh";
    const shasum = createHmac("sha256", secret);
    shasum.update(JSON.stringify(req.body));
    const digest = shasum.digest("hex");

    if (digest !== req.headers["x-razorpay-signature"]) {
      return res.status(400).end();
    }

    const order = req.body.payload.order as Orders.RazorpayOrder;
    // TODO: Handle this better

    operations.orders.setOrderStatus(order.notes!.orderId as string, true);
  });
  app.use("/api", registerRoutes());

  app.use(globalErrorHandler);
};

export const createEmailTemplate = (
  productName: string,
  address: string,
  orderId: string
) =>
  `
<p>${productName} is now available to purchase. Click the link below to purchase now!</p>
<form method="POST" action="https://api.razorpay.com/v1/checkout/embedded">
<input type="hidden" name="key_id" value="rzp_test_EsjpOBrZUtDnj8" />
<input type="hidden" name="amount" value="50000" />
<input type="hidden" name="order_id" value="${orderId}" />
<input type="hidden" name="name" value="Group Basket" />
<input type="hidden" name="description" value="A Wild Sheep Chase" />
<input
  type="hidden"
  name="image"
  value="https://www.groupbasket.in/assets/logo.svg"
/>
<input
  type="hidden"
  name="notes[shipping address]"
  value="${address}"
/>
<input
  type="hidden"
  name="callback_url"
  value="https://example.com/payment-callback"
/>
<input
  type="hidden"
  name="cancel_url"
  value="https://example.com/payment-cancel"
/>
<button 
style="
padding: 10px 24px;
background-color: #1565c0;
color: white;
border-radius: 4px;
border: none;
outline: none;
cursor: pointer;
"
>Pay Now</button>
</form>
`;
