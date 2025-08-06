// types.ts
export type Location = {
  lat: number;
  lng: number;
};

export type TransactionPay = {
  transactionId: string;
  userId: string;
  amount: number;
  timestamp: string; // or Date if you're using Date directly
  merchant: string;
  location: Location;
};

export type FlaggedTransaction = {
  transactionId: string;
  userId: string;
  reason: string;
  timestamp: string;
  location: Location;
};
