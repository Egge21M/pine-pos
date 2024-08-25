export class Order {
  constructor(
    readonly id: number,
    readonly createdAt: number,
    readonly unit: string,
    readonly amount: number,
    readonly paymentId: number,
    private _isPaid: boolean,
  ) {}

  get isPaid() {
    return this._isPaid;
  }

  setOrderPaid() {
    this._isPaid = true;
  }

  toJSON() {
    return {
      id: this.id,
      createdAt: this.createdAt,
      unit: this.unit,
      amount: this.amount,
      paymentId: this.paymentId,
      isPaid: this._isPaid,
    };
  }
}
