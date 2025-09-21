import { Button } from "./ui/button";
import { ConnectButton } from "./ConnectButton";
import { Wallet, Menu, X } from "lucide-react";
import { useState } from "react";

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">CF</span>
            </div>
            <span className="text-xl font-bold">ChronoFlow</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="#" className="text-foreground hover:text-primary transition-colors">
              Dashboard
            </a>
            <a href="#" className="text-foreground hover:text-primary transition-colors">
              Create Stream
            </a>
            <a href="#" className="text-foreground hover:text-primary transition-colors">
              Marketplace
            </a>
            <a href="#" className="text-foreground hover:text-primary transition-colors">
              Analytics
            </a>
          </div>

          {/* Connect Wallet Button */}
          <div className="hidden md:flex">
            <ConnectButton size="sm" />
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-16 left-0 right-0 bg-background border-b border-border">
            <div className="flex flex-col space-y-4 p-4">
              <a href="#" className="text-foreground hover:text-primary transition-colors">
                Dashboard
              </a>
              <a href="#" className="text-foreground hover:text-primary transition-colors">
                Create Stream
              </a>
              <a href="#" className="text-foreground hover:text-primary transition-colors">
                Marketplace
              </a>
              <a href="#" className="text-foreground hover:text-primary transition-colors">
                Analytics
              </a>
              <ConnectButton size="sm" className="w-full justify-center" />
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}