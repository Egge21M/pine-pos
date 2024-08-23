import { decodeCBOR, encodeCBOR } from "../cbor";
import { RawPaymentRequest, Transport } from "../types";

export class PaymentRequest {
  constructor(
    public unit: string,
    public transport: Transport[],
    public amount?: number,
    public mint?: string,
    public description?: string,
    public memo?: string,
    public lock?: string,
  ) {}

  toEncodedRequest() {
    const rawRequest: RawPaymentRequest = {
      u: this.unit,
      t: this.transport.map((t) => ({ t: t.type, a: t.target })),
    };
    if (this.lock) {
      rawRequest.l = this.lock;
    }
    if (this.memo) {
      rawRequest.m = this.memo;
    }
    if (this.mint) {
      rawRequest.r = this.mint;
    }
    if (this.amount) {
      rawRequest.a = this.amount;
    }
    if (this.description) {
      rawRequest.d = this.description;
    }
    const data = encodeCBOR(rawRequest);
    const encodedData = Buffer.from(data).toString("base64");
    return "creq" + "A" + encodedData;
  }

  static fromEncodedRequest(encodedRequest: string): PaymentRequest {
    const version = encodedRequest[4];
    if (version !== "A") {
      throw new Error("unsupported version...");
    }
    const encodedData = encodedRequest.slice(5);
    const data = Buffer.from(encodedData, "base64");
    const decoded = decodeCBOR(data) as RawPaymentRequest;
    const transports = decoded.t.map((t) => ({ type: t.t, target: t.a }));
    return new PaymentRequest(
      decoded.u,
      transports,
      decoded.a,
      decoded.r,
      decoded.d,
      decoded.m,
      decoded.l,
    );
  }
}
