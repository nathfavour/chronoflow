import { Monitor, Moon, Sun, User, Shield, Bell, CreditCard, Database, Globe, Lock } from "lucide-react";
import { Card } from "./ui/card";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import { Badge } from "./ui/badge";
import { useTheme } from "./ThemeProvider";

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
              {themeOptions.map((option) => {
                const Icon = option.icon;
                return (
                  <Button
                    key={option.value}
                    variant={theme === option.value ? "default" : "outline"}
                    size="sm"
                    onClick={() => setTheme(option.value)}
                    className="flex items-center gap-2"
                  >
                    <Icon className="w-4 h-4" />
                    {option.label}
                  </Button>
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
            <Button variant="outline" size="sm" disabled className="opacity-50">
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
            <Button variant="outline" size="sm" disabled className="opacity-50">
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
            <Button variant="outline" size="sm" disabled className="opacity-50">
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
            <Button variant="outline" size="sm" disabled className="opacity-50">
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
            <Button variant="outline" size="sm" disabled className="opacity-50">
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
            <Button variant="outline" size="sm" disabled className="opacity-50">
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
            <Button variant="outline" size="sm" disabled className="opacity-50">
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
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl mb-2">Settings</h1>
        <p className="text-muted-foreground">
          Manage your ChronoFlow preferences and account settings
        </p>
      </div>

      <div className="space-y-8">
        {settingSections.map((section, sectionIndex) => (
          <div key={sectionIndex}>
            <div className="mb-4">
              <h2 className="text-xl mb-1">{section.title}</h2>
            </div>
            
            <div className="space-y-4">
              {section.items.map((item, itemIndex) => (
                <Card key={itemIndex} className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Label className="text-base">{item.title}</Label>
                        {item.requiresAuth && (
                          <Badge variant="secondary" className="text-xs">
                            Requires Account
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mb-4">
                        {item.description}
                      </p>
                    </div>
                    <div className="flex-shrink-0">
                      {item.component}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
            
            {sectionIndex < settingSections.length - 1 && (
              <Separator className="mt-8" />
            )}
          </div>
        ))}
      </div>

      {/* Authentication Notice */}
      <Card className="mt-8 p-6 border-muted-foreground/20">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0 mt-0.5">
            <Lock className="w-4 h-4 text-muted-foreground" />
          </div>
          <div>
            <h3 className="text-sm mb-1">Account Required</h3>
            <p className="text-sm text-muted-foreground mb-3">
              Connect your wallet and create an account to access advanced settings and personalization options.
            </p>
            <Button size="sm" disabled className="opacity-50">
              Connect Wallet
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}