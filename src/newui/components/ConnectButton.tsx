"use client";
import { useMemo } from "react";
import { useWeb3 } from "@/web3/context";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Loader2, PlugZap, AlertTriangle, WifiOff } from "lucide-react";

interface ConnectButtonProps {
  size?: "sm" | "default" | "lg";
  showStatusBadge?: boolean;
  className?: string;
}

export function ConnectButton({ size = "sm", showStatusBadge = true, className = "" }: ConnectButtonProps) {
  const { wallet, connect, disconnect, tx } = useWeb3();
  const { status, address, chainMismatch, errorCode } = wallet;

  const label = useMemo(() => {
    if (status === 'connecting') return 'Connecting...';
    if (status === 'connected' && address) return `${address.slice(0, 6)}...${address.slice(-4)}`;
    if (status === 'error') return chainMismatch ? 'Wrong Network' : 'Reconnect Wallet';
    return 'Connect Wallet';
  }, [status, address, chainMismatch]);

  const intent = useMemo<'default' | 'destructive' | 'outline'>(() => {
    if (status === 'error') return 'destructive';
    if (status === 'connected') return 'outline';
    return 'default';
  }, [status]);

  function handleClick() {
    if (status === 'connected') {
      disconnect();
      return;
    }
    connect();
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}> 
      <Button size={size} variant={intent} disabled={tx.pending || status === 'connecting'} onClick={handleClick}>
        {status === 'connecting' && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
        {status === 'error' && !chainMismatch && <WifiOff className="w-4 h-4 mr-2" />}
        {chainMismatch && <AlertTriangle className="w-4 h-4 mr-2" />}
        {status === 'disconnected' && <PlugZap className="w-4 h-4 mr-2" />}
        <span>{label}</span>
      </Button>
      {showStatusBadge && (
        status === 'connected' ? (
          <Badge variant="secondary" className={chainMismatch ? 'bg-red-500/20 text-red-600' : 'bg-green-500/20 text-green-600'}>
            {chainMismatch ? 'Switch Network' : 'Connected'}
          </Badge>
        ) : status === 'error' ? (
          <Badge variant="secondary" className="bg-red-500/20 text-red-600">
            {errorCode || 'Error'}
          </Badge>
        ) : null
      )}
    </div>
  );
}
