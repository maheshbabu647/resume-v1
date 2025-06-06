import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  LayoutDashboard,
  Settings2,
  BarChart3,
  LineChart as LineChartIcon,
  Users as UsersFunnelIcon,
  UserCheck as UserCheckIcon,
  ShieldCheck,
  Smartphone as SmartphoneIcon,
  GaugeCircle,
  ArrowRight,
} from 'lucide-react';

const adminLinks = [
  {
    path: '/admin/templates',
    title: 'Template Management',
    description: 'Create, view, edit, and delete resume templates available to users.',
    icon: Settings2,
  },
  {
    path: '/admin/analytics/overview',
    title: 'Analytics Overview',
    description: 'View key metrics and a general summary of platform activity and user engagement.',
    icon: BarChart3,
  },
  {
    path: '/admin/analytics/timeseries',
    title: 'Event Time Series',
    description: 'Track trends for specific user events (e.g., signups, downloads) over selected time periods.',
    icon: LineChartIcon,
  },
  {
    path: '/admin/analytics/funnel',
    title: 'User Conversion Funnel',
    description: 'Analyze user progression through key stages, from signup to resume download.',
    icon: UsersFunnelIcon,
  },
  {
    path: '/admin/analytics/retention',
    title: 'User Retention',
    description: 'View user retention rates for defined cohorts to understand engagement over time.',
    icon: UserCheckIcon,
  },
  {
    path: '/admin/analytics/security',
    title: 'Security Analytics',
    description: 'Monitor security-related events, failed login attempts, and other potential anomalies.',
    icon: ShieldCheck,
  },
  {
    path: '/admin/analytics/device',
    title: 'Device & Geo Analytics',
    description: 'Gain insights into user devices, browsers, and general access patterns (IP-based).',
    icon: SmartphoneIcon,
  },
  {
    path: '/admin/analytics/performance',
    title: 'API Performance',
    description: 'Track API endpoint response times and identify potential bottlenecks or slow requests.',
    icon: GaugeCircle,
  },
];

const AdminDashboardPage = () => {
  return (
    <>
      <Helmet>
        <title>Admin Dashboard | CareerForge</title>
        <meta name="description" content="Administrator dashboard for CareerForge. Manage templates and view platform analytics." />
      </Helmet>
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 md:py-16 bg-background text-foreground min-h-[calc(100vh-100px)]">
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-10 md:mb-14"
        >
          <div className="flex items-center gap-3.5 mb-2">
            <LayoutDashboard className="h-9 w-9 text-primary" />
            <h1 className="text-3xl sm:text-4xl font-bold text-primary tracking-tight">
              Admin Dashboard
            </h1>
          </div>
          <p className="text-muted-foreground text-base sm:text-lg">
            Welcome, Admin! Oversee platform operations and gain insights from this central hub.
          </p>
        </motion.header>

        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            visible: { transition: { staggerChildren: 0.08, delayChildren: 0.2 } }
          }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8" // Adjusted grid for potentially more items
        >
          {adminLinks.map((link) => (
            <motion.div
              key={link.path}
              variants={{
                hidden: { opacity: 0, y: 30, scale: 0.98 },
                visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.4, ease: "easeOut" } }
              }}
              className="h-full"
            >
              <Card className="bg-card border-border shadow-lg hover:shadow-2xl hover:border-primary/40 transition-all duration-300 ease-in-out flex flex-col h-full overflow-hidden rounded-xl group focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 focus-within:ring-offset-background">
                <CardHeader className="p-5 sm:p-6">
                  <div className="mb-4">
                    <span className="inline-flex p-3 bg-primary/10 group-hover:bg-primary/15 transition-colors rounded-xl">
                      <link.icon className="h-7 w-7 text-primary group-hover:scale-110 transition-transform" strokeWidth={1.75} />
                    </span>
                  </div>
                  <CardTitle className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">{link.title}</CardTitle>
                </CardHeader>
                <CardContent className="flex-grow px-5 sm:px-6 pb-4">
                  <CardDescription className="text-muted-foreground text-sm leading-relaxed min-h-[3.5rem]"> {/* min-h for alignment */}
                    {link.description}
                  </CardDescription>
                </CardContent>
                <CardFooter className="px-5 sm:px-6 pb-5 pt-4 bg-muted/20 dark:bg-muted/10 border-t border-border/50">
                  <Button 
                    asChild 
                    variant="secondary" // Changed variant for distinction
                    className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/80 group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-200"
                  >
                    <Link to={link.path} aria-label={`Navigate to ${link.title}`}>
                      Go to Section <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </>
  );
};

export default AdminDashboardPage;
