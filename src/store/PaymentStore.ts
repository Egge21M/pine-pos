import { PaymentRequest } from "../models/PaymentRequest";

export class PaymentStore {
  private payments: {
    [prId: number]: Payment;
  } = {};
  private idPointer: number = 0;
  private static instance: PaymentStore;

  getPaymentById(id: number) {
    if (this.payments[id]) {
      return this.payments[id];
    }
    throw new Error("not found");
  }

  savePayment(pr: PaymentRequest) {
    const payment = new Payment(this.idPointer, pr);
    this.payments[this.idPointer] = payment;
    this.idPointer++;
    return payment;
  }
  static getInstance() {
    if (PaymentStore.instance) {
      return PaymentStore.instance;
    }
    PaymentStore.instance = new PaymentStore();
    return PaymentStore.instance;
  }
}

class Payment {
  constructor(
    public id: number,
    public request: PaymentRequest,
  ) {}
}
