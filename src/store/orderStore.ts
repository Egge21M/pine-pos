import { Order } from "../models/Order";
import { DatabaseAdapter } from "../types";
import { PaymentStore } from "./PaymentStore";

export class OrderStore {
  private static instance: OrderStore;
  private db: DatabaseAdapter;

  constructor(db: DatabaseAdapter) {
    this.db = db;
  }

  static getInstance(db?: DatabaseAdapter) {
    if (OrderStore.instance) {
      return OrderStore.instance;
    }
    if (!db) {
      throw new Error(
        "Instance not created yet. Need to pass database adatper",
      );
    }
    OrderStore.instance = new OrderStore(db);
    return OrderStore.instance;
  }

  async getOrderById(id: string) {
    const res = await this.db.query("SELECT * FROM orders WHERE id = ?", [id]);
    if (res.rows.length < 1) {
      return undefined;
    }
    return res[0];
  }

  async getOrderByPaymentId(id: string) {
    const res = await this.db.query(
      "SELECT * FROM orders WHERE payment_id = ?",
      [id],
    );
    if (res.rows.length < 1) {
      return undefined;
    }
    return res.rows[0];
  }

  async getPaginatedOrders(page: number = 1) {
    if (page < 1) {
      throw new Error("invalid page");
    }
    const offset = 25 * (page - 1);
    const res = await this.db.query(`
    SELECT * FROM orders ORDER BY id LIMIT 25 OFFSET ${offset};
    `);
    return res.rows;
  }
  async createOrder(amount: number, unit: string) {
    const payment = await PaymentStore.getInstance().createPayment(
      unit,
      amount,
    );
    const res = await this.db.query(
      `INSERT into orders (created_at, unit, amount, payment_id, status) VALUES ($1, $2, $3, $4, $5) RETURNING id`,
      [Math.floor(Date.now() / 1000), unit, amount, payment.memo, "UNPAID"],
    );
    console.log(res);
    const order = new Order(
      res.rows[0].id,
      Math.floor(Date.now() / 1000),
      unit,
      amount,
      payment.memo,
      "UNPAID",
    );
    return order;
  }
}
