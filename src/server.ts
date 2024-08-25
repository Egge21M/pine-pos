import Express from "express";
import bodyParser from "body-parser";
import { apiRouter } from "./router";

const app = Express();

app.use(bodyParser.json());
app.use("/api/v1", apiRouter);

export default app;
