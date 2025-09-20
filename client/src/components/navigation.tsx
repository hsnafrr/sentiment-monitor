import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Crosshair, Menu } from "lucide-react";
import { useState } from "react";

export function Navigation() {
  const [location] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 w-full z-50 bg-background/90 backdrop-blur-sm border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center space-x-4" data-testid="link-home">
            <Crosshair className="text-primary text-xl" />
            <span className="font-orbitron font-bold text-lg">MI SENTINEL</span>
          </Link>
          
          <div className="hidden md:flex items-center space-x-6">
            <Link 
              href="/" 
              className={`text-muted-foreground hover:text-primary transition-colors ${
                location === "/" ? "text-primary" : ""
              }`}
              data-testid="link-mission"
            >
              Mission Brief
            </Link>
            <Link 
              href="/dashboard" 
              className={`text-muted-foreground hover:text-primary transition-colors ${
                location === "/dashboard" ? "text-primary" : ""
              }`}
              data-testid="link-dashboard"
            >
              Dashboard
            </Link>
            <Button 
              className="bg-primary text-primary-foreground px-4 py-2 rounded font-medium hover:bg-accent transition-colors glow-red"
              data-testid="button-access"
            >
              Access Granted
            </Button>
          </div>
          
          <button 
            className="md:hidden text-primary"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            data-testid="button-mobile-menu"
          >
            <Menu />
          </button>
        </div>
        
        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-border bg-card">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link 
                href="/" 
                className="block px-3 py-2 text-muted-foreground hover:text-primary transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
                data-testid="link-mobile-mission"
              >
                Mission Brief
              </Link>
              <Link 
                href="/dashboard" 
                className="block px-3 py-2 text-muted-foreground hover:text-primary transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
                data-testid="link-mobile-dashboard"
              >
                Dashboard
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
