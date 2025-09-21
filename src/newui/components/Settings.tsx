import { Monitor, Moon, Sun, User, Shield, Bell, CreditCard, Database, Globe, Lock } from "lucide-react";
import { Card } from "./ui/card";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { ConnectButton } from "./ConnectButton";
import { Separator } from "./ui/separator";
import { Badge } from "./ui/badge";
import { useTheme } from "./ThemeProvider";
import { motion } from "framer-motion";

export function Settings() {
  const { theme, setTheme } = useTheme();

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

  type SettingItem = {
  title: string;
  description: string;
  component: React.ReactNode;
  available: boolean;
  requiresAuth?: boolean;
};

type SettingSection = {
  title: string;
  items: SettingItem[];
};

const settingSections: SettingSection[] = [
    {
      title: "Appearance",
      items: [
        {
          title: "Theme",
          description: "Choose your preferred color scheme",
          component: (
            <div className="flex gap-2">
              {themeOptions.map((option, index) => {
                const Icon = option.icon;
                return (
                  <motion.div
                    key={option.value}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      variant={theme === option.value ? "default" : "outline"}
                      size="sm"
                      onClick={() => setTheme(option.value)}
                      className={`flex items-center gap-2 backdrop-blur-sm transition-all duration-300 ${
                        theme === option.value 
                          ? 'bg-gradient-to-r from-primary to-primary/80 shadow-lg' 
                          : 'hover:bg-secondary/80 hover:border-border/70'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      {option.label}
                    </Button>
                  </motion.div>
                );
              })}
            </div>
          ),
          available: true
        }
      ]
    },
    {
      title: "Account",
      items: [
        {
          title: "Profile Settings",
          description: "Manage your profile information and preferences",
          component: (
            <Button variant="outline" size="sm" disabled className="opacity-50 backdrop-blur-sm hover:bg-secondary/20 transition-all duration-300">
              <User className="w-4 h-4 mr-2" />
              Edit Profile
            </Button>
          ),
          available: false,
          requiresAuth: true
        },
        {
          title: "Security",
          description: "Two-factor authentication and security preferences",
          component: (
            <Button variant="outline" size="sm" disabled className="opacity-50 backdrop-blur-sm hover:bg-secondary/20 transition-all duration-300">
              <Shield className="w-4 h-4 mr-2" />
              Security Settings
            </Button>
          ),
          available: false,
          requiresAuth: true
        }
      ]
    },
    {
      title: "Notifications",
      items: [
        {
          title: "Push Notifications",
          description: "Manage stream alerts and transaction notifications",
          component: (
            <Button variant="outline" size="sm" disabled className="opacity-50 backdrop-blur-sm hover:bg-secondary/20 transition-all duration-300">
              <Bell className="w-4 h-4 mr-2" />
              Configure
            </Button>
          ),
          available: false,
          requiresAuth: true
        }
      ]
    },
    {
      title: "Billing & Payments",
      items: [
        {
          title: "Payment Methods",
          description: "Manage your connected wallets and payment options",
          component: (
            <Button variant="outline" size="sm" disabled className="opacity-50 backdrop-blur-sm hover:bg-secondary/20 transition-all duration-300">
              <CreditCard className="w-4 h-4 mr-2" />
              Manage
            </Button>
          ),
          available: false,
          requiresAuth: true
        }
      ]
    },
    {
      title: "Data & Privacy",
      items: [
        {
          title: "Data Export",
          description: "Download your stream data and transaction history",
          component: (
            <Button variant="outline" size="sm" disabled className="opacity-50 backdrop-blur-sm hover:bg-secondary/20 transition-all duration-300">
              <Database className="w-4 h-4 mr-2" />
              Export Data
            </Button>
          ),
          available: false,
          requiresAuth: true
        },
        {
          title: "Privacy Settings",
          description: "Control data sharing and analytics preferences",
          component: (
            <Button variant="outline" size="sm" disabled className="opacity-50 backdrop-blur-sm hover:bg-secondary/20 transition-all duration-300">
              <Lock className="w-4 h-4 mr-2" />
              Privacy
            </Button>
          ),
          available: false,
          requiresAuth: true
        }
      ]
    },
    {
      title: "Advanced",
      items: [
        {
          title: "Network Settings",
          description: "Configure blockchain network and RPC preferences",
          component: (
            <Button variant="outline" size="sm" disabled className="opacity-50 backdrop-blur-sm hover:bg-secondary/20 transition-all duration-300">
              <Globe className="w-4 h-4 mr-2" />
              Network Config
            </Button>
          ),
          available: false,
          requiresAuth: true
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-background/50 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-500/5 via-transparent to-purple-500/5" />
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-full blur-3xl" />
      
      <div className="relative z-10 p-6 max-w-4xl mx-auto">
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-foreground via-foreground to-foreground/70 bg-clip-text text-transparent">
            Settings
          </h1>
          <p className="text-muted-foreground text-lg">
            Manage your ChronoFlow preferences and account settings
          </p>
        </motion.div>

        <div className="space-y-8">
          {settingSections.map((section, sectionIndex) => (
            <motion.div 
              key={sectionIndex}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: sectionIndex * 0.1 }}
            >
              <div className="mb-6">
                <h2 className="text-2xl font-semibold mb-1 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                  {section.title}
                </h2>
              </div>
              
              <div className="space-y-4">
                {section.items.map((item, itemIndex) => (
                  <motion.div
                    key={itemIndex}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: (sectionIndex * 0.1) + (itemIndex * 0.05) }}
                    whileHover={{ scale: 1.02 }}
                  >
                    <Card className="p-6 backdrop-blur-sm bg-card/80 border border-border/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:bg-card/90 hover:border-border/70">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Label className="text-base font-medium">{item.title}</Label>
                            {item.requiresAuth && (
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ duration: 0.3, delay: 0.2 }}
                              >
                                <Badge variant="secondary" className="text-xs backdrop-blur-sm">
                                  Requires Account
                                </Badge>
                              </motion.div>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground mb-4">
                            {item.description}
                          </p>
                        </div>
                        <motion.div 
                          className="flex-shrink-0"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          {item.component}
                        </motion.div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
              
              {sectionIndex < settingSections.length - 1 && (
                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.8, delay: (sectionIndex + 1) * 0.1 }}
                  className="mt-8 origin-left"
                >
                  <Separator className="bg-gradient-to-r from-transparent via-border to-transparent" />
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Authentication Notice */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          whileHover={{ scale: 1.02 }}
        >
          <Card className="mt-8 p-6 border-muted-foreground/20 backdrop-blur-sm bg-card/60 shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="flex items-start gap-3">
              <motion.div 
                className="w-10 h-10 rounded-full bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center flex-shrink-0 mt-0.5 shadow-inner"
                whileHover={{ rotate: 10, scale: 1.1 }}
                transition={{ duration: 0.3 }}
              >
                <Lock className="w-5 h-5 text-muted-foreground" />
              </motion.div>
              <div className="flex-1">
                <h3 className="text-base font-medium mb-1">Account Required</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Connect your wallet and create an account to access advanced settings and personalization options.
                </p>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <ConnectButton size="sm" className="justify-center" />
                </motion.div>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}