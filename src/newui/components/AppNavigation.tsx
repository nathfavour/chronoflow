import { LayoutDashboard, Plus, ShoppingCart, Home, Settings, Bell, BarChart3 } from "lucide-react";
import { Badge } from "./ui/badge";

type Page = "home" | "dashboard" | "create" | "marketplace" | "settings" | "analytics" | "notifications";

interface AppNavigationProps {
  currentPage: Page;
  onPageChange: (page: Page) => void;
}

export function AppNavigation({ currentPage, onPageChange }: AppNavigationProps) {
  const navItems = [
    {
      id: "dashboard" as const,
      label: "Dashboard",
      icon: LayoutDashboard,
    },
    {
      id: "create" as const,
      label: "Create",
      icon: Plus,
    },
    {
      id: "marketplace" as const,
      label: "Marketplace",
      icon: ShoppingCart,
    },
  ];

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex lg:fixed lg:top-16 lg:bottom-0 lg:left-0 lg:z-40 lg:w-72">
        <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-sidebar border-r border-sidebar-border px-6 py-8">
          {/* Logo/Brand */}
          <div className="flex h-16 shrink-0 items-center">
            <h2 className="text-xl font-bold text-sidebar-foreground">ChronoFlow</h2>
          </div>
          
          {/* Navigation */}
          <nav className="flex flex-1 flex-col">
            <ul role="list" className="flex flex-1 flex-col gap-y-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentPage === item.id;
                
                return (
                  <li key={item.id}>
                    <button
                      onClick={() => onPageChange(item.id)}
                      className={`group flex gap-x-3 rounded-lg p-3 w-full text-left transition-all hover:bg-sidebar-accent ${
                        isActive
                          ? "bg-sidebar-primary text-sidebar-primary-foreground"
                          : "text-sidebar-foreground hover:text-sidebar-accent-foreground"
                      }`}
                    >
                      <Icon
                        className={`h-5 w-5 shrink-0 ${
                          isActive ? "text-sidebar-primary-foreground" : "text-sidebar-foreground group-hover:text-sidebar-accent-foreground"
                        }`}
                      />
                      <span className="truncate">{item.label}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
            
            {/* Quick Actions */}
            <div className="pt-4 border-t border-sidebar-border space-y-2">
              <button
                onClick={() => onPageChange("notifications")}
                className={`group flex gap-x-3 rounded-lg p-3 w-full text-left transition-all hover:bg-sidebar-accent ${
                  currentPage === "notifications"
                    ? "bg-sidebar-primary text-sidebar-primary-foreground"
                    : "text-sidebar-foreground hover:text-sidebar-accent-foreground"
                }`}
              >
                <div className="relative">
                  <Bell
                    className={`h-5 w-5 shrink-0 ${
                      currentPage === "notifications" ? "text-sidebar-primary-foreground" : "text-sidebar-foreground group-hover:text-sidebar-accent-foreground"
                    }`}
                  />
                  <Badge className="absolute -top-2 -right-2 w-4 h-4 p-0 flex items-center justify-center text-xs bg-red-500 text-white">
                    3
                  </Badge>
                </div>
                <span className="truncate">Notifications</span>
              </button>
            </div>
            
            {/* Bottom section */}
            <div className="mt-auto pt-4 border-t border-sidebar-border space-y-2">
              <button
                onClick={() => onPageChange("settings")}
                className={`group flex gap-x-3 rounded-lg p-3 w-full text-left transition-all hover:bg-sidebar-accent ${
                  currentPage === "settings"
                    ? "bg-sidebar-primary text-sidebar-primary-foreground"
                    : "text-sidebar-foreground hover:text-sidebar-accent-foreground"
                }`}
              >
                <Settings
                  className={`h-5 w-5 shrink-0 ${
                    currentPage === "settings" ? "text-sidebar-primary-foreground" : "text-sidebar-foreground group-hover:text-sidebar-accent-foreground"
                  }`}
                />
                <span className="truncate">Settings</span>
              </button>
              
              <button
                onClick={() => onPageChange("home")}
                className="group flex gap-x-3 rounded-lg p-3 w-full text-left text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-all"
              >
                <Home className="h-5 w-5 shrink-0 text-sidebar-foreground group-hover:text-sidebar-accent-foreground" />
                <span className="truncate">Back to Home</span>
              </button>
            </div>
          </nav>
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="lg:hidden fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50">
        <div className="flex space-x-3 bg-background/95 backdrop-blur-md border-2 border-primary/20 rounded-full p-4 shadow-2xl shadow-primary/10">
          <button
            onClick={() => onPageChange("home")}
            className={`p-3 rounded-full transition-all hover:scale-105 ${
              currentPage === "home" 
                ? "bg-primary text-primary-foreground shadow-lg" 
                : "text-foreground hover:bg-primary/10 hover:text-primary"
            }`}
            title="Home"
          >
            <Home className="w-5 h-5" />
          </button>
          
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => onPageChange(item.id)}
                className={`p-3 rounded-full transition-all hover:scale-105 ${
                  isActive 
                    ? "bg-primary text-primary-foreground shadow-lg" 
                    : "text-foreground hover:bg-primary/10 hover:text-primary"
                }`}
                title={item.label}
              >
                <Icon className="w-5 h-5" />
              </button>
            );
          })}
          
          {/* Notifications button */}
          <button
            onClick={() => onPageChange("notifications")}
            className={`p-3 rounded-full transition-all hover:scale-105 relative ${
              currentPage === "notifications" 
                ? "bg-primary text-primary-foreground shadow-lg" 
                : "text-foreground hover:bg-primary/10 hover:text-primary"
            }`}
            title="Notifications"
          >
            <Bell className="w-5 h-5" />
            <Badge className="absolute -top-1 -right-1 w-4 h-4 p-0 flex items-center justify-center text-xs bg-red-500 text-white">
              3
            </Badge>
          </button>
          
          {/* Settings button */}
          <button
            onClick={() => onPageChange("settings")}
            className={`p-3 rounded-full transition-all hover:scale-105 ${
              currentPage === "settings" 
                ? "bg-primary text-primary-foreground shadow-lg" 
                : "text-foreground hover:bg-primary/10 hover:text-primary"
            }`}
            title="Settings"
          >
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </div>
    </>
  );
}