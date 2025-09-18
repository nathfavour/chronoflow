import { Wallet } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Logo from '@/components/icons/logo';

export default function Header() {
  return (
    <header className="sticky top-0 z-50 flex h-16 items-center gap-4 border-b border-border/20 bg-background/80 px-4 backdrop-blur-sm md:px-6">
      <nav className="flex w-full items-center justify-between">
        <a href="#" className="flex items-center gap-2">
          <Logo className="h-6 w-6 text-accent" />
          <span className="text-lg font-bold text-foreground">ChronoFlow</span>
        </a>
        <Button>
          <Wallet className="mr-2 h-4 w-4" />
          Connect Wallet
        </Button>
      </nav>
    </header>
  );
}
