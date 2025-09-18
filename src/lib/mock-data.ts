import { Stream } from './types';

const now = Math.floor(Date.now() / 1000);
const oneHour = 60 * 60;
const oneDay = 24 * oneHour;
const oneWeek = 7 * oneDay;
const oneMonth = 30 * oneDay;

export const mockStreams: Stream[] = [
  {
    id: '1',
    sender: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
    recipient: '0xAb5801a7D398351b8bE11C439e05C5B3259aeC9B',
    totalAmount: 1000,
    token: { symbol: 'USDC', name: 'USD Coin' },
    startTime: now - oneDay, // Started 1 day ago
    endTime: now + oneWeek, // Ends in 1 week
    status: 'active',
  },
  {
    id: '2',
    sender: '0xAb5801a7D398351b8bE11C439e05C5B3259aeC9B',
    recipient: '0x70997970C51812dc3A010C7d01b50e0d17dc79C8',
    totalAmount: 50000,
    token: { symbol: 'SOM', name: 'Somnia Token' },
    startTime: now - oneWeek, // Started 1 week ago
    endTime: now + oneMonth * 3, // Ends in 3 months
    status: 'active',
  },
  {
    id: '3',
    sender: '0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC',
    recipient: '0xAb5801a7D398351b8bE11C439e05C5B3259aeC9B',
    totalAmount: 2.5,
    token: { symbol: 'WETH', name: 'Wrapped Ether' },
    startTime: now - oneMonth,
    endTime: now - oneDay, // Completed 1 day ago
    status: 'completed',
  },
  {
    id: '4',
    sender: '0xAb5801a7D398351b8bE11C439e05C5B3259aeC9B',
    recipient: '0x90F79bf6EB2c4f870365E785982E1f101E93b906',
    totalAmount: 1200,
    token: { symbol: 'DAI', name: 'Dai Stablecoin' },
    startTime: now - oneHour,
    endTime: now + oneHour, // Ends in 1 hour
    status: 'active',
  },
];
