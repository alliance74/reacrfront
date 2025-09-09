import { Button } from "@/components/ui/button";
import { MessageSquare, User, Menu, X, LogOut } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate, Link } from "react-router-dom";

export const Header = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Failed to log out', error);
    }
  };
  
  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass border-b border-border/20 backdrop-blur-xl">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center shadow-glow">
              <MessageSquare className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
              RizzChat
            </span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/#features" className="text-muted-foreground hover:text-foreground transition-smooth">
              Features
            </Link>
            <Link to="/pricing" className="text-muted-foreground hover:text-foreground transition-smooth">
              Pricing
            </Link>
            <Link to="/referrals" className="text-muted-foreground hover:text-foreground transition-smooth">
              Referrals
            </Link>
            {currentUser && (
              <Link to="/dashboard" className="text-muted-foreground hover:text-foreground transition-smooth">
                Dashboard
              </Link>
            )}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-3">
            <ThemeToggle />
            {currentUser ? (
              <>
                <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard')}>
                  Dashboard
                </Button>
                <Button variant="ghost" size="sm" onClick={() => navigate('/profile')}>
                  <User className="w-4 h-4 mr-2" />
                  Profile
                </Button>
                <Button variant="ghost" size="sm" onClick={handleLogout}>
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button variant="ghost" size="sm" onClick={() => navigate('/login')}>
                  Sign In
                </Button>
                <Button variant="default" size="sm" onClick={() => navigate('/signup')} className="bg-primary hover:bg-primary/90">
                  Get Started
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="relative z-50 md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="fixed inset-0 bg-pink backdrop-blur-sm z-40 pt-16">
            <div className="container mx-auto px-4 py-6 space-y-6">
              <nav className="flex flex-col space-y-4">
                <Link
                  to="/#features"
                  className="text-lg py-2 px-4 rounded-lg hover:bg-accent transition-smooth block"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Features
                </Link>
                <Link
                  to="/pricing"
                  className="text-lg py-2 px-4 rounded-lg hover:bg-accent transition-smooth block"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Pricing
                </Link>
                <Link
                  to="/referrals"
                  className="text-lg py-2 px-4 rounded-lg hover:bg-accent transition-smooth block"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Referrals
                </Link>
                {currentUser && (
                  <Link
                    to="/dashboard"
                    className="text-lg py-2 px-4 rounded-lg hover:bg-accent transition-smooth block"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                )}
                {currentUser && (
                  <Link
                    to="/profile"
                    className="text-lg py-2 px-4 rounded-lg hover:bg-accent transition-smooth block"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Profile
                  </Link>
                )}
              </nav>

              <div className="pt-4 border-t border-border/20">
                <div className="flex flex-col space-y-3">
                  {currentUser ? (
                    <Button
                      variant="outline"
                      size="lg"
                      className="w-full"
                      onClick={async () => {
                        await logout();
                        setIsMenuOpen(false);
                        navigate('/');
                      }}
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Logout
                    </Button>
                  ) : (
                    <>
                      <Button
                        variant="outline"
                        size="lg"
                        className="w-full"
                        onClick={() => {
                          navigate('/login');
                          setIsMenuOpen(false);
                        }}
                      >
                        Sign In
                      </Button>
                      <Button
                        variant="default"
                        size="lg"
                        className="w-full bg-primary hover:bg-primary/90"
                        onClick={() => {
                          navigate('/signup');
                          setIsMenuOpen(false);
                        }}
                      >
                        Get Started
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};