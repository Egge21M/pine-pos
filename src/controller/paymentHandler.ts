import { CashuMint, CashuWallet, getDecodedToken } from "@cashu/cashu-ts";
import { Request, Response } from "express";
import { OrderStore } from "../store/orderStore";
import { Order } from "../models/Order";
import { PaymentStore } from "../store/PaymentStore";

export async function paymentHandler(req: Request, res: Response) {
  const { token } = req.body;

  const decodedToken = getDecodedToken(token);
  if (!decodedToken.memo) {
    return res.status(400).json({ error: true, message: "missing token" });
  }

  let order: Order | undefined;
  try {
    order = await OrderStore.getInstance().getOrderByPaymentId(
      decodedToken.memo,
    );
  } catch {
    return res
      .status(500)
      .json({ error: true, message: "something went wrong" });
  }
  if (!order) {
    return res.status(404).json({ error: true, message: "not found" });
  }
  const paymentRequest = await PaymentStore.getInstance().getPaymentById(
    order.paymentId,
  );
  const tokenAmount = decodedToken.token[0].proofs.reduce(
    (a, c) => a + c.amount,
    0,
  );
  if (order.amount && tokenAmount !== order.amount) {
    return res.status(400).json({ error: true, message: "invalid token" });
  }

  if (
    paymentRequest.mint &&
    decodedToken.token[0].mint !== paymentRequest.mint
  ) {
    return res.status(400).json({ error: true, message: "invalid token" });
  }
  try {
    const wallet = new CashuWallet(new CashuMint(process.env.MINT_URL!));
    const receivedProofs = await wallet.receive(decodedToken);
    //TODO: add received proof to own proof store
    console.log(order);
  } catch {
    console.log("Tried spent token...");
    return res.status(400).json({ error: true, message: "invalid token" });
  }
  try {
    order.setOrderPaid();
  } catch {
    //TODO: Handle DB failure after token has been received
  }
}
