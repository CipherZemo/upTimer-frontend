import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/button';
import { 
  LayoutDashboard, 
  Activity, 
  Settings, 
  LogOut,
  Bell
} from 'lucide-react';

export function DashboardLayout({ children }) {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
    { icon: Activity, label: 'Checks', path: '/checks' },
    { icon: Bell, label: 'Incidents', path: '/incidents' },
    { icon: Settings, label: 'Settings', path: '/settings' },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <Link to="/dashboard" className="text-2xl font-bold text-primary">
              UptimeMonitor
            </Link>
            
            <nav className="hidden md:flex space-x-1">
              {navItems.map((item) => (
                <Link key={item.path} to={item.path}>
                  <Button variant="ghost" className="gap-2">
                    <item.icon className="h-4 w-4" />
                    {item.label}
                  </Button>
                </Link>
              ))}
            </nav>
          </div>

          <div className="flex items-center space-x-4">
            <div className="text-sm">
              <p className="font-medium">{user?.name}</p>
              <p className="text-xs text-muted-foreground capitalize">
                {user?.subscriptionTier} Plan
              </p>
            </div>
            <Button variant="outline" size="icon" onClick={handleLogout}>
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  );
}