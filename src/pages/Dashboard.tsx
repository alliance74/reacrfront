import { useMemo } from "react";
import { ChatInterface } from "@/components/ChatInterface";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Crown, TrendingUp, Clock } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useSubscription } from "@/contexts/SubscriptionContext";

const Dashboard = () => {
  const { currentUser } = useAuth();
  const { subscription, isLoading: subLoading, refreshSubscription } = useSubscription();

  const planName = subscription?.planName || (subscription?.planId === 'free' ? 'Free' : 'Premium');
  const isFree = subscription?.isFree ?? true;
  const isActive = subscription?.isActive ?? true;
  const messagesLimit = subscription?.maxMessages ?? (isFree ? 10 : -1);
  const usedMessages = subscription?.usedMessages ?? 0;
  const remaining = subscription?.remainingMessages ?? (isFree ? Math.max(0, (messagesLimit || 0) - usedMessages) : undefined);

  const stats = useMemo(() => [
    { label: 'Messages Used', value: isFree ? `${usedMessages}/${messagesLimit}` : 'Unlimited', icon: MessageSquare, color: 'text-primary' },
    // Placeholder analytics; you can wire real data later
    { label: 'Success Rate', value: '—', icon: TrendingUp, color: 'text-success' },
    { label: 'Plan Status', value: isActive ? 'Active' : 'Inactive', icon: Crown, color: isActive ? 'text-success' : 'text-warning' },
    { label: 'Next Renewal', value: subscription?.currentPeriodEnd ? new Date(subscription.currentPeriodEnd).toLocaleDateString() : '—', icon: Clock, color: 'text-accent' }
  ], [isFree, usedMessages, messagesLimit, isActive, subscription?.currentPeriodEnd]);

  return (
    <div className="min-h-screen bg-background">
      <div className="pt-20 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Welcome Section */}
          <div className="mb-8">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <h1 className="text-3xl font-bold text-foreground">
                  Welcome back, {currentUser?.displayName || currentUser?.email || 'Friend'}! 👋
                </h1>
                <p className="text-muted-foreground mt-2">
                  Ready to level up your chat game?
                </p>
              </div>
              <Badge variant="secondary" className="gradient-primary text-primary-foreground">
                <Crown className="w-4 h-4 mr-1" />
                {planName} {isActive ? 'Plan' : '(Inactive)'}
              </Badge>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <Card key={index} className="glass hover-lift transition-smooth">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {stat.label}
                  </CardTitle>
                  <stat.icon className={`h-4 w-4 ${stat.color}`} />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Main Chat Interface */}
          <div className="mb-8">
            <Card className="glass">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-primary" />
                  Generate Rizz Lines
                </CardTitle>
              </CardHeader>
              <CardContent>
                {/* If free and no remaining messages, prompt upgrade */}
                {isFree && typeof remaining === 'number' && remaining <= 0 ? (
                  <div className="text-center space-y-4">
                    <p className="text-muted-foreground">You have reached your free message limit.</p>
                    <Button className="gradient-primary" onClick={() => (window.location.href = '/pricing')}>Upgrade to Premium</Button>
                  </div>
                ) : (
                  <ChatInterface />
                )}
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="glass hover-lift transition-smooth">
              <CardHeader>
                <CardTitle className="text-lg">{isFree ? 'Upgrade Plan' : 'Manage Plan'}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  {isFree ? 'Get unlimited messages and premium features' : 'View and manage your subscription'}
                </p>
                <Button className="w-full gradient-primary" onClick={() => window.location.href = isFree ? '/pricing' : '/profile?tab=subscription'}>
                  {isFree ? 'View Plans' : 'Manage Subscription'}
                </Button>
              </CardContent>
            </Card>

            <Card className="glass hover-lift transition-smooth">
              <CardHeader>
                <CardTitle className="text-lg">Invite Friends</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Earn $2/month for each referral
                </p>
                <Button variant="outline" className="w-full" onClick={() => window.location.href = '/referrals'}>
                  Share Link
                </Button>
              </CardContent>
            </Card>

            <Card className="glass hover-lift transition-smooth">
              <CardHeader>
                <CardTitle className="text-lg">My Profile</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Manage your account and settings
                </p>
                <Button variant="outline" className="w-full" onClick={() => window.location.href = '/profile'}>
                  View Profile
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;