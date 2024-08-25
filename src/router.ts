import { Router } from "express";
import { paymentHandler } from "./controller/paymentHandler";
import { createOrderHandler } from "./controller/orderHandler";

export const apiRouter = Router();

apiRouter.post("/pay", paymentHandler);

apiRouter.post("/order", createOrderHandler);
