import Razorpay from "razorpay";
import { env } from "../env";

const instance = new Razorpay({
  key_id: env.RAZORPAY_KEY,
  key_secret: env.RAZORPAY_SECRET,
});

export const createOrder = async (orderId: string, amount: number) => {
  const order = await instance.orders.create({
    amount,
    currency: "INR",
    receipt: "receipt#1",
    partial_payment: false,
    notes: {
      orderId,
    },
  });

  return order.id;
};
