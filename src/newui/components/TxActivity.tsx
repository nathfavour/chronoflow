"use client";
import { useWeb3 } from "@/web3/context";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { ExternalLink, Loader2, AlertTriangle, CheckCircle2, Clock } from "lucide-react";
import { useMemo } from "react";

function formatHash(hash?: string) {
  if (!hash) return "";
  return `${hash.slice(0, 10)}...${hash.slice(-6)}`;
}

function timeSince(ts: number) {
  const diff = Date.now() - ts;
  const s = Math.floor(diff / 1000);
  if (s < 60) return s + 's';
  const m = Math.floor(s / 60);
  if (m < 60) return m + 'm';
  const h = Math.floor(m / 60);
  if (h < 24) return h + 'h';
  const d = Math.floor(h / 24);
  return d + 'd';
}

export function TxActivity() {
  const { txQueue, getTxExplorerUrl } = useWeb3();
  const items = useMemo(() => txQueue.slice(0, 8), [txQueue]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2"><Clock className="w-4 h-4" /> Recent Activity</span>
          <Badge variant="secondary">{items.length}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        {items.length === 0 && (
          <div className="text-xs text-muted-foreground">No recent transactions</div>
        )}
        {items.map(tx => {
          const statusBadge = tx.status === 'pending'
            ? 'bg-blue-500/20 text-blue-600'
            : tx.status === 'failed'
              ? 'bg-red-500/20 text-red-600'
              : 'bg-green-500/20 text-green-600';
          return (
            <div key={tx.id} className="p-2 rounded-md border bg-muted/40">
              <div className="flex items-center justify-between gap-2">
                <div className="flex flex-col">
                  <span className="font-medium flex items-center gap-1">
                    {tx.action}
                    {tx.status === 'pending' && <Loader2 className="w-3 h-3 animate-spin" />}
                    {tx.status === 'failed' && <AlertTriangle className="w-3 h-3" />}
                    {tx.status === 'mined' && <CheckCircle2 className="w-3 h-3" />}
                  </span>
                  <span className="text-[10px] text-muted-foreground">{timeSince(tx.createdAt)} ago</span>
                  {tx.errorMessage && (
                    <span className="text-[10px] text-red-500">{tx.errorMessage}</span>
                  )}
                </div>
                <div className="flex flex-col items-end gap-1">
                  {tx.hash && (
                    <Badge variant="secondary" className="font-mono text-[10px]">
                      {formatHash(tx.hash)}
                    </Badge>
                  )}
                  {tx.hash && (
                    <Button asChild variant="ghost" size="icon" className="h-6 w-6" title="Open in explorer">
                      <a href={getTxExplorerUrl(tx.hash)} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </Button>
                  )}
                  <Badge variant="secondary" className={statusBadge + ' text-[10px]'}>{tx.status}</Badge>
                </div>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}

export default TxActivity;
