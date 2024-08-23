export type RawTransport = {
  t: string;
  a: string;
};

export type RawPaymentRequest = {
  a?: number;
  u: string;
  r?: string;
  d?: string;
  m?: string;
  l?: string;
  t: RawTransport[];
};

export type Transport = {
  type: string;
  target: string;
};
