import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";

import { queryClient } from "@/lib/queryClient";
import ErrorBoundary from "@/components/ErrorBoundary";
import { PrivateRoute } from "@/components/PrivateRoute";
import { DashboardLayout } from "@/components/layout/DashboardLayout";

// Pages
import { Login } from "@/pages/auth/Login";
import { Register } from "@/pages/auth/Register";
import { Dashboard } from "@/pages/dashboard/Dashboard";
import { Checks } from "@/pages/dashboard/Checks";
import { CheckDetails } from '@/pages/dashboard/CheckDetails'; 
import { NotFound } from "@/pages/NotFound";
import { Pricing } from '@/pages/dashboard/Pricing';  
import { Settings } from '@/pages/dashboard/Settings';

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected routes */}
            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <DashboardLayout>
                    <Dashboard />
                  </DashboardLayout>
                </PrivateRoute>
              }
            />

            <Route
              path="/checks"
              element={
                <PrivateRoute>
                  <DashboardLayout>
                    <Checks />
                  </DashboardLayout>
                </PrivateRoute>
              }
            />
            
            <Route
              path="/checks/:id"
              element={
                <PrivateRoute>
                  <DashboardLayout>
                    <CheckDetails />
                  </DashboardLayout>
                </PrivateRoute>
              }
            />

            <Route
              path="/pricing"
              element={
                <PrivateRoute>
                  <DashboardLayout>
                    <Pricing />
                  </DashboardLayout>
                </PrivateRoute>
              }
            />

            <Route
              path="/settings"
              element={
                <PrivateRoute>
                  <DashboardLayout>
                    <Settings />
                  </DashboardLayout>
                </PrivateRoute>
              }
            />


            {/* Redirects */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />

            {/* 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>

        {/* Toast notifications */}
        <Toaster position="top-right" richColors />
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
