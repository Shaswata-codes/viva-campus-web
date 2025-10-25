import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { Home, Calendar, MessageSquare, MessageCircle, LogOut } from "lucide-react";

const Navigation = () => {
  const location = useLocation();
  const { user, signOut } = useAuth();

  const isActive = (path: string) => location.pathname === path;

  if (!user) return null;

  return (
    <nav className="border-b bg-card shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-8">
            <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Campus Life Hub
            </h1>
            <div className="flex gap-1">
              <Link to="/">
                <Button
                  variant={isActive("/") ? "default" : "ghost"}
                  size="sm"
                  className="gap-2"
                >
                  <Home className="h-4 w-4" />
                  Dashboard
                </Button>
              </Link>
              <Link to="/events">
                <Button
                  variant={isActive("/events") ? "default" : "ghost"}
                  size="sm"
                  className="gap-2"
                >
                  <Calendar className="h-4 w-4" />
                  Events
                </Button>
              </Link>
              <Link to="/complaints">
                <Button
                  variant={isActive("/complaints") ? "default" : "ghost"}
                  size="sm"
                  className="gap-2"
                >
                  <MessageSquare className="h-4 w-4" />
                  Complaints
                </Button>
              </Link>
              <Link to="/feedback">
                <Button
                  variant={isActive("/feedback") ? "default" : "ghost"}
                  size="sm"
                  className="gap-2"
                >
                  <MessageCircle className="h-4 w-4" />
                  Feedback
                </Button>
              </Link>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={signOut} className="gap-2">
            <LogOut className="h-4 w-4" />
            Sign Out
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
