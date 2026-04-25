import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCurrentSubscription, useCancelSubscription } from '@/hooks/useSubscriptions';
import { useAuthStore } from '@/store/authStore';
import { format } from 'date-fns';
import { Loader2, CreditCard, User, Mail, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function Settings() {
  const user = useAuthStore((state) => state.user);
  const navigate = useNavigate();
  const { data: subscriptionData, isLoading } = useCurrentSubscription();
  const cancelSubscription = useCancelSubscription();

  const subscription = subscriptionData?.subscription;
  const planDetails = subscriptionData?.subscription?.planDetails;

  const handleCancel = async () => {
    if (window.confirm('Are you sure you want to cancel your subscription? You will be downgraded to the free plan.')) {
      await cancelSubscription.mutateAsync();
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold">Settings</h1>

      {/* Profile Card */}
      <Card>
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
          <CardDescription>Your account details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-3">
            <User className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">Name</p>
              <p className="font-medium">{user?.name}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Mail className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">Email</p>
              <p className="font-medium">{user?.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Calendar className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">Member Since</p>
              <p className="font-medium">
                {format(new Date(user?.createdAt), 'MMMM dd, yyyy')}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Subscription Card */}
      <Card>
        <CardHeader>
          <CardTitle>Subscription</CardTitle>
          <CardDescription>Manage your subscription plan</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {isLoading ? (
            <div className="flex justify-center py-4">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <CreditCard className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Current Plan</p>
                    <p className="font-medium capitalize">{subscription?.plan}</p>
                  </div>
                </div>
                <Badge
                  variant={subscription?.status === 'active' ? 'default' : 'secondary'}
                  className={subscription?.status === 'active' ? 'bg-green-500' : ''}
                >
                  {subscription?.status}
                </Badge>
              </div>

              {planDetails && (
                <div className="border rounded-lg p-4 space-y-2">
                  <h4 className="font-semibold">Plan Features:</h4>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>
                      • {planDetails.features.maxChecks === -1
                        ? 'Unlimited'
                        : planDetails.features.maxChecks}{' '}
                      checks
                    </li>
                    <li>• {planDetails.features.minInterval} min check interval</li>
                    <li>• {planDetails.features.emailAlerts ? '✓' : '✗'} Email alerts</li>
                    <li>• {planDetails.features.webhookAlerts ? '✓' : '✗'} Webhook alerts</li>
                    <li>• {planDetails.features.apiAccess ? '✓' : '✗'} API access</li>
                  </ul>
                </div>
              )}

              {subscription?.currentPeriodEnd && (
                <div className="text-sm text-muted-foreground">
                  {subscription.status === 'active' ? 'Renews' : 'Expires'} on{' '}
                  {format(new Date(subscription.currentPeriodEnd), 'MMMM dd, yyyy')}
                </div>
              )}

              <div className="flex gap-2 pt-4">
                <Button onClick={() => navigate('/pricing')}>
                  {subscription?.plan === 'free' ? 'Upgrade Plan' : 'Change Plan'}
                </Button>

                {subscription?.plan !== 'free' && (
                  <Button
                    variant="outline"
                    onClick={handleCancel}
                    disabled={cancelSubscription.isPending}
                  >
                    {cancelSubscription.isPending && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Cancel Subscription
                  </Button>
                )}
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}