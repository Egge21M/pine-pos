import { Router } from "express";
import { paymentHandler } from "./controller/paymentHandler";
import {
  createOrderHandler,
  getOrderDetailsHandler,
  getPaginatedOrders,
} from "./controller/orderHandler";

export const apiRouter = Router();

apiRouter.post("/pay/:id", paymentHandler);

apiRouter.get("/order", getOrderDetailsHandler);
apiRouter.get("/orders", getPaginatedOrders);
apiRouter.post("/order", createOrderHandler);
