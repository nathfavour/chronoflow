"use client";
import React, { createContext, useContext, useCallback, useState, useEffect, useRef } from "react";
import { initPublicClient, getChronoFlowCoreContract, getMarketplaceContract, getStreamNftContract, addresses } from "./integrations";
import type { PublicClient, Hash, Address } from "viem";
import { encodeFunctionData } from "viem";
import { getToken } from "./tokens";
import type { WalletState, TxRecord, EnqueueTxPayload, NormalizedError, StreamData } from './types';

// --- Constants ---
const SOMNIA_CHAIN_ID = 1868; // update if actual differs
const SOMNIA_CHAIN_HEX = '0x' + SOMNIA_CHAIN_ID.toString(16);
const SOMNIA_CHAIN_PARAMS = {
  chainId: SOMNIA_CHAIN_HEX,
  chainName: 'Somnia',
  nativeCurrency: { name: 'Somnia', symbol: 'SOM', decimals: 18 },
  rpcUrls: ['https://dream-rpc.somnia.network'],
  blockExplorerUrls: ['https://explorer.somnia.network']
};
const LS_LAST_CONNECTOR_KEY = 'cf:lastConnector';
const EXPLORER_BASE = 'https://explorer.somnia.network';

// --- Legacy tx status (kept for transitional compatibility) ---
interface TxStatusLegacy { pending: boolean; hash?: Hash; error?: string; }

interface CreateStreamInput {
  recipient: string;
  amount: string; // human readable (e.g. "1000.25")
  tokenSymbol: string; // symbol from registry
  start: number; // unix seconds
  stop: number;  // unix seconds
}

interface Web3ContextValue {
  wallet: WalletState;
  publicClient: PublicClient | null;
  connectors: { id: string; name: string; ready: boolean; connect: () => Promise<void>; }[];
  connect: (connectorId?: string) => Promise<void>;
  disconnect: () => void;
  switchToSomnia: () => Promise<void>;
  enqueueTx: (payload: EnqueueTxPayload) => Promise<Hash>;
  txQueue: TxRecord[];
  getNextStreamId: () => Promise<bigint | null>;
  ensureAllowance: (tokenSymbol: string, spender: Address, required: bigint) => Promise<boolean>;
  createStream: (params: CreateStreamInput) => Promise<{ streamId: bigint } | null>;
  listNFT: (tokenId: bigint, priceWei: bigint) => Promise<boolean>;
  buyNFT: (tokenId: bigint, valueWei: bigint) => Promise<boolean>;
  fetchListing: (tokenId: bigint) => Promise<{ seller: Address; price: bigint } | null>;
  fetchStreamData: (streamId: bigint) => Promise<StreamData | null>;
  getTxExplorerUrl: (hash: Hash) => string;
  address: Address | null; // legacy convenience
  tx: TxStatusLegacy;      // legacy
}

const Web3Context = createContext<Web3ContextValue | undefined>(undefined);

function toUnits(amount: string, decimals: number): bigint {
  const sanitized = amount.trim();
  if (!/^\d*(\.\d*)?$/.test(sanitized)) throw new Error("Invalid amount format");
  const [wholeRaw, fracRaw = ""] = sanitized.split(".");
  const whole = wholeRaw === "" ? "0" : wholeRaw;
  const fracPadded = (fracRaw + "0".repeat(decimals)).slice(0, decimals);
  return BigInt(whole) * 10n ** BigInt(decimals) + BigInt(fracPadded || "0");
}

function toHex(value: bigint) { return "0x" + value.toString(16); }

function normalizeError(e: any): NormalizedError {
  const msg = e?.message || 'Unknown error';
  if (msg.includes('User rejected')) return { code: 'USER_REJECTED', message: 'User rejected request' };
  if (msg.includes('chain')) return { code: 'CHAIN_MISMATCH', message: 'Wrong network' };
  return { code: 'TX_FAILED', message: msg };
}

let uuidCounter = 0;
function simpleId() { uuidCounter += 1; return `tx_${Date.now()}_${uuidCounter}`; }

// Minimal ERC20 ABI subset for allowance/approve
const ERC20_ABI: any = [
  { "type": "function", "stateMutability": "view", "name": "allowance", "inputs": [ {"name":"owner","type":"address"}, {"name":"spender","type":"address"} ], "outputs": [ {"name":"","type":"uint256"} ] },
  { "type": "function", "stateMutability": "nonpayable", "name": "approve", "inputs": [ {"name":"spender","type":"address"}, {"name":"value","type":"uint256"} ], "outputs": [ {"name":"","type":"bool"} ] }
];

export function Web3Provider({ children }: { children: React.ReactNode }) {
  const [publicClient, setPublicClient] = useState<PublicClient | null>(null);
  const [wallet, setWallet] = useState<WalletState>({ status: 'disconnected' });
  const [txQueue, setTxQueue] = useState<TxRecord[]>([]);
  const allowanceCacheRef = useRef<Map<string, bigint>>(new Map());
  const [legacyTx, setLegacyTx] = useState<TxStatusLegacy>({ pending: false });
  const lastConnectorRef = useRef<string | null>(null);

  useEffect(() => { setPublicClient(initPublicClient()); }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const stored = localStorage.getItem(LS_LAST_CONNECTOR_KEY);
    if (stored === 'injected') connect('injected');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // --- Network switch helper ---
  const internalUpdateChain = useCallback((newId: number) => {
    setWallet(w => {
      if (w.status === 'disconnected') return w;
      const chainMismatch = newId !== SOMNIA_CHAIN_ID;
      return { ...w, chainId: newId, chainMismatch, status: chainMismatch ? 'error' : 'connected', errorCode: chainMismatch ? 'CHAIN_MISMATCH' : undefined, errorMessage: chainMismatch ? 'Please switch to Somnia network' : undefined };
    });
  }, []);

  const requestSwitch = useCallback(async (): Promise<number> => {
    const anyWindow: any = window;
    if (!anyWindow?.ethereum) throw new Error('No provider');
    try {
      await anyWindow.ethereum.request({ method: 'wallet_switchEthereumChain', params: [{ chainId: SOMNIA_CHAIN_HEX }] });
    } catch (e: any) {
      if (e?.code === 4902) {
        await anyWindow.ethereum.request({ method: 'wallet_addEthereumChain', params: [SOMNIA_CHAIN_PARAMS] });
      } else {
        throw e;
      }
    }
    const chainIdHex: string = await anyWindow.ethereum.request({ method: 'eth_chainId' });
    return parseInt(chainIdHex, 16);
  }, []);

  const switchToSomnia = useCallback(async () => {
    try {
      const id = await requestSwitch();
      internalUpdateChain(id);
    } catch (e) {
      // silently fail; UI already shows mismatch state
    }
  }, [requestSwitch, internalUpdateChain]);

  const connectInjected = useCallback(async () => {
    const anyWindow: any = window;
    if (!anyWindow?.ethereum) {
      setWallet({ status: 'error', errorCode: 'NO_PROVIDER', errorMessage: 'No injected wallet', chainMismatch: false });
      return;
    }
    try {
      setWallet(w => ({ ...w, status: 'connecting', errorCode: undefined, errorMessage: undefined }));
      const accounts: string[] = await anyWindow.ethereum.request({ method: 'eth_requestAccounts' });
      let chainIdHex: string = await anyWindow.ethereum.request({ method: 'eth_chainId' });
      let chainId = parseInt(chainIdHex, 16);
      if (chainId !== SOMNIA_CHAIN_ID) {
        try {
          chainId = await requestSwitch();
        } catch {/* user may reject; keep mismatch */}
      }
      const address = accounts[0] as Address;
      const chainMismatch = chainId !== SOMNIA_CHAIN_ID;
      setWallet({ status: chainMismatch ? 'error' : 'connected', address, chainId, connectorId: 'injected', chainMismatch, errorCode: chainMismatch ? 'CHAIN_MISMATCH' : undefined, errorMessage: chainMismatch ? 'Please switch to Somnia network' : undefined });
      lastConnectorRef.current = 'injected';
      localStorage.setItem(LS_LAST_CONNECTOR_KEY, 'injected');
      if (anyWindow.ethereum?.on) {
        anyWindow.ethereum.on('accountsChanged', (accs: string[]) => {
          setWallet(w => ({ ...w, address: accs[0] as Address }));
        });
        anyWindow.ethereum.on('chainChanged', (cid: string) => {
          const newId = parseInt(cid, 16);
          internalUpdateChain(newId);
        });
        anyWindow.ethereum.on('disconnect', () => {
          setWallet({ status: 'disconnected' });
          localStorage.removeItem(LS_LAST_CONNECTOR_KEY);
        });
      }
    } catch (e: any) {
      const norm = normalizeError(e);
      setWallet({ status: 'error', errorCode: norm.code, errorMessage: norm.message });
    }
  }, [requestSwitch, internalUpdateChain]);

  const connectors = [
    { id: 'injected', name: 'Browser Wallet', ready: typeof window !== 'undefined' && !!(window as any)?.ethereum, connect: connectInjected }
  ];

  const connect = useCallback(async (connectorId: string = 'injected') => {
    if (connectorId === 'injected') return connectInjected();
    throw new Error('Unknown connector');
  }, [connectInjected]);

  const disconnect = useCallback(() => {
    setWallet({ status: 'disconnected' });
    setLegacyTx({ pending: false });
    lastConnectorRef.current = null;
    if (typeof window !== 'undefined') localStorage.removeItem(LS_LAST_CONNECTOR_KEY);
  }, []);

  const address = wallet.address || null;

  const pushTxUpdate = useCallback((update: (prev: TxRecord[]) => TxRecord[]) => {
    setTxQueue(update);
  }, []);

  const getTxExplorerUrl = useCallback((hash: Hash) => `${EXPLORER_BASE}/tx/${hash}`, []);

  const enqueueTx = useCallback(async (payload: EnqueueTxPayload): Promise<Hash> => {
    if (!publicClient || !address) throw new Error('Wallet not connected');
    const anyWindow: any = window;
    if (!anyWindow?.ethereum) throw new Error('No injected wallet available');

    const id = simpleId();
    const record: TxRecord = { id, status: 'pending', createdAt: Date.now(), updatedAt: Date.now(), action: payload.label, meta: payload.meta };
    pushTxUpdate(q => [record, ...q]);
    setLegacyTx({ pending: true });

    try {
      const txParams: any = { from: address, to: payload.to, data: payload.data };
      if (payload.valueWei !== undefined) txParams.value = toHex(payload.valueWei);
      const hash = await anyWindow.ethereum.request({ method: 'eth_sendTransaction', params: [txParams] }) as Hash;
      pushTxUpdate(q => q.map(t => t.id === id ? { ...t, hash, updatedAt: Date.now(), meta: { ...t.meta, explorerUrl: getTxExplorerUrl(hash) } } : t));
      setLegacyTx({ pending: true, hash });
      await publicClient.waitForTransactionReceipt({ hash });
      pushTxUpdate(q => q.map(t => t.id === id ? { ...t, status: 'mined', hash, updatedAt: Date.now() } : t));
      setLegacyTx({ pending: false, hash });
      return hash;
    } catch (e: any) {
      const norm = normalizeError(e);
      pushTxUpdate(q => q.map(t => t.id === id ? { ...t, status: 'failed', errorMessage: norm.message, updatedAt: Date.now() } : t));
      setLegacyTx({ pending: false, error: norm.message });
      throw e;
    }
  }, [publicClient, address, pushTxUpdate, getTxExplorerUrl]);

  const getNextStreamId = useCallback(async () => {
    if (!publicClient) return null;
    const core = getChronoFlowCoreContract(publicClient);
    const next = await core.read.nextStreamId();
    return next as bigint;
  }, [publicClient]);

  const ensureAllowance = useCallback(async (tokenSymbol: string, spender: Address, required: bigint) => {
    if (!publicClient || !address) return false;
    const token = getToken(tokenSymbol);
    if (!token) throw new Error('Unknown token');
    if (token.symbol.toUpperCase() === 'ETH') return true; // native token does not need allowance
    const tokenAddress = token.address as Address;
    const tokenSym = token.symbol;
    const cacheKey = `${address}:${tokenAddress}:${spender}`;
    const cached = allowanceCacheRef.current.get(cacheKey);
    const anyWindow: any = window;
    if (!anyWindow?.ethereum) throw new Error('No injected wallet available');

    async function fetchAllowance(): Promise<bigint> {
      const data = encodeFunctionData({ abi: ERC20_ABI, functionName: 'allowance', args: [address as Address, spender] });
      const callParams: any = { to: tokenAddress, data };
      const result: string = await anyWindow.ethereum.request({ method: 'eth_call', params: [callParams, 'latest'] });
      return BigInt(result);
    }

    let current = cached;
    if (current === undefined) {
      current = await fetchAllowance();
      allowanceCacheRef.current.set(cacheKey, current);
    }
    if (current >= required) return true;

    const approveAmount = required * 2n;
    const approveData = encodeFunctionData({ abi: ERC20_ABI, functionName: 'approve', args: [spender, approveAmount] });
    await enqueueTx({ to: tokenAddress, data: approveData as `0x${string}`, label: 'Approve', meta: { token: tokenSym, amount: approveAmount.toString() } });
    const updated = await fetchAllowance();
    allowanceCacheRef.current.set(cacheKey, updated);
    return updated >= required;
  }, [publicClient, address, enqueueTx]);

  const createStream = useCallback(async (params: CreateStreamInput) => {
    if (!publicClient || !address) return null;
    const token = getToken(params.tokenSymbol);
    if (!token) throw new Error('Unknown token symbol');
    if (token.symbol.toUpperCase() === 'ETH') throw new Error('Native ETH streaming not yet supported; select an ERC20');
    if (params.stop <= params.start) throw new Error('Stop time must be after start time');
    const deposit = toUnits(params.amount, token.decimals);
    const core = getChronoFlowCoreContract(publicClient);
    await ensureAllowance(token.symbol, addresses.ChronoFlowCore, deposit);
    const calldata = encodeFunctionData({
      abi: core.abi as any,
      functionName: 'createStream',
      args: [
        params.recipient,
        deposit,
        token.address,
        BigInt(params.start),
        BigInt(params.stop)
      ]
    });
    await enqueueTx({ to: addresses.ChronoFlowCore, data: calldata, label: 'Create Stream', meta: { token: token.symbol, amount: params.amount } });
    const next = await core.read.nextStreamId();
    return { streamId: (next as bigint) - 1n };
  }, [publicClient, address, enqueueTx, ensureAllowance]);

  const listNFT = useCallback(async (tokenId: bigint, priceWei: bigint) => {
    if (!publicClient || !address) return false;
    const marketplace = getMarketplaceContract(publicClient);
    const streamNft = getStreamNftContract(publicClient);
    const approved = await streamNft.read.isApprovedForAll([address, addresses.ChronoFlowMarketplace]);
    if (!approved) {
      const approveData = encodeFunctionData({ abi: streamNft.abi as any, functionName: 'setApprovalForAll', args: [addresses.ChronoFlowMarketplace, true] });
      await enqueueTx({ to: addresses.StreamNFT, data: approveData, label: 'Approve NFT', meta: { operator: addresses.ChronoFlowMarketplace } });
    }
    const calldata = encodeFunctionData({ abi: marketplace.abi as any, functionName: 'listNFT', args: [tokenId, priceWei] });
    await enqueueTx({ to: addresses.ChronoFlowMarketplace, data: calldata, label: 'List NFT', meta: { tokenId: tokenId.toString() } });
    return true;
  }, [publicClient, address, enqueueTx]);

  const buyNFT = useCallback(async (tokenId: bigint, valueWei: bigint) => {
    if (!publicClient || !address) return false;
    const marketplace = getMarketplaceContract(publicClient);
    const calldata = encodeFunctionData({ abi: marketplace.abi as any, functionName: 'buyNFT', args: [tokenId] });
    await enqueueTx({ to: addresses.ChronoFlowMarketplace, data: calldata, valueWei, label: 'Buy NFT', meta: { tokenId: tokenId.toString() } });
    return true;
  }, [publicClient, address, enqueueTx]);

  const fetchListing = useCallback(async (tokenId: bigint) => {
    if (!publicClient) return null;
    const marketplace = getMarketplaceContract(publicClient);
    const listing = await marketplace.read.listings([tokenId]) as unknown as [Address, bigint];
    const seller = listing[0];
    const price = listing[1];
    if (seller === '0x0000000000000000000000000000000000000000') return null;
    return { seller, price };
  }, [publicClient]);

  const fetchStreamData = useCallback(async (streamId: bigint) => {
    if (!publicClient) return null;
    const core = getChronoFlowCoreContract(publicClient);
    const raw = await core.read.streams([streamId]);
    if (!raw) return null;
    const [payer, recipient, deposit, token, startTime, stopTime, remainingBalance, withdrawnAmount] = raw as any[];
    return { streamId, payer, recipient, deposit, token, startTime, stopTime, remainingBalance, withdrawnAmount } as StreamData;
  }, [publicClient]);

  const value: Web3ContextValue = {
    wallet,
    publicClient,
    connectors,
    connect,
    disconnect,
    switchToSomnia,
    enqueueTx,
    txQueue,
    getNextStreamId,
    ensureAllowance,
    createStream,
    listNFT,
    buyNFT,
    fetchListing,
    fetchStreamData,
    getTxExplorerUrl,
    address,
    tx: legacyTx
  };

  return <Web3Context.Provider value={value}>{children}</Web3Context.Provider>;
}

export function useWeb3() {
  const ctx = useContext(Web3Context);
  if (!ctx) throw new Error('useWeb3 must be used within Web3Provider');
  return ctx;
}
