"use client";
import { useMemo, useState } from "react";
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
  const { wallet, connect, disconnect, tx, switchToSomnia } = useWeb3();
  const { status, address, chainMismatch, errorCode } = wallet;
  const [switching, setSwitching] = useState(false);

  const label = useMemo(() => {
    if (status === 'connecting') return 'Connecting...';
    if (chainMismatch) return 'Switch Network';
    if (status === 'connected' && address) return `${address.slice(0, 6)}...${address.slice(-4)}`;
    if (status === 'error') return 'Reconnect Wallet';
    return 'Connect Wallet';
  }, [status, address, chainMismatch]);

  const intent = useMemo<'default' | 'destructive' | 'outline'>(() => {
    if (chainMismatch) return 'destructive';
    if (status === 'error') return 'destructive';
    if (status === 'connected') return 'outline';
    return 'default';
  }, [status, chainMismatch]);

  async function handleClick() {
    if (chainMismatch) {
      try {
        setSwitching(true);
        await switchToSomnia();
      } finally {
        setSwitching(false);
      }
      return;
    }
    if (status === 'connected') {
      disconnect();
      return;
    }
    connect();
  }

  const isDisabled = tx.pending || status === 'connecting' || switching;

  return (
    <div className={`flex items-center gap-2 ${className}`}> 
      <Button size={size} variant={intent} disabled={isDisabled} onClick={handleClick}>
        {(status === 'connecting' || switching) && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
        {!switching && status === 'error' && !chainMismatch && <WifiOff className="w-4 h-4 mr-2" />}
        {!switching && chainMismatch && <AlertTriangle className="w-4 h-4 mr-2" />}
        {!switching && status === 'disconnected' && <PlugZap className="w-4 h-4 mr-2" />}
        <span>{label}</span>
      </Button>
      {showStatusBadge && (
        status === 'connected' && !chainMismatch ? (
          <Badge variant="secondary" className="bg-green-500/20 text-green-600">
            Connected
          </Badge>
        ) : chainMismatch ? (
          <Badge variant="secondary" className="bg-red-500/20 text-red-600">
            Wrong Network
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
