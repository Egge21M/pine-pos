import { randomBytes } from "crypto";
import { PaymentRequest } from "../models/PaymentRequest";
import { DatabaseAdapter } from "../types";

export class PaymentStore {
  private static instance: PaymentStore;
  private db: DatabaseAdapter;

  constructor(db: DatabaseAdapter) {
    this.db = db;
  }

  async getPaymentById(id: string) {
    const res = await this.db.query(
      "SELECT * FROM payment_requests WHERE memo = $1;",
      [id],
    );
    if (res.rows.length < 1) {
      throw new Error("not found");
    }
    return new PaymentRequest(
      res.rows[0].unit,
      res.rows[0].transport,
      res.rows[0].memo,
      res.rows[0].amount,
      res.rows[0].mint,
      res.rows[0].description,
      res.rows[0].lock,
    );
  }

  async createPayment(unit: string, amount: number) {
    const id = randomBytes(16).toString("hex");
    const pr = new PaymentRequest(
      unit,
      [{ type: "post", target: `http://localhost:8000/api/v1/pay/${id}` }],
      id,
      amount,
      "https://mint.minibits.cash/Bitcoin",
      "Test Description",
      undefined,
    );
    const res = await this.db.query(
      `INSERT INTO payment_requests (memo, unit, transport, amount, mint, description, lock) VALUES ($1, $2, $3, $4, $5, $6, $7);`,
      [
        pr.memo,
        pr.unit,
        JSON.stringify(pr.transport),
        pr.amount,
        pr.mint,
        pr.description,
        pr.lock,
      ],
    );
    if (res.rowCount === 0) {
      throw new Error("Failed to insert payment");
    }
    return pr;
  }
  static getInstance(db?: DatabaseAdapter) {
    if (PaymentStore.instance) {
      return PaymentStore.instance;
    }
    if (!db) {
      throw new Error(
        "Instance not created yet. Need to pass database adatper",
      );
    }
    PaymentStore.instance = new PaymentStore(db);
    return PaymentStore.instance;
  }
}
