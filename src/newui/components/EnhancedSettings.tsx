import { useState } from "react";
import { 
  Monitor, 
  Moon, 
  Sun, 
  User, 
  Shield, 
  Bell, 
  CreditCard, 
  Database, 
  Globe, 
  Lock,
  Wallet,
  Settings as SettingsIcon,
  Check,
  AlertTriangle,
  Info,
  ExternalLink,
  RefreshCw,
  Zap,
  Target,
  Activity
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import { Badge } from "./ui/badge";
import { Switch } from "./ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Input } from "./ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Alert, AlertDescription } from "./ui/alert";
import { useTheme } from "./ThemeProvider";
import { motion } from "framer-motion";

interface WalletConnection {
  address: string;
  balance: number;
  network: string;
  connected: boolean;
}

export function EnhancedSettings() {
  const { theme, setTheme } = useTheme();
  const [notifications, setNotifications] = useState({
    streamAlerts: true,
    priceAlerts: false,
    transactionUpdates: true,
    marketingEmails: false
  });
  const [walletConnections] = useState<WalletConnection[]>([
    {
      address: "0x742d35cc6bf4532c96582bcd6181ea71654f6f46",
      balance: 2.45,
      network: "Somnia",
      connected: true
    }
  ]);

  const themeOptions = [
    {
      value: "light" as const,
      label: "Light",
      icon: Sun,
      description: "Clean and bright interface"
    },
    {
      value: "dark" as const,
      label: "Dark",  
      icon: Moon,
      description: "Easy on the eyes"
    },
    {
      value: "system" as const,
      label: "System",
      icon: Monitor,
      description: "Follows your device settings"
    }
  ];

  const handleNotificationChange = (key: keyof typeof notifications) => {
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="min-h-screen bg-background pt-8 pb-24 lg:pb-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
              <SettingsIcon className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Settings</h1>
              <p className="text-muted-foreground">
                Manage your ChronoFlow preferences and account settings
              </p>
            </div>
          </div>
        </motion.div>

        <Tabs defaultValue="general" className="space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-5">
              <TabsTrigger value="general">General</TabsTrigger>
              <TabsTrigger value="wallet">Wallet</TabsTrigger>
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
              <TabsTrigger value="advanced">Advanced</TabsTrigger>
            </TabsList>
          </motion.div>

          {/* General Settings */}
          <TabsContent value="general" className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Monitor className="w-5 h-5" />
                    <span>Appearance</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label className="text-base font-medium mb-4 block">Theme</Label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {themeOptions.map((option) => {
                        const Icon = option.icon;
                        return (
                          <Card
                            key={option.value}
                            className={`cursor-pointer transition-all border-2 ${
                              theme === option.value 
                                ? "border-primary bg-primary/5" 
                                : "border-border hover:border-primary/20"
                            }`}
                            onClick={() => setTheme(option.value)}
                          >
                            <CardContent className="p-4 text-center">
                              <Icon className="w-8 h-8 mx-auto mb-2" />
                              <h3 className="font-medium mb-1">{option.label}</h3>
                              <p className="text-sm text-muted-foreground">
                                {option.description}
                              </p>
                              {theme === option.value && (
                                <div className="mt-2">
                                  <Badge className="bg-primary/20 text-primary">
                                    <Check className="w-3 h-3 mr-1" />
                                    Active
                                  </Badge>
                                </div>
                              )}
                            </CardContent>
                          </Card>
                        );
                      })}
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <Label className="text-base font-medium">Interface Preferences</Label>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label>Compact Mode</Label>
                          <p className="text-sm text-muted-foreground">
                            Show more content in less space
                          </p>
                        </div>
                        <Switch />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <Label>Animations</Label>
                          <p className="text-sm text-muted-foreground">
                            Enable smooth transitions and effects
                          </p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Globe className="w-5 h-5" />
                    <span>Regional Settings</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Language</Label>
                      <Select defaultValue="en">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="en">English</SelectItem>
                          <SelectItem value="es">Español</SelectItem>
                          <SelectItem value="fr">Français</SelectItem>
                          <SelectItem value="de">Deutsch</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Currency</Label>
                      <Select defaultValue="usd">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="usd">USD ($)</SelectItem>
                          <SelectItem value="eur">EUR (€)</SelectItem>
                          <SelectItem value="gbp">GBP (£)</SelectItem>
                          <SelectItem value="jpy">JPY (¥)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          {/* Wallet Settings */}
          <TabsContent value="wallet" className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Wallet className="w-5 h-5" />
                    <span>Connected Wallets</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {walletConnections.map((wallet, index) => (
                    <div key={index} className="p-4 rounded-lg border border-border/50 bg-muted/30">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                            <Wallet className="w-5 h-5 text-primary" />
                          </div>
                          <div>
                            <div className="flex items-center space-x-2">
                              <span className="font-medium font-mono text-sm">
                                {wallet.address.slice(0, 6)}...{wallet.address.slice(-4)}
                              </span>
                              <Badge className="bg-green-500/20 text-green-600 border-green-500/20">
                                <Check className="w-3 h-3 mr-1" />
                                Connected
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {wallet.network} Network
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold">{wallet.balance} ETH</div>
                          <p className="text-sm text-muted-foreground">Balance</p>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          <RefreshCw className="w-4 h-4 mr-2" />
                          Refresh
                        </Button>
                        <Button variant="outline" size="sm">
                          <ExternalLink className="w-4 h-4 mr-2" />
                          View on Explorer
                        </Button>
                      </div>
                    </div>
                  ))}
                  
                  <Button variant="outline" className="w-full">
                    <Wallet className="w-4 h-4 mr-2" />
                    Connect Additional Wallet
                  </Button>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Target className="w-5 h-5" />
                    <span>Gas Preferences</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Default Gas Strategy</Label>
                    <Select defaultValue="standard">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="slow">Slow (Lower fees)</SelectItem>
                        <SelectItem value="standard">Standard</SelectItem>
                        <SelectItem value="fast">Fast (Higher fees)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <Alert>
                    <Zap className="h-4 w-4" />
                    <AlertDescription>
                      On Somnia Network, gas fees are consistently low (avg. $0.002) 
                      with sub-second confirmation times.
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          {/* Notifications */}
          <TabsContent value="notifications" className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Bell className="w-5 h-5" />
                    <span>Notification Preferences</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Stream Alerts</Label>
                        <p className="text-sm text-muted-foreground">
                          Get notified when streams start, pause, or complete
                        </p>
                      </div>
                      <Switch 
                        checked={notifications.streamAlerts}
                        onCheckedChange={() => handleNotificationChange('streamAlerts')}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Price Alerts</Label>
                        <p className="text-sm text-muted-foreground">
                          Notify when stream NFT prices change significantly
                        </p>
                      </div>
                      <Switch 
                        checked={notifications.priceAlerts}
                        onCheckedChange={() => handleNotificationChange('priceAlerts')}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Transaction Updates</Label>
                        <p className="text-sm text-muted-foreground">
                          Updates on transaction status and confirmations
                        </p>
                      </div>
                      <Switch 
                        checked={notifications.transactionUpdates}
                        onCheckedChange={() => handleNotificationChange('transactionUpdates')}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Marketing Communications</Label>
                        <p className="text-sm text-muted-foreground">
                          Product updates and ChronoFlow news
                        </p>
                      </div>
                      <Switch 
                        checked={notifications.marketingEmails}
                        onCheckedChange={() => handleNotificationChange('marketingEmails')}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          {/* Security */}
          <TabsContent value="security" className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Shield className="w-5 h-5" />
                    <span>Security Settings</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <Alert>
                    <Info className="h-4 w-4" />
                    <AlertDescription>
                      ChronoFlow uses advanced security measures including multi-signature 
                      wallets and audited smart contracts to protect your funds.
                    </AlertDescription>
                  </Alert>

                  <div className="space-y-4">
                    <div className="p-4 rounded-lg border border-green-500/20 bg-green-500/5">
                      <div className="flex items-center space-x-3 mb-2">
                        <Check className="w-5 h-5 text-green-600" />
                        <span className="font-medium">Smart Contract Security</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        All contracts audited by OpenZeppelin and Consensys Diligence
                      </p>
                    </div>
                    
                    <div className="p-4 rounded-lg border border-green-500/20 bg-green-500/5">
                      <div className="flex items-center space-x-3 mb-2">
                        <Check className="w-5 h-5 text-green-600" />
                        <span className="font-medium">Somnia Network Security</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Enterprise-grade blockchain with 99.97% uptime
                      </p>
                    </div>
                    
                    <div className="p-4 rounded-lg border border-green-500/20 bg-green-500/5">
                      <div className="flex items-center space-x-3 mb-2">
                        <Check className="w-5 h-5 text-green-600" />
                        <span className="font-medium">Non-Custodial</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        You maintain full control of your funds at all times
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          {/* Advanced */}
          <TabsContent value="advanced" className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Activity className="w-5 h-5" />
                    <span>Network Configuration</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>RPC Endpoint</Label>
                    <Input 
                      value="https://rpc.somnia.network" 
                      readOnly 
                      className="font-mono text-sm"
                    />
                    <p className="text-xs text-muted-foreground">
                      Official Somnia Network RPC endpoint
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Chain ID</Label>
                    <Input 
                      value="1234" 
                      readOnly 
                      className="font-mono text-sm"
                    />
                  </div>

                  <Alert>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      Advanced settings are managed automatically. Manual changes 
                      may affect application functionality.
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Database className="w-5 h-5" />
                    <span>Data Management</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Cache Size</Label>
                      <p className="text-sm text-muted-foreground">
                        Local data storage: 45.2 MB
                      </p>
                    </div>
                    <Button variant="outline" size="sm">
                      Clear Cache
                    </Button>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Export Data</Label>
                      <p className="text-sm text-muted-foreground">
                        Download your transaction history and settings
                      </p>
                    </div>
                    <Button variant="outline" size="sm">
                      <Database className="w-4 h-4 mr-2" />
                      Export
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}