"use client";
import React, { createContext, useContext, useCallback, useState, useEffect } from "react";
import { initPublicClient, getChronoFlowCoreContract, getMarketplaceContract, getStreamNftContract, addresses } from "./integrations";
import type { PublicClient } from "viem";

interface Web3ContextValue {
  publicClient: PublicClient | null;
  address: string | null;
  connect: () => Promise<void>;
  disconnect: () => void;
  createStream: (params: { recipient: string; deposit: bigint; token: string; start: number; stop: number; }) => Promise<{ streamId: bigint } | null>;
  getNextStreamId: () => Promise<bigint | null>;
  listNFT: (tokenId: bigint, priceWei: bigint) => Promise<boolean>;
}

const Web3Context = createContext<Web3ContextValue | undefined>(undefined);

export function Web3Provider({ children }: { children: React.ReactNode }) {
  const [publicClient, setPublicClient] = useState<PublicClient | null>(null);
  const [address, setAddress] = useState<string | null>(null);

  useEffect(() => {
    const pc = initPublicClient();
    setPublicClient(pc);
  }, []);

  const connect = useCallback(async () => {
    // For now, use window.ethereum if available
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

  const createStream = useCallback(async (params: { recipient: string; deposit: bigint; token: string; start: number; stop: number; }) => {
    if (!publicClient || !address) return null;
    // We rely on injected wallet for signing
    const anyWindow: any = window;
    if (!anyWindow?.ethereum) return null;

    const core = getChronoFlowCoreContract(publicClient);
    // Build calldata
    const data = core.abi.find(f => f.type === 'function' && f.name === 'createStream');
    // Instead of manual encoding rely on wallet's eth_sendTransaction + viem's encodeFunctionData (avoid extra dependency by light inline encoder?)
    // Minimal approach: import encodeFunctionData from viem
    const { encodeFunctionData } = await import('viem');
    const calldata = encodeFunctionData({
      abi: core.abi as any,
      functionName: 'createStream',
      args: [params.recipient, params.deposit, params.token, BigInt(params.start), BigInt(params.stop)]
    });

    const txHash = await anyWindow.ethereum.request({
      method: 'eth_sendTransaction',
      params: [{
        from: address,
        to: addresses.ChronoFlowCore,
        data: calldata
      }]
    });

    // Wait for receipt via public client
    await publicClient.waitForTransactionReceipt({ hash: txHash });
    const next = await core.read.nextStreamId();
    return { streamId: (next as bigint) - 1n };
  }, [publicClient, address]);

  const listNFT = useCallback(async (tokenId: bigint, priceWei: bigint) => {
    if (!publicClient || !address) return false;
    const anyWindow: any = window;
    if (!anyWindow?.ethereum) return false;
    const marketplace = getMarketplaceContract(publicClient);
    const { encodeFunctionData } = await import('viem');
    const calldata = encodeFunctionData({
      abi: marketplace.abi as any,
      functionName: 'listNFT',
      args: [tokenId, priceWei]
    });
    const txHash = await anyWindow.ethereum.request({
      method: 'eth_sendTransaction',
      params: [{ from: address, to: addresses.ChronoFlowMarketplace, data: calldata }]
    });
    await publicClient.waitForTransactionReceipt({ hash: txHash });
    return true;
  }, [publicClient, address]);

  return (
    <Web3Context.Provider value={{ publicClient, address, connect, disconnect, createStream, getNextStreamId, listNFT }}>
      {children}
    </Web3Context.Provider>
  );
}

export function useWeb3() {
  const ctx = useContext(Web3Context);
  if (!ctx) throw new Error('useWeb3 must be used within Web3Provider');
  return ctx;
}
