"use client";

import { useState } from "react";
import { Wallet, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="w-full bg-background/60 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">CF</span>
            </div>
            <span className="font-semibold text-lg">ChronoFlow</span>
          </div>

          <nav className="hidden md:flex items-center space-x-6">
            <a className="text-foreground hover:text-primary" href="#">Dashboard</a>
            <a className="text-foreground hover:text-primary" href="#">Create</a>
            <a className="text-foreground hover:text-primary" href="#">Marketplace</a>
          </nav>

          <div className="hidden md:flex items-center space-x-3">
            <ThemeToggle />
            <Button className="flex items-center space-x-2">
              <Wallet size={16} />
              <span>Connect</span>
            </Button>
          </div>

          <button className="md:hidden" onClick={() => setOpen(!open)}>
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {open && (
          <div className="md:hidden py-4">
            <div className="flex flex-col space-y-3">
              <a className="text-foreground" href="#">Dashboard</a>
              <a className="text-foreground" href="#">Create</a>
              <a className="text-foreground" href="#">Marketplace</a>
              <div className="flex items-center justify-center pt-2">
                <ThemeToggle />
              </div>
              <div className="pt-2">
                <Button className="w-full">Connect</Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
