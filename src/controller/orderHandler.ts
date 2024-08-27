import { Request, Response } from "express";
import { OrderStore } from "../store/OrderStore";

export async function createOrderHandler(req: Request, res: Response) {
  const { amount, unit } = req.body;
  if (!amount || !unit) {
    res.status(400).json({ error: true, message: "bad request" });
  }
  try {
    const newOrder = OrderStore.getInstance().createOrder(amount, unit);
    res.status(201).json({ error: false, data: newOrder });
  } catch (e) {
    console.log(e);
    return res
      .status(500)
      .json({ error: true, message: "something went wrong" });
  }
}

export async function getOrderDetailsHandler(
  req: Request<unknown, unknown, unknown, { id: string }>,
  res: Response,
) {
  const { id } = req.query;
  if (!id) {
    return res.status(400).json({ error: true, message: "invalid parameters" });
  }
  try {
    const details = await OrderStore.getInstance().getOrderDetailsById(id);
    if (!details) {
      return res.status(404).json({ error: true, message: "not found" });
    }
    return res.status(200).json({ error: false, data: details });
  } catch (e) {
    console.log(e);
    return res
      .status(500)
      .json({ error: true, message: "something went wrong" });
  }
}

export async function getPaginatedOrders(req: Request, res: Response) {
  const { page = "1" } = req.query as { page: string };
  const parsedPage = parseInt(page);

  if (isNaN(parsedPage) || parsedPage < 1) {
    return res.status(400).json({ error: true, message: "invalid parameters" });
  }

  const allOrder =
    await OrderStore.getInstance().getPaginatedOrders(parsedPage);
  return res.status(200).json({ error: false, data: allOrder });
}
