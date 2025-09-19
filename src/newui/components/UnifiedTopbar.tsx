import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { 
  Wallet, 
  Menu, 
  X, 
  ArrowLeft, 
  Bell, 
  Settings, 
  Home,
  LayoutDashboard,
  Plus,
  ShoppingCart,
  BarChart3
} from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ThemeToggle } from "./ThemeToggle";

type Page = "home" | "dashboard" | "create" | "marketplace" | "settings" | "analytics" | "notifications" | "onboarding";

interface UnifiedTopbarProps {
  currentPage: Page;
  onPageChange: (page: Page) => void;
  isFullscreen?: boolean;
  onBack?: () => void;
}

const pageConfig = {
  home: {
    title: "ChronoFlow",
    subtitle: "Stream Value in Real-Time",
    showLogo: true,
    showNavigation: false,
    showWallet: true,
    variant: "landing" as const,
  },
  dashboard: {
    title: "Dashboard",
    subtitle: "Manage your streams and NFTs",
    showLogo: true,
    showNavigation: true,
    showWallet: true,
    variant: "app" as const,
  },
  create: {
    title: "Create Stream",
    subtitle: "Set up a new payment stream",
    showLogo: true,
    showNavigation: true,
    showWallet: true,
    variant: "app" as const,
  },
  marketplace: {
    title: "Marketplace",
    subtitle: "Trade stream NFTs",
    showLogo: true,
    showNavigation: true,
    showWallet: true,
    variant: "app" as const,
  },
  settings: {
    title: "Settings",
    subtitle: "Manage your preferences",
    showLogo: true,
    showNavigation: true,
    showWallet: false,
    variant: "app" as const,
  },
  analytics: {
    title: "Stream Analytics",
    subtitle: "Detailed performance insights",
    showLogo: false,
    showNavigation: false,
    showWallet: false,
    variant: "fullscreen" as const,
  },
  notifications: {
    title: "Notifications",
    subtitle: "Your activity feed",
    showLogo: false,
    showNavigation: false,
    showWallet: false,
    variant: "fullscreen" as const,
  },
  onboarding: {
    title: "Welcome to ChronoFlow",
    subtitle: "Let's get you started",
    showLogo: true,
    showNavigation: false,
    showWallet: false,
    variant: "fullscreen" as const,
  },
};

export function UnifiedTopbar({ currentPage, onPageChange, isFullscreen = false, onBack }: UnifiedTopbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  
  const { scrollY } = useScroll();
  const navOpacity = useTransform(scrollY, [0, 100], [0.8, 0.95]);
  const navBlur = useTransform(scrollY, [0, 100], [8, 16]);

  const config = pageConfig[currentPage];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navigationItems = [
    { id: "dashboard" as const, label: "Dashboard", icon: LayoutDashboard },
    { id: "create" as const, label: "Create", icon: Plus },
    { id: "marketplace" as const, label: "Marketplace", icon: ShoppingCart },
  ];

  return (
    <>
      {/* Spacer div to prevent content from going under the fixed topbar */}
      <div className="h-16" />
      
      <motion.header 
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
        style={{ 
          backdropFilter: config.variant === "landing" ? `blur(${navBlur}px)` : "blur(12px)",
        }}
      >
        <motion.div 
          className={`mx-4 mt-4 mb-0 rounded-2xl transition-all duration-300 ${
            config.variant === "landing"
              ? isScrolled 
                ? "bg-background/95 border border-border/50 shadow-lg shadow-primary/5" 
                : "bg-background/80 border border-border/30"
              : "bg-background/95 border border-border/50 shadow-lg shadow-primary/5"
          }`}
          style={{ 
            opacity: config.variant === "landing" ? navOpacity : 0.98 
          }}
        >
          <div className="px-6 py-3">
            <div className="flex justify-between items-center">
              {/* Left section */}
              <div className="flex items-center space-x-4">
                {/* Back button for fullscreen pages */}
                {config.variant === "fullscreen" && onBack && (
                  <motion.button
                    onClick={onBack}
                    className="p-2 rounded-lg hover:bg-accent transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </motion.button>
                )}

                {/* Logo */}
                {config.showLogo && (
                  <motion.div 
                    className="flex items-center space-x-3"
                    whileHover={{ scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 400 }}
                    onClick={() => currentPage !== "home" && onPageChange("home")}
                    role={currentPage !== "home" ? "button" : undefined}
                  >
                    <motion.div 
                      className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center"
                      animate={{ rotate: config.variant === "landing" ? [0, 360] : 0 }}
                      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    >
                      <motion.span 
                        className="text-white font-bold text-sm"
                        animate={{ rotate: config.variant === "landing" ? [0, -360] : 0 }}
                        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                      >
                        CF
                      </motion.span>\n                    </motion.div>
                    <div className="flex flex-col">
                      <span className="text-lg font-bold bg-gradient-to-r from-foreground to-blue-400 bg-clip-text text-transparent">
                        {config.title}
                      </span>
                      {config.variant !== "landing" && (
                        <span className="text-xs text-muted-foreground -mt-1">
                          {config.subtitle}
                        </span>
                      )}
                    </div>
                  </motion.div>
                )}

                {/* Page title for fullscreen without logo */}
                {!config.showLogo && (
                  <div>
                    <h1 className="text-lg font-bold">{config.title}</h1>
                    <p className="text-sm text-muted-foreground -mt-1">{config.subtitle}</p>
                  </div>
                )}
              </div>

              {/* Center navigation for app pages */}
              {config.showNavigation && (
                <div className="hidden md:flex items-center space-x-2 bg-muted/50 rounded-full p-1">
                  {navigationItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = currentPage === item.id;
                    return (
                      <motion.button
                        key={item.id}
                        onClick={() => onPageChange(item.id)}
                        className={`flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                          isActive
                            ? "bg-primary text-primary-foreground shadow-sm"
                            : "text-muted-foreground hover:text-foreground hover:bg-accent"
                        }`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Icon className="w-4 h-4" />
                        <span className="hidden lg:inline">{item.label}</span>
                      </motion.button>
                    );
                  })}
                </div>
              )}

              {/* Right section */}
              <div className="flex items-center space-x-3">
                {/* Quick actions for app pages */}
                {config.variant === "app" && (
                  <>
                    <motion.button
                      onClick={() => onPageChange("notifications")}
                      className="relative p-2 rounded-lg hover:bg-accent transition-colors"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Bell className="w-5 h-5" />
                      <Badge className="absolute -top-1 -right-1 w-4 h-4 p-0 flex items-center justify-center text-xs bg-red-500 text-white">
                        3
                      </Badge>
                    </motion.button>

                    <motion.button
                      onClick={() => onPageChange("analytics")}
                      className="p-2 rounded-lg hover:bg-accent transition-colors"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <BarChart3 className="w-5 h-5" />
                    </motion.button>

                    <motion.button
                      onClick={() => onPageChange("settings")}
                      className="p-2 rounded-lg hover:bg-accent transition-colors"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Settings className="w-5 h-5" />
                    </motion.button>
                  </>
                )}

                {/* Theme toggle */}
                <ThemeToggle />

                {/* Connect Wallet Button */}
                {config.showWallet && (
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button 
                      variant={config.variant === "landing" ? "outline" : "default"}
                      size="sm"
                      className={`hidden md:flex items-center space-x-2 ${
                        config.variant === "landing" 
                          ? "border-primary/20 hover:border-primary/40 hover:bg-primary/5" 
                          : "bg-primary/90 hover:bg-primary"
                      } transition-all duration-300`}
                    >
                      <Wallet className="w-4 h-4" />
                      <span>Connect</span>
                    </Button>
                  </motion.div>
                )}

                {/* Mobile Menu Button */}
                <motion.button
                  className="md:hidden p-2 rounded-lg hover:bg-accent transition-colors"
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  whileTap={{ scale: 0.95 }}
                >
                  <motion.div
                    animate={{ rotate: isMenuOpen ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                  </motion.div>
                </motion.button>
              </div>
            </div>
          </div>

          {/* Mobile Menu */}
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ 
              opacity: isMenuOpen ? 1 : 0, 
              height: isMenuOpen ? "auto" : 0 
            }}
            transition={{ duration: 0.3 }}
            className="md:hidden overflow-hidden border-t border-border/50"
          >
            <div className="p-4 space-y-3">
              {/* Mobile navigation */}
              {config.showNavigation && (
                <div className="space-y-2">
                  {navigationItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = currentPage === item.id;
                    return (
                      <motion.button
                        key={item.id}
                        onClick={() => {
                          onPageChange(item.id);
                          setIsMenuOpen(false);
                        }}
                        className={`flex items-center space-x-3 w-full p-3 rounded-lg text-left transition-all ${
                          isActive
                            ? "bg-primary text-primary-foreground"
                            : "hover:bg-accent"
                        }`}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Icon className="w-5 h-5" />
                        <span>{item.label}</span>
                      </motion.button>
                    );
                  })}
                </div>
              )}

              {/* Mobile wallet button */}
              {config.showWallet && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ 
                    opacity: isMenuOpen ? 1 : 0, 
                    y: isMenuOpen ? 0 : 20 
                  }}
                  transition={{ delay: 0.1 }}
                >
                  <Button className="w-full flex items-center justify-center space-x-2">
                    <Wallet className="w-4 h-4" />
                    <span>Connect Wallet</span>
                  </Button>
                </motion.div>
              )}

              {/* Mobile quick actions */}
              {config.variant === "app" && (
                <div className="flex space-x-2 pt-2 border-t border-border/30">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1"
                    onClick={() => {
                      onPageChange("notifications");
                      setIsMenuOpen(false);
                    }}
                  >
                    <Bell className="w-4 h-4 mr-2" />
                    Notifications
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1"
                    onClick={() => {
                      onPageChange("settings");
                      setIsMenuOpen(false);
                    }}
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    Settings
                  </Button>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      </motion.header>
    </>
  );
}