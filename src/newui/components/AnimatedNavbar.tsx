import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Wallet, Menu, X } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";

export function AnimatedNavbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  
  const { scrollY } = useScroll();
  const navOpacity = useTransform(scrollY, [0, 100], [0.8, 0.95]);
  const navBlur = useTransform(scrollY, [0, 100], [8, 16]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.header 
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{ 
        backdropFilter: `blur(${navBlur}px)`,
      }}
    >
      <motion.div 
        className={`transition-all duration-300 ${
          isScrolled 
            ? "bg-background/95 border-b border-border/50 shadow-lg shadow-primary/5" 
            : "bg-transparent"
        }`}
        style={{ opacity: navOpacity }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <motion.div 
              className="flex items-center space-x-3"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              <motion.div 
                className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center"
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              >
                <motion.span 
                  className="text-white font-bold text-sm"
                  animate={{ rotate: [0, -360] }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                >
                  CF
                </motion.span>
              </motion.div>
              <span className="text-xl font-bold bg-gradient-to-r from-foreground to-blue-400 bg-clip-text text-transparent">
                ChronoFlow
              </span>
            </motion.div>

            {/* Spacer for centered logo */}
            <div className="hidden md:block flex-1" />

            {/* Connect Wallet Button */}
            <div className="flex items-center space-x-4">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button 
                  variant="outline" 
                  className="hidden md:flex items-center space-x-2 border-primary/20 hover:border-primary/40 hover:bg-primary/5 transition-all duration-300"
                >
                  <Wallet className="w-4 h-4" />
                  <span>Connect Wallet</span>
                </Button>
              </motion.div>

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
          className="md:hidden overflow-hidden bg-background/95 backdrop-blur-xl border-t border-border/50"
        >
          <div className="px-4 py-6">
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
          </div>
        </motion.div>
      </motion.div>
    </motion.header>
  );
}