"use client";
import React, { createContext, useContext, useCallback, useState, useEffect } from "react";
import { initPublicClient, getChronoFlowCoreContract, getMarketplaceContract, addresses } from "./integrations";
import type { PublicClient, Hash } from "viem";
import { encodeFunctionData } from "viem";
import { getToken } from "./tokens";

interface TxStatus {
  pending: boolean;
  hash?: Hash;
  error?: string;
}

interface CreateStreamInput {
  recipient: string;
  amount: string; // human readable (e.g. "1000.25")
  tokenSymbol: string; // symbol from registry
  start: number; // unix seconds
  stop: number;  // unix seconds
}

interface Web3ContextValue {
  publicClient: PublicClient | null;
  address: string | null;
  connect: () => Promise<void>;
  disconnect: () => void;
  getNextStreamId: () => Promise<bigint | null>;
  createStream: (params: CreateStreamInput) => Promise<{ streamId: bigint } | null>;
  listNFT: (tokenId: bigint, priceWei: bigint) => Promise<boolean>;
  buyNFT: (tokenId: bigint, valueWei: bigint) => Promise<boolean>;
  tx: TxStatus;
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

export function Web3Provider({ children }: { children: React.ReactNode }) {
  const [publicClient, setPublicClient] = useState<PublicClient | null>(null);
  const [address, setAddress] = useState<string | null>(null);
  const [tx, setTx] = useState<TxStatus>({ pending: false });

  useEffect(() => {
    const pc = initPublicClient();
    setPublicClient(pc);
  }, []);

  const connect = useCallback(async () => {
    const anyWindow: any = window;
    if (!anyWindow?.ethereum) {
      console.warn("No injected wallet found");
      return;
    }
    const accounts: string[] = await anyWindow.ethereum.request({ method: "eth_requestAccounts" });
    setAddress(accounts[0]);
  }, []);

  const disconnect = useCallback(() => {
    setAddress(null);
  }, []);

  const getNextStreamId = useCallback(async () => {
    if (!publicClient) return null;
    const core = getChronoFlowCoreContract(publicClient);
    const next = await core.read.nextStreamId();
    return next as bigint;
  }, [publicClient]);

  const sendTransaction = useCallback(async (payload: { to: string; data: string; valueWei?: bigint; }) => {
    if (!publicClient || !address) throw new Error("Wallet not connected");
    const anyWindow: any = window;
    if (!anyWindow?.ethereum) throw new Error("No injected wallet available");
    setTx({ pending: true });
    try {
      const txParams: any = { from: address, to: payload.to, data: payload.data };
      if (payload.valueWei !== undefined) txParams.value = toHex(payload.valueWei);
       const hash = await anyWindow.ethereum.request({ method: 'eth_sendTransaction', params: [txParams] }) as Hash;
      setTx({ pending: true, hash });
      await publicClient.waitForTransactionReceipt({ hash });
      setTx({ pending: false, hash });
      return hash;
    } catch (e: any) {
      const msg = e?.message || 'Transaction failed';
      setTx({ pending: false, error: msg });
      throw e;
    }
  }, [publicClient, address]);

  const createStream = useCallback(async (params: CreateStreamInput) => {
    if (!publicClient || !address) return null;

    const token = getToken(params.tokenSymbol);
    if (!token) throw new Error("Unknown token symbol");
    if (token.symbol.toUpperCase() === 'ETH') throw new Error("Native ETH streaming not yet supported; select an ERC20");

    if (params.stop <= params.start) throw new Error("Stop time must be after start time");

    const deposit = toUnits(params.amount, token.decimals);

    const core = getChronoFlowCoreContract(publicClient);
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

    await sendTransaction({ to: addresses.ChronoFlowCore, data: calldata });
    const next = await core.read.nextStreamId();
    return { streamId: (next as bigint) - 1n };
  }, [publicClient, address, sendTransaction]);

  const listNFT = useCallback(async (tokenId: bigint, priceWei: bigint) => {
    if (!publicClient || !address) return false;
    const marketplace = getMarketplaceContract(publicClient);
    const calldata = encodeFunctionData({
      abi: marketplace.abi as any,
      functionName: 'listNFT',
      args: [tokenId, priceWei]
    });
    await sendTransaction({ to: addresses.ChronoFlowMarketplace, data: calldata });
    return true;
  }, [publicClient, address, sendTransaction]);

  const buyNFT = useCallback(async (tokenId: bigint, valueWei: bigint) => {
    if (!publicClient || !address) return false;
    const marketplace = getMarketplaceContract(publicClient);
    const calldata = encodeFunctionData({
      abi: marketplace.abi as any,
      functionName: 'buyNFT',
      args: [tokenId]
    });
    await sendTransaction({ to: addresses.ChronoFlowMarketplace, data: calldata, valueWei });
    return true;
  }, [publicClient, address, sendTransaction]);

  return (
    <Web3Context.Provider value={{ publicClient, address, connect, disconnect, getNextStreamId, createStream, listNFT, buyNFT, tx }}>
      {children}
    </Web3Context.Provider>
  );
}

export function useWeb3() {
  const ctx = useContext(Web3Context);
  if (!ctx) throw new Error('useWeb3 must be used within Web3Provider');
  return ctx;
}
