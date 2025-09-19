import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Progress } from "./ui/progress";
import { Calendar, DollarSign, User, Clock, ExternalLink } from "lucide-react";

interface StreamCardProps {
  id: string;
  title: string;
  description: string;
  totalAmount: number;
  streamedAmount: number;
  recipientAddress: string;
  startDate: string;
  endDate: string;
  status: "active" | "paused" | "completed";
  tokenSymbol: string;
  nftImage?: string;
}

export function StreamCard({
  id,
  title,
  description,
  totalAmount,
  streamedAmount,
  recipientAddress,
  startDate,
  endDate,
  status,
  tokenSymbol,
  nftImage
}: StreamCardProps) {
  const progress = (streamedAmount / totalAmount) * 100;
  const remainingAmount = totalAmount - streamedAmount;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500/20 text-green-500 border-green-500/20";
      case "paused":
        return "bg-yellow-500/20 text-yellow-500 border-yellow-500/20";
      case "completed":
        return "bg-blue-500/20 text-blue-500 border-blue-500/20";
      default:
        return "bg-gray-500/20 text-gray-500 border-gray-500/20";
    }
  };

  return (
    <Card className="relative overflow-hidden border border-border/50 hover:border-border transition-all duration-300 hover:shadow-lg">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg mb-1">{title}</CardTitle>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
          <Badge className={`ml-2 ${getStatusColor(status)}`}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* NFT Preview */}
        {nftImage && (
          <div className="w-full h-32 bg-gradient-to-br from-blue-500/20 to-purple-600/20 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg mx-auto mb-2 flex items-center justify-center">
                <span className="text-white font-bold">#{id.slice(-3)}</span>
              </div>
              <p className="text-xs text-muted-foreground">Stream NFT</p>
            </div>
          </div>
        )}

        {/* Stream Progress */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm">Stream Progress</span>
            <span className="text-sm font-medium">{progress.toFixed(1)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Amount Information */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-1">
              <DollarSign className="w-3 h-3 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">Streamed</span>
            </div>
            <p className="font-medium">
              {streamedAmount.toLocaleString()} {tokenSymbol}
            </p>
          </div>
          <div className="space-y-1">
            <div className="flex items-center space-x-1">
              <Clock className="w-3 h-3 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">Remaining</span>
            </div>
            <p className="font-medium">
              {remainingAmount.toLocaleString()} {tokenSymbol}
            </p>
          </div>
        </div>

        {/* Recipient */}
        <div className="space-y-1">
          <div className="flex items-center space-x-1">
            <User className="w-3 h-3 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">Recipient</span>
          </div>
          <p className="text-sm font-mono bg-muted/50 px-2 py-1 rounded text-xs">
            {recipientAddress.slice(0, 6)}...{recipientAddress.slice(-4)}
          </p>
        </div>

        {/* Duration */}
        <div className="space-y-1">
          <div className="flex items-center space-x-1">
            <Calendar className="w-3 h-3 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">Duration</span>
          </div>
          <p className="text-sm">
            {new Date(startDate).toLocaleDateString()} - {new Date(endDate).toLocaleDateString()}
          </p>
        </div>

        {/* Actions */}
        <div className="flex space-x-2 pt-2">
          <Button variant="outline" size="sm" className="flex-1">
            <ExternalLink className="w-3 h-3 mr-1" />
            View Details
          </Button>
          {status === "active" && (
            <Button size="sm" className="flex-1">
              Trade NFT
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}