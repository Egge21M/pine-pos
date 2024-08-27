import { CashuMint, CashuWallet, getDecodedToken } from "@cashu/cashu-ts";
import { Request, Response } from "express";
import { OrderStore } from "../store/OrderStore";
import { Order } from "../models/Order";
import { PaymentStore } from "../store/PaymentStore";
import { json } from "body-parser";

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
    decodedToken.memo,
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
  } catch {
    console.log("Tried spent token...");
    return res.status(400).json({ error: true, message: "invalid token" });
  }
  try {
    OrderStore.getInstance().setOrderPaid(decodedToken.memo);
    return res.status(200).json({ error: false });
  } catch {
    //TODO: Handle DB failure after token has been received
  }
}
