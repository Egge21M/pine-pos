export class Order {
  constructor(
    public id: number,
    public createdAt: number,
    public unit: string,
    public amount: number,
    public paymentId: number,
    public isPaid: boolean,
  ) {}
}
