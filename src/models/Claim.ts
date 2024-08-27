import { Proof } from "@cashu/cashu-ts";

export class Claim {
  constructor(
    public id: number,
    public createdAt: number,
    public proof: Proof,
    public paymentId: string,
  ) {}
}
