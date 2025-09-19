import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Switch } from "./ui/switch";
import { 
  Bell,
  BellOff,
  Check,
  X,
  Archive,
  Settings,
  Filter,
  Search,
  DollarSign,
  TrendingUp,
  AlertTriangle,
  Info,
  Clock,
  Users,
  Activity,
  Zap,
  Shield,
  ArrowRight
} from "lucide-react";
import { Input } from "./ui/input";
import { motion, AnimatePresence } from "framer-motion";

interface Notification {
  id: string;
  type: 'stream' | 'price' | 'transaction' | 'security' | 'system';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  priority: 'low' | 'medium' | 'high' | 'critical';
  action?: {
    label: string;
    url: string;
  };
  data?: any;
}

const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'stream',
    title: 'Stream Payment Completed',
    message: 'Your Senior Dev Salary Stream has completed its latest payment of $800 USDC',
    timestamp: '2 minutes ago',
    read: false,
    priority: 'medium',
    action: { label: 'View Stream', url: '/stream/1' }
  },
  {
    id: '2',
    type: 'price',
    title: 'Price Alert Triggered',
    message: 'Token Vesting Plan NFT price increased by 5.2% to 125.8 ETH',
    timestamp: '15 minutes ago',
    read: false,
    priority: 'low',
    action: { label: 'View Marketplace', url: '/marketplace' }
  },
  {
    id: '3',
    type: 'security',
    title: 'Security Score Updated',
    message: 'Your portfolio security score improved to A+ (95/100)',
    timestamp: '1 hour ago',
    read: true,
    priority: 'medium',
    action: { label: 'View Security', url: '/security' }
  },
  {
    id: '4',
    type: 'transaction',
    title: 'Transaction Confirmed',
    message: 'Stream creation transaction confirmed on Somnia Network (Gas: $0.002)',
    timestamp: '2 hours ago',
    read: true,
    priority: 'low'
  },
  {
    id: '5',
    type: 'system',
    title: 'Maintenance Complete',
    message: 'Scheduled maintenance completed. All systems operational.',
    timestamp: '6 hours ago',
    read: true,
    priority: 'low'
  },
  {
    id: '6',
    type: 'stream',
    title: 'Stream Milestone Reached',
    message: 'Marketing Retainer stream has reached 75% completion',
    timestamp: '1 day ago',
    read: false,
    priority: 'medium',
    action: { label: 'View Analytics', url: '/analytics' }
  }
];

const notificationIcons = {
  stream: DollarSign,
  price: TrendingUp,
  transaction: Activity,
  security: Shield,
  system: Info
};

const priorityColors = {
  low: 'bg-gray-500/20 text-gray-600',
  medium: 'bg-blue-500/20 text-blue-600',
  high: 'bg-orange-500/20 text-orange-600',
  critical: 'bg-red-500/20 text-red-600'
};

interface NotificationCenterProps {
  onClose?: () => void;
}

export function NotificationCenter({ onClose }: NotificationCenterProps) {
  const [notifications, setNotifications] = useState(mockNotifications);
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showUnreadOnly, setShowUnreadOnly] = useState(false);

  const filteredNotifications = notifications.filter(notification => {
    const matchesFilter = selectedFilter === 'all' || notification.type === selectedFilter;
    const matchesSearch = notification.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         notification.message.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesReadFilter = !showUnreadOnly || !notification.read;
    
    return matchesFilter && matchesSearch && matchesReadFilter;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  return (
    <div className="min-h-screen bg-background pt-24 pb-24 lg:pb-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                <Bell className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">Notifications</h1>
                <p className="text-muted-foreground">
                  Stay updated with your stream activity and portfolio changes
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {unreadCount > 0 && (
                <Badge className="bg-primary/20 text-primary">
                  {unreadCount} unread
                </Badge>
              )}
              {onClose && (
                <Button variant="outline" size="sm" onClick={onClose}>
                  <X className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>
        </motion.div>

        {/* Filters and Actions */}
        <motion.div 
          className="mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                <div className="flex flex-col sm:flex-row gap-4 flex-1">
                  <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search notifications..."
                      className="pl-10"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  
                  <Select value={selectedFilter} onValueChange={setSelectedFilter}>
                    <SelectTrigger className="w-full sm:w-48">
                      <SelectValue placeholder="Filter by type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="stream">Streams</SelectItem>
                      <SelectItem value="price">Price Alerts</SelectItem>
                      <SelectItem value="transaction">Transactions</SelectItem>
                      <SelectItem value="security">Security</SelectItem>
                      <SelectItem value="system">System</SelectItem>
                    </SelectContent>
                  </Select>

                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={showUnreadOnly}
                      onCheckedChange={setShowUnreadOnly}
                    />
                    <span className="text-sm">Unread only</span>
                  </div>
                </div>

                <div className="flex space-x-2">
                  {unreadCount > 0 && (
                    <Button variant="outline" size="sm" onClick={markAllAsRead}>
                      <Check className="w-4 h-4 mr-2" />
                      Mark All Read
                    </Button>
                  )}
                  <Button variant="outline" size="sm" onClick={clearAll}>
                    <Archive className="w-4 h-4 mr-2" />
                    Clear All
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Notifications List */}
        <motion.div 
          className="space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <AnimatePresence>
            {filteredNotifications.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="text-center py-12"
              >
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                  <BellOff className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold mb-2">No notifications found</h3>
                <p className="text-muted-foreground">
                  {searchQuery || selectedFilter !== 'all' 
                    ? "Try adjusting your search or filter criteria"
                    : "You're all caught up! New notifications will appear here."
                  }
                </p>
              </motion.div>
            ) : (
              filteredNotifications.map((notification, index) => {
                const Icon = notificationIcons[notification.type];
                return (
                  <motion.div
                    key={notification.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    layout
                  >
                    <Card className={`transition-all hover:shadow-md ${
                      notification.read 
                        ? 'bg-background border-border/50' 
                        : 'bg-card border-primary/20 shadow-sm'
                    }`}>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex items-start space-x-3 flex-1">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                              notification.read ? 'bg-muted' : 'bg-primary/10'
                            }`}>
                              <Icon className={`w-5 h-5 ${
                                notification.read ? 'text-muted-foreground' : 'text-primary'
                              }`} />
                            </div>
                            
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center space-x-2 mb-1">
                                <h3 className={`font-semibold text-sm ${
                                  notification.read ? 'text-muted-foreground' : 'text-foreground'
                                }`}>
                                  {notification.title}
                                </h3>
                                {!notification.read && (
                                  <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0" />
                                )}
                                <Badge 
                                  variant="secondary" 
                                  className={`text-xs ${priorityColors[notification.priority]}`}
                                >
                                  {notification.priority}
                                </Badge>
                              </div>
                              
                              <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                                {notification.message}
                              </p>
                              
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                                  <Clock className="w-3 h-3" />
                                  <span>{notification.timestamp}</span>
                                </div>
                                
                                {notification.action && (
                                  <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    className="text-xs h-6 px-2"
                                  >
                                    {notification.action.label}
                                    <ArrowRight className="w-3 h-3 ml-1" />
                                  </Button>
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center space-x-1">
                            {!notification.read && (
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0"
                                onClick={() => markAsRead(notification.id)}
                              >
                                <Check className="w-4 h-4" />
                              </Button>
                            )}
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                              onClick={() => deleteNotification(notification.id)}
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })
            )}
          </AnimatePresence>
        </motion.div>

        {/* Notification Settings */}
        <motion.div 
          className="mt-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Settings className="w-5 h-5" />
                <span>Notification Preferences</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-medium">Stream Notifications</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-sm">Payment completed</span>
                        <p className="text-xs text-muted-foreground">When streams complete payments</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-sm">Stream milestones</span>
                        <p className="text-xs text-muted-foreground">25%, 50%, 75% completion alerts</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium">Trading Notifications</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-sm">Price alerts</span>
                        <p className="text-xs text-muted-foreground">Significant price changes</p>
                      </div>
                      <Switch />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-sm">Market activity</span>
                        <p className="text-xs text-muted-foreground">New listings and sales</p>
                      </div>
                      <Switch />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}