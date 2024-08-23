import { Order } from "../models/Order";
import { PaymentRequest } from "../models/PaymentRequest";
import { PaymentStore } from "./PaymentStore";

export class OrderStore {
  private orders: {
    [oderKey: number]: Order;
  } = {};
  private paymentIdIndex: {
    [paymentId: number]: number;
  } = {};
  private keyPointer: number = 0;
  private static instance: OrderStore;

  static getInstance() {
    if (OrderStore.instance) {
      return OrderStore.instance;
    }
    OrderStore.instance = new OrderStore();
    return OrderStore.instance;
  }

  getOrderById(id: number) {
    if (this.orders[id]) {
      return this.orders[id];
    }
    throw new Error("not found");
  }

  getOrderByPaymentId(id: number) {
    if (this.orders[this.paymentIdIndex[id]]) {
      return this.orders[this.paymentIdIndex[id]];
    }
    throw new Error("not found");
  }

  getAllOrders() {
    return Object.keys(this.orders).map((id) => this.orders[id]);
  }

  createOrder(amount: number, unit: string) {
    const pr = new PaymentRequest(
      unit,
      [{ type: "post", target: "http://localhost:8000/api/v1/pay" }],
      amount,
      "https://mint.minibits.cash/Bitcoin",
      "Test Description",
      "123",
      undefined,
    );
    const payment = PaymentStore.getInstance().savePayment(pr);
    const order = new Order(
      this.keyPointer,
      Math.floor(Date.now() / 1000),
      unit,
      amount,
      payment.id,
    );
    this.paymentIdIndex[payment.id] = this.keyPointer;
    this.orders[this.keyPointer] = order;
    this.keyPointer++;
    return order;
  }
}
