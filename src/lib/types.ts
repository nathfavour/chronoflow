export type Stream = {
  id: string;
  sender: string;
  recipient: string;
  totalAmount: number;
  token: {
    symbol: string;
    name: string;
  };
  startTime: number; // Unix timestamp in seconds
  endTime: number; // Unix timestamp in seconds
  status: 'active' | 'completed' | 'cancelled';
};
