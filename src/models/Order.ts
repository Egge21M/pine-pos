export class Order {
  constructor(
    readonly id: number,
    readonly createdAt: number,
    readonly unit: string,
    readonly amount: number,
    readonly paymentId: string,
    private _isPaid: boolean,
  ) {}

  get isPaid() {
    return this._isPaid;
  }

  setOrderPaid() {
    this._isPaid = true;
  }
}
