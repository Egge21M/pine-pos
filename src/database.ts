import { Pool } from "pg";
import { OrderStore } from "./store/OrderStore";
import { PaymentStore } from "./store/PaymentStore";
import { ClaimStore } from "./store/ClaimStore";

class PostgresAdapter {
  pool: Pool;

  constructor() {
    this.pool = new Pool();
  }

  async query(query: string, args?: any[]) {
    return this.pool.query(query, args);
  }
}

export function initDataStore() {
  const db = new PostgresAdapter();
  OrderStore.getInstance(db);
  PaymentStore.getInstance(db);
  ClaimStore.getInstance(db);
}
