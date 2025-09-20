import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Switch } from "./ui/switch";
import { 
  Bell,
  BellOff,
  Check,
  X,
  Archive,
  Settings,
  Search,
  DollarSign,
  TrendingUp,
  Info,
  Clock,
  Activity,
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
  low: 'bg-gray-500/20 text-gray-300',
  medium: 'bg-blue-500/20 text-blue-300',
  high: 'bg-orange-500/20 text-orange-300',
  critical: 'bg-red-500/20 text-red-300'
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 relative overflow-hidden">
      {/* Enhanced Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-purple-500/10 via-transparent to-blue-500/10" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-blue-500/20 to-cyan-500/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-full blur-2xl" />
      
      <div className="relative z-10 pt-24 pb-24 lg:pb-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Enhanced Header */}
          <motion.div 
            className="mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <motion.div 
                  className="w-12 h-12 bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-sm border border-purple-500/20 rounded-xl flex items-center justify-center"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.2 }}
                >
                  <Bell className="w-6 h-6 text-purple-400" />
                </motion.div>
                <div>
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent">
                    Notifications
                  </h1>
                  <p className="text-slate-400 mt-1">
                    Stay updated with your stream activity and portfolio changes
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                {unreadCount > 0 && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    whileHover={{ scale: 1.05 }}
                  >
                    <Badge className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-300 border border-purple-500/30 backdrop-blur-sm">
                      {unreadCount} unread
                    </Badge>
                  </motion.div>
                )}
                {onClose && (
                  <Button variant="outline" size="sm" onClick={onClose} className="border-slate-700 hover:border-purple-500/50 backdrop-blur-sm">
                    <X className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </div>
          </motion.div>

          {/* Enhanced Filters and Actions */}
          <motion.div 
            className="mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <Card className="backdrop-blur-sm bg-slate-900/40 border-slate-700/50 shadow-xl shadow-purple-500/5">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                  <div className="flex flex-col sm:flex-row gap-4 flex-1">
                    <div className="relative flex-1 max-w-sm">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                      <Input
                        placeholder="Search notifications..."
                        className="pl-10 bg-slate-800/50 border-slate-600 focus:border-purple-500 text-white placeholder-slate-400"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                    
                    <Select value={selectedFilter} onValueChange={setSelectedFilter}>
                      <SelectTrigger className="w-full sm:w-48 bg-slate-800/50 border-slate-600 text-white">
                        <SelectValue placeholder="Filter by type" />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-slate-700">
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
                      <span className="text-sm text-slate-300">Unread only</span>
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    {unreadCount > 0 && (
                      <Button variant="outline" size="sm" onClick={markAllAsRead} className="border-slate-600 hover:border-purple-500 text-slate-300 hover:text-white">
                        <Check className="w-4 h-4 mr-2" />
                        Mark All Read
                      </Button>
                    )}
                    <Button variant="outline" size="sm" onClick={clearAll} className="border-slate-600 hover:border-red-500 text-slate-300 hover:text-white">
                      <Archive className="w-4 h-4 mr-2" />
                      Clear All
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Enhanced Notifications List */}
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
                  <Card className="backdrop-blur-sm bg-slate-900/40 border-slate-700/50">
                    <CardContent className="p-8">
                      <div className="w-16 h-16 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <BellOff className="w-8 h-8 text-slate-400" />
                      </div>
                      <h3 className="text-lg font-semibold mb-2 text-white">No notifications found</h3>
                      <p className="text-slate-400">
                        {searchQuery || selectedFilter !== 'all' 
                          ? "Try adjusting your search or filter criteria"
                          : "You're all caught up! New notifications will appear here."
                        }
                      </p>
                    </CardContent>
                  </Card>
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
                      whileHover={{ scale: 1.01 }}
                    >
                      <Card className={`backdrop-blur-sm border-slate-700/50 shadow-lg transition-all hover:shadow-xl hover:shadow-purple-500/10 ${
                        notification.read 
                          ? 'bg-slate-900/30' 
                          : 'bg-gradient-to-br from-purple-500/10 to-pink-500/5 border-purple-500/30'
                      }`}>
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex items-start space-x-4 flex-1">
                              <motion.div 
                                className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                                  notification.read 
                                    ? 'bg-slate-800/50' 
                                    : 'bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30'
                                }`}
                                whileHover={{ scale: 1.05 }}
                              >
                                <Icon className={`w-6 h-6 ${
                                  notification.read ? 'text-slate-400' : 'text-purple-400'
                                }`} />
                              </motion.div>
                              
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center space-x-3 mb-2">
                                  <h3 className={`font-semibold ${
                                    notification.read ? 'text-slate-300' : 'text-white'
                                  }`}>
                                    {notification.title}
                                  </h3>
                                  {!notification.read && (
                                    <div className="w-2 h-2 bg-purple-400 rounded-full flex-shrink-0" />
                                  )}
                                  <Badge 
                                    variant="secondary" 
                                    className={`text-xs ${priorityColors[notification.priority]} backdrop-blur-sm`}
                                  >
                                    {notification.priority}
                                  </Badge>
                                </div>
                                
                                <p className="text-sm text-slate-400 mb-3 line-clamp-2">
                                  {notification.message}
                                </p>
                                
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center space-x-2 text-xs text-slate-500">
                                    <Clock className="w-3 h-3" />
                                    <span>{notification.timestamp}</span>
                                  </div>
                                  
                                  {notification.action && (
                                    <Button 
                                      variant="ghost" 
                                      size="sm" 
                                      className="text-xs h-7 px-3 text-purple-400 hover:text-purple-300 hover:bg-purple-500/10"
                                    >
                                      {notification.action.label}
                                      <ArrowRight className="w-3 h-3 ml-1" />
                                    </Button>
                                  )}
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center space-x-2">
                              {!notification.read && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-8 w-8 p-0 hover:bg-purple-500/10 text-slate-400 hover:text-purple-400"
                                  onClick={() => markAsRead(notification.id)}
                                >
                                  <Check className="w-4 h-4" />
                                </Button>
                              )}
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0 text-slate-400 hover:text-red-400 hover:bg-red-500/10"
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

          {/* Enhanced Notification Settings */}
          <motion.div 
            className="mt-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Card className="backdrop-blur-sm bg-slate-900/40 border-slate-700/50 shadow-xl shadow-purple-500/5">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-white">
                  <Settings className="w-5 h-5 text-purple-400" />
                  <span>Notification Preferences</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <h4 className="font-medium text-white">Stream Notifications</h4>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-sm text-slate-300">Payment completed</span>
                          <p className="text-xs text-slate-500">When streams complete payments</p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-sm text-slate-300">Stream milestones</span>
                          <p className="text-xs text-slate-500">25%, 50%, 75% completion alerts</p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium text-white">Trading Notifications</h4>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-sm text-slate-300">Price alerts</span>
                          <p className="text-xs text-slate-500">Significant price changes</p>
                        </div>
                        <Switch />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-sm text-slate-300">Market activity</span>
                          <p className="text-xs text-slate-500">New listings and sales</p>
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
    </div>
  );
}