import { Proof } from "@cashu/cashu-ts";
import { DatabaseAdapter } from "../types";

export class ClaimStore {
  private static instance: ClaimStore;
  private db: DatabaseAdapter;

  constructor(db: DatabaseAdapter) {
    this.db = db;
  }

  static getInstance(db?: DatabaseAdapter) {
    if (ClaimStore.instance) {
      return ClaimStore.instance;
    }
    if (!db) {
      throw new Error(
        "Instance not created yet. Need to pass database adatper",
      );
    }
    ClaimStore.instance = new ClaimStore(db);
    return ClaimStore.instance;
  }

  async saveProofs(proofs: Proof[], paymentId: string) {
    const now = Math.floor(Date.now() / 1000);
    const placeholderString = createParameterizedValues(3, proofs.length);
    const valueString = proofs.map((p) => [now, p, paymentId]).flat();
    const res = await this.db.query(
      `INSERT INTO claims
      (created_at, proof, payment_id) VALUES 
      ${placeholderString};`,
      valueString,
    );
    if (res.rowCount === 0) {
      throw new Error("failed to save proofs");
    }
  }
}

function createParameterizedValues(
  placeholdersPerItem: number,
  amount: number,
) {
  const valueStrings: string[] = [];
  for (let i = 0; i < amount; i++) {
    const offset = i * placeholdersPerItem;
    const valueString = `(${Array(placeholdersPerItem)
      .fill(0)
      .map((_, j) => `$${offset + 1 + j}`)})`;
    valueStrings.push(valueString);
  }
  return valueStrings.join(", ");
}
