import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Loader2, Zap } from 'lucide-react';
import { usePlans, useCurrentSubscription } from '@/hooks/useSubscriptions';
import { subscriptionsAPI } from '@/api/subscriptions';
import { useAuthStore } from '@/store/authStore';
import { toast } from 'sonner';

export function Pricing() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const { data: plansData, isLoading: plansLoading } = usePlans();
  const { data: subscriptionData } = useCurrentSubscription();
  const [loadingPlan, setLoadingPlan] = useState(null);

  const plans = plansData?.plans || [];
  const currentPlan = subscriptionData?.subscription?.plan || 'free';

  const handleSubscribe = async (planId) => {
    if (planId === 'free') {
      toast.info('You are already on the free plan');
      return;
    }

    setLoadingPlan(planId);

    try {
      const { subscriptionId, razorpayKey } = await subscriptionsAPI.createCheckout(planId);

      // Load Razorpay script
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      document.body.appendChild(script);

      script.onload = () => {
        const options = {
          key: razorpayKey,
          subscription_id: subscriptionId,
          name: 'UptimeMonitor',
          description: `${planId.charAt(0).toUpperCase() + planId.slice(1)} Plan Subscription`,
          handler: function (response) {
            toast.success('Subscription activated successfully!');
            setTimeout(() => {
              window.location.reload();
            }, 1000);
          },
          prefill: {
            name: user.name,
            email: user.email,
          },
          theme: {
            color: '#3b82f6',
          },
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
      };
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create subscription');
    } finally {
      setLoadingPlan(null);
    }
  };

  if (plansLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Choose Your Plan</h1>
        <p className="text-xl text-muted-foreground">
          Start monitoring your services with confidence
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {plans.map((plan) => {
          const isCurrentPlan = plan.id === currentPlan;
          const isPro = plan.id === 'pro';

          return (
            <Card
              key={plan.id}
              className={`relative ${isPro ? 'border-primary shadow-lg scale-105' : ''}`}
            >
              {isPro && (
                <div className="absolute -top-4 left-0 right-0 flex justify-center">
                  <Badge className="bg-primary text-primary-foreground">
                    <Zap className="h-3 w-3 mr-1" />
                    Most Popular
                  </Badge>
                </div>
              )}

              <CardHeader>
                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                <CardDescription>
                  <span className="text-4xl font-bold">{plan.priceDisplay}</span>
                  {plan.price > 0 && (
                    <span className="text-muted-foreground ml-2">/ month</span>
                  )}
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    <span>
                      {plan.features.maxChecks === -1
                        ? 'Unlimited checks'
                        : `${plan.features.maxChecks} checks`}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    <span>{plan.features.minInterval} min check interval</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    <span>Email alerts</span>
                  </div>

                  {plan.features.webhookAlerts && (
                    <div className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-500" />
                      <span>Webhook alerts</span>
                    </div>
                  )}

                  {plan.features.apiAccess && (
                    <div className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-500" />
                      <span>API access</span>
                    </div>
                  )}

                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    <span className="capitalize">{plan.features.support} support</span>
                  </div>
                </div>
              </CardContent>

              <CardFooter>
                {isCurrentPlan ? (
                  <Button variant="outline" className="w-full" disabled>
                    Current Plan
                  </Button>
                ) : (
                  <Button
                    className="w-full"
                    variant={isPro ? 'default' : 'outline'}
                    onClick={() => handleSubscribe(plan.id)}
                    disabled={loadingPlan === plan.id}
                  >
                    {loadingPlan === plan.id && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    {plan.price === 0 ? 'Get Started' : 'Subscribe Now'}
                  </Button>
                )}
              </CardFooter>
            </Card>
          );
        })}
      </div>

      <div className="mt-12 text-center text-sm text-muted-foreground">
        <p>All plans include 24/7 uptime monitoring and incident alerts</p>
        <p className="mt-2">Cancel anytime. No hidden fees.</p>
      </div>
    </div>
  );
}