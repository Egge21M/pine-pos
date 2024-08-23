import app from "./server";

const port = 8000;

app.listen(port, () => {
  console.log("Sever started on port: ", port);
});
