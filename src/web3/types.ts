// Core shared types for ChronoFlow wallet & on-chain interactions
// (Phase 1–4 coverage; extend cautiously)

import type { Hash, Address } from 'viem';

export type WalletErrorCode =
  | 'NO_PROVIDER'
  | 'USER_REJECTED'
  | 'CHAIN_MISMATCH'
  | 'RPC_ERROR'
  | 'INVALID_INPUT'
  | 'INSUFFICIENT_ALLOWANCE'
  | 'NOT_OWNER'
  | 'ALREADY_LISTED'
  | 'LISTING_NOT_FOUND'
  | 'NETWORK_FAILURE'
  | 'TX_FAILED'
  | 'INTERNAL';

export interface NormalizedError {
  code: WalletErrorCode;
  message: string;
  details?: any;
}

export interface WalletState {
  status: 'disconnected' | 'connecting' | 'connected' | 'error';
  address?: Address;
  chainId?: number;
  connectorId?: string;
  errorCode?: WalletErrorCode;
  errorMessage?: string;
  chainMismatch?: boolean;
}

export interface TxRecord {
  id: string; // uuid-like
  hash?: Hash;
  status: 'pending' | 'mined' | 'failed';
  createdAt: number;
  updatedAt: number;
  action?: string;
  meta?: Record<string, any>;
  errorMessage?: string;
}

export interface AllowanceState {
  token: string; // symbol
  owner: Address;
  spender: Address;
  value: bigint;
  loading: boolean;
  lastFetched: number;
  error?: string;
}

export interface Listing {
  tokenId: bigint;
  seller: Address;
  price: bigint;
  loading?: boolean;
  error?: string;
}

export interface StreamData {
  streamId: bigint;
  payer: Address;
  recipient: Address;
  deposit: bigint;
  token: Address;
  startTime: bigint;
  stopTime: bigint;
  remainingBalance: bigint;
  withdrawnAmount: bigint;
}

export interface WalletConnectorMeta {
  id: string;
  name: string;
  ready: boolean;
}

export interface EnqueueTxPayload {
  to: Address;
  data: `0x${string}`;
  valueWei?: bigint;
  label?: string;
  meta?: Record<string, any>;
}
