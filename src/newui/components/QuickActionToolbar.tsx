import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { 
  Play, 
  Pause, 
  Square, 
  ShoppingCart, 
  Download, 
  Settings,
  Plus,
  Zap,
  ChevronUp,
  ChevronDown
} from "lucide-react";

interface QuickAction {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  action: () => void;
  color: string;
  description: string;
  disabled?: boolean;
  badge?: string;
}

interface QuickActionToolbarProps {
  onCreateStream?: () => void;
  onPauseStream?: (streamId: string) => void;
  onResumeStream?: (streamId: string) => void;
  onStopStream?: (streamId: string) => void;
  onListNFT?: (nftId: string) => void;
  onWithdraw?: () => void;
  selectedStreamId?: string;
}

export function QuickActionToolbar({
  onCreateStream,
  onPauseStream,
  onResumeStream,
  onStopStream,
  onListNFT,
  onWithdraw,
  selectedStreamId
}: QuickActionToolbarProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  const showNotification = (message: string) => {
    setNotification(message);
    setTimeout(() => setNotification(null), 3000);
  };

  const quickActions: QuickAction[] = [
    {
      id: "create",
      label: "Create Stream",
      icon: Plus,
      action: () => {
        onCreateStream?.();
        showNotification("Navigating to Create Stream...");
      },
      color: "bg-blue-500 hover:bg-blue-600",
      description: "Create a new payment stream"
    },
    {
      id: "pause",
      label: "Pause Stream",
      icon: Pause,
      action: () => {
        if (selectedStreamId) {
          onPauseStream?.(selectedStreamId);
          showNotification("Stream paused successfully");
        }
      },
      color: "bg-yellow-500 hover:bg-yellow-600",
      description: "Pause active stream",
      disabled: !selectedStreamId
    },
    {
      id: "resume",
      label: "Resume Stream",
      icon: Play,
      action: () => {
        if (selectedStreamId) {
          onResumeStream?.(selectedStreamId);
          showNotification("Stream resumed successfully");
        }
      },
      color: "bg-green-500 hover:bg-green-600",
      description: "Resume paused stream",
      disabled: !selectedStreamId
    },
    {
      id: "stop",
      label: "Stop Stream",
      icon: Square,
      action: () => {
        if (selectedStreamId) {
          onStopStream?.(selectedStreamId);
          showNotification("Stream stopped successfully");
        }
      },
      color: "bg-red-500 hover:bg-red-600",
      description: "Stop stream permanently",
      disabled: !selectedStreamId
    },
    {
      id: "list",
      label: "List NFT",
      icon: ShoppingCart,
      action: () => {
        if (selectedStreamId) {
          onListNFT?.(selectedStreamId);
          showNotification("NFT listed for sale");
        }
      },
      color: "bg-purple-500 hover:bg-purple-600",
      description: "List stream NFT for sale",
      disabled: !selectedStreamId
    },
    {
      id: "withdraw",
      label: "Withdraw",
      icon: Download,
      action: () => {
        onWithdraw?.();
        showNotification("Withdrawal initiated");
      },
      color: "bg-emerald-500 hover:bg-emerald-600",
      description: "Withdraw available balance",
      badge: "$1,234"
    }
  ];

  const primaryActions = quickActions.slice(0, 3);
  const secondaryActions = quickActions.slice(3);

  return (
    <>
      {/* Floating Action Toolbar */}
      <motion.div
        className="fixed bottom-6 right-6 z-40"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Card className="p-2 bg-background/95 backdrop-blur-md border-2 border-primary/20 shadow-2xl shadow-primary/10">
          <div className="flex flex-col space-y-2">
            {/* Primary Actions - Always Visible */}
            <div className="flex space-x-2">
              {primaryActions.map((action) => {
                const Icon = action.icon;
                return (
                  <motion.div key={action.id} className="relative">
                    <Button
                      size="sm"
                      onClick={action.action}
                      disabled={action.disabled}
                      className={`w-12 h-12 p-0 ${action.color} text-white shadow-lg`}
                      title={action.description}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Icon className="w-5 h-5" />
                    </Button>
                    {action.badge && (
                      <Badge className="absolute -top-2 -right-2 text-xs bg-green-500 text-white border-green-500">
                        {action.badge}
                      </Badge>
                    )}
                  </motion.div>
                );
              })}
              
              {/* Expand/Collapse Button */}
              <Button
                size="sm"
                variant="outline"
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-12 h-12 p-0"
                title={isExpanded ? "Show less" : "Show more"}
              >
                {isExpanded ? (
                  <ChevronDown className="w-4 h-4" />
                ) : (
                  <ChevronUp className="w-4 h-4" />
                )}
              </Button>
            </div>

            {/* Secondary Actions - Expandable */}
            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="flex space-x-2 overflow-hidden"
                >
                  {secondaryActions.map((action) => {
                    const Icon = action.icon;
                    return (
                      <motion.div
                        key={action.id}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ duration: 0.2, delay: 0.1 }}
                        className="relative"
                      >
                        <Button
                          size="sm"
                          onClick={action.action}
                          disabled={action.disabled}
                          className={`w-12 h-12 p-0 ${action.color} text-white shadow-lg`}
                          title={action.description}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Icon className="w-5 h-5" />
                        </Button>
                        {action.badge && (
                          <Badge className="absolute -top-2 -right-2 text-xs bg-green-500 text-white border-green-500">
                            {action.badge}
                          </Badge>
                        )}
                      </motion.div>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </Card>
      </motion.div>

      {/* Action Labels Tooltip */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            className="fixed bottom-24 right-20 z-30"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="p-3 bg-background/95 backdrop-blur-md border border-border/50 shadow-lg">
              <div className="space-y-2 text-sm">
                <div className="flex items-center space-x-2 text-muted-foreground">
                  <Zap className="w-4 h-4" />
                  <span>Quick Actions</span>
                </div>
                {selectedStreamId && (
                  <div className="text-xs text-blue-600">
                    Selected: {selectedStreamId}
                  </div>
                )}
                <div className="text-xs text-muted-foreground">
                  Select a stream to enable more actions
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Success Notification */}
      <AnimatePresence>
        {notification && (
          <motion.div
            className="fixed top-6 right-6 z-50"
            initial={{ opacity: 0, y: -20, x: 20 }}
            animate={{ opacity: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, y: -20, x: 20 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="p-4 bg-green-500/10 border-green-500/20 shadow-lg">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-sm font-medium text-green-600">
                  {notification}
                </span>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}