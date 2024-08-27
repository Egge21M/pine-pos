import Express from "express";
import bodyParser from "body-parser";
import { apiRouter } from "./router";
import cors from "cors";

const app = Express();

app.use(bodyParser.json());
app.use(cors());

app.use("/api/v1", apiRouter);

export default app;
