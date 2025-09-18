"use client";

import {
  ArrowRight,
  Download,
  MoreVertical,
  Repeat,
  XCircle,
} from "lucide-react";

import { useStream } from "@/hooks/use-stream";
import { Stream } from "@/lib/types";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

interface StreamCardProps {
  stream: Stream;
}

const formatAddress = (address: string) => `${address.slice(0, 6)}...${address.slice(-4)}`;

export function StreamCard({ stream }: StreamCardProps) {
  const { streamedAmount, progress, flowRate } = useStream(stream);
  const { toast } = useToast();

  const handleClaim = () => {
    toast({
      title: "Claim Successful",
      description: `You have claimed ${streamedAmount.toFixed(4)} ${stream.token.symbol}.`,
    });
  };
  
  const isCompleted = stream.status === 'completed' || progress >= 100;
  const isCanceled = stream.status === 'cancelled';
  const isActive = stream.status === 'active' && !isCompleted;
  
  let statusBadge;
  if (isCompleted) {
    statusBadge = <Badge variant="secondary">Completed</Badge>;
  } else if (isCanceled) {
    statusBadge = <Badge variant="destructive">Canceled</Badge>;
  } else {
    statusBadge = <Badge variant="default">Active</Badge>;
  }

  return (
    <Card className="flex flex-col bg-card/60 backdrop-blur-sm border-border/20 hover:border-accent/40 transition-colors duration-300">
      <CardHeader className="flex-row items-start gap-4">
        <div className="flex-grow">
          <CardTitle className="text-xl">
            {stream.totalAmount.toLocaleString()} {stream.token.symbol}
          </CardTitle>
          <CardDescription className="flex items-center gap-2 mt-1">
            <span>{formatAddress(stream.sender)}</span>
            <ArrowRight className="h-4 w-4 text-muted-foreground" />
            <span>{formatAddress(stream.recipient)}</span>
          </CardDescription>
        </div>
        <div className="flex items-center gap-2">
            {statusBadge}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Repeat className="mr-2 h-4 w-4" />
                <span>Trade</span>
              </DropdownMenuItem>
              <DropdownMenuItem disabled={!isActive}>
                <XCircle className="mr-2 h-4 w-4" />
                <span>Cancel Stream</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="space-y-4">
          <div>
            <div className="mb-2 flex justify-between text-sm">
              <span className="text-muted-foreground">Streamed</span>
              <span className="font-medium text-foreground">
                {streamedAmount.toFixed(4)} / {stream.totalAmount.toLocaleString()}
              </span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
          <div className="text-xs text-muted-foreground flex justify-between">
              <span>Flow Rate: {flowRate.toFixed(6)} {stream.token.symbol}/s</span>
              <span>{progress.toFixed(2)}%</span>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={handleClaim} className="w-full" disabled={!isActive || streamedAmount < 0.00001}>
          <Download className="mr-2 h-4 w-4" />
          Claim Tokens
        </Button>
      </CardFooter>
    </Card>
  );
}
