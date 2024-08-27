import { initDataStore } from "./database";
import app from "./server";

const port = process.env.PORT || 8000;

initDataStore();

app.listen(port, () => {
  console.log("Sever started on port: ", port);
});
