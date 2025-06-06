import React from 'react';
import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area'; // Assuming you have this
import {
  Settings2,
  BarChart3,
  LineChart as LineChartIcon,
  Users as UsersFunnelIcon,
  UserCheck as UserCheckIcon,
  ShieldCheck,
  Smartphone as SmartphoneIcon,
  GaugeCircle,
  LayoutDashboard, // For the main link to admin overview
} from 'lucide-react';

const adminNavLinks = [
  { path: '/admin/dashboard', title: 'Overview', icon: LayoutDashboard }, // Or '/admin/analytics/overview'
  { path: '/admin/templates', title: 'Templates', icon: Settings2 },
  { path: '/admin/analytics/timeseries', title: 'Time Series', icon: LineChartIcon },
  { path: '/admin/analytics/funnel', title: 'User Funnel', icon: UsersFunnelIcon },
  { path: '/admin/analytics/retention', title: 'Retention', icon: UserCheckIcon },
  { path: '/admin/analytics/security', title: 'Security', icon: ShieldCheck },
  { path: '/admin/analytics/device', title: 'Device/Geo', icon: SmartphoneIcon },
  { path: '/admin/analytics/performance', title: 'API Performance', icon: GaugeCircle },
];

const AdminLayout = () => {
  const location = useLocation();

  return (
    <div className="flex min-h-[calc(100vh-4rem)]"> {/* Adjust 4rem based on main navbar height */}
      {/* Sidebar */}
      <aside className="hidden md:flex flex-col w-60 bg-card border-r border-border sticky top-16 h-[calc(100vh-4rem)] z-30"> {/* top-16 assumes h-16 navbar */}
        <ScrollArea className="flex-1 px-2 py-4">
          <nav className="flex flex-col gap-1">
            {adminNavLinks.map((link) => {
              // More specific active check: location.pathname starts with link.path
              // For overview, it might need exact match or careful ordering if /admin/analytics also exists
              const isActive = location.pathname === link.path || (link.path !== '/admin/dashboard' && location.pathname.startsWith(link.path));
              
              return (
                <NavLink
                  key={link.title}
                  to={link.path}
                  className={cn(
                    "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors duration-150 ease-in-out",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card",
                    isActive
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                  )}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <link.icon className="h-5 w-5 flex-shrink-0" strokeWidth={1.75} />
                  <span>{link.title}</span>
                </NavLink>
              );
            })}
          </nav>
        </ScrollArea>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-muted/30 dark:bg-muted/10">
        <Outlet /> {/* This is where the specific admin page content will be rendered */}
      </main>
    </div>
  );
};

export default AdminLayout;
