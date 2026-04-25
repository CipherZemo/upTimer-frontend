import axios from './axios';

export const subscriptionsAPI = {
  // Get subscription plans
  getPlans: async () => {
    const response = await axios.get('/subscriptions/plans');
    return response.data;
  },

  // Get current subscription
  getCurrentSubscription: async () => {
    const response = await axios.get('/subscriptions/current');
    return response.data;
  },

  // Create checkout session
  createCheckout: async (plan) => {
    const response = await axios.post('/subscriptions/checkout', { plan });
    return response.data;
  },

  // Cancel subscription
  cancelSubscription: async () => {
    const response = await axios.post('/subscriptions/cancel');
    return response.data;
  },
};