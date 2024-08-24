import Express from "express";
import { paymentHandler } from "./controller/paymentHandler";
import bodyParser from "body-parser";

const app = Express();

app.use(bodyParser.json());

app.post("/api/v1/pay", paymentHandler);

export default app;
