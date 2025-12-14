import { useAuth } from "@/context/AuthContext";
import { Bell, Search, LogOut } from "lucide-react";

interface NavbarProps {
  title: string;
  subtitle?: string;
}

export function Navbar({ title, subtitle }: NavbarProps) {
  const { user, logout } = useAuth();

  return (
    <header className="h-16 bg-card border-b border-border px-16 flex items-center justify-between sticky top-0 z-30">
      <div>
        <h1 className="font-display text-xl font-semibold text-foreground">
          {title}
        </h1>
        {subtitle && (
          <p className="text-sm text-muted-foreground">{subtitle}</p>
        )}
      </div>

      <div className="flex items-center gap-4">
        <button className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center hover:bg-secondary/80 transition-colors">
          <Bell className="w-5 h-5 text-muted-foreground" />
        </button>

        <div className="flex items-center gap-3 pl-4 border-l border-border">
          <div className="w-10 h-10 rounded-xl gradient-sweet flex items-center justify-center text-primary-foreground font-semibold">
            {user?.full_name?.charAt(0).toUpperCase() || user?.username?.charAt(0).toUpperCase()}
          </div>
          <div className="hidden md:block">
            <p className="text-sm font-medium text-foreground">{user?.full_name || user?.username}</p>
            <p className="text-xs text-muted-foreground capitalize">
              {user?.is_admin ? 'Admin' : 'User'}
            </p>
          </div>
          <div className="ml-2">
            <button
              onClick={logout}
              className=" rounded-full p-2 hover:bg-destructive/15 hover:text-destructive"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}