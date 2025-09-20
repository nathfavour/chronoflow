// Simple token registry for mapping symbols to addresses & decimals on Somnia (example / placeholder values)
// Replace addresses with actual deployed ERC20 token addresses on Somnia network.

export interface TokenInfo {
  symbol: string;
  address: `0x${string}`;
  decimals: number;
  name: string;
}

// NOTE: ETH represented as native token pseudo-address (0xeeee...) for UI; contracts need wrapped token if required.
export const TOKENS: TokenInfo[] = [
  { symbol: 'USDC', address: '0x0000000000000000000000000000000000000001', decimals: 6, name: 'USD Coin' },
  { symbol: 'DAI',  address: '0x0000000000000000000000000000000000000002', decimals: 18, name: 'Dai Stablecoin' },
  { symbol: 'USDT', address: '0x0000000000000000000000000000000000000003', decimals: 6, name: 'Tether USD' },
  { symbol: 'ETH',  address: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee', decimals: 18, name: 'Ether' },
  { symbol: 'WBTC', address: '0x0000000000000000000000000000000000000004', decimals: 8, name: 'Wrapped Bitcoin' },
];

export function getToken(symbol: string): TokenInfo | undefined {
  return TOKENS.find(t => t.symbol.toLowerCase() === symbol.toLowerCase());
}
