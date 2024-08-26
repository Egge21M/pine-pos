import { Pool } from "pg";
import app from "./server";
import { OrderStore } from "./store/orderStore";
import { PaymentStore } from "./store/PaymentStore";

const port = 8000;

class PostgresAdapter {
  pool: Pool;

  constructor() {
    this.pool = new Pool();
  }

  async query(query: string, args?: any[]) {
    return this.pool.query(query, args);
  }
}

async function test() {
  const order = await OrderStore.getInstance().createOrder(1, "sat");
  console.log("");
  console.log("Order created:");
  console.log(order);
  console.log("");
  console.log("=============");
  console.log("");
  const payment = await PaymentStore.getInstance().getPaymentById(
    order.paymentId,
  );
  console.log(payment);
}

const db = new PostgresAdapter();
OrderStore.getInstance(db);
PaymentStore.getInstance(db);

test();

app.listen(port, () => {
  console.log("Sever started on port: ", port);
});
