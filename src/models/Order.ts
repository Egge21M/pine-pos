export class Order {
  constructor(
    readonly id: number,
    readonly createdAt: number,
    readonly unit: string,
    readonly amount: number,
    readonly paymentId: string,
    private _status: "UNPAID" | "PAID" | "CANCELLED",
  ) {}

  get isPaid() {
    return this._status === "PAID";
  }

  setOrderPaid() {
    this._status = "PAID";
  }

  toJSON() {
    return {
      id: this.id,
      createdAt: this.createdAt,
      unit: this.unit,
      amount: this.amount,
      paymentId: this.paymentId,
      status: this._status,
    };
  }
}
