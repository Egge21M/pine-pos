import { Request, Response } from "express";
import { OrderStore } from "../store/orderStore";

export async function createOrderHandler(req: Request, res: Response) {
  const { amount, unit } = req.body;
  if (!amount || !unit) {
    res.status(401).json({ error: true, message: "Bad request" });
  }
  const newOrder = OrderStore.getInstance().createOrder(amount, unit);
  res.status(201).json({ error: false, data: newOrder });
}
