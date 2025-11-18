import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { AdminLayout } from "@/layouts/AdminLayout";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Interns from "./pages/Interns";
import AddIntern from "./pages/AddIntern";
import EditIntern from "./pages/EditIntern";
import InternDetail from "./pages/InternDetail";
import { Analytics } from "./pages/Analytics";
import { Settings } from "./pages/Settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Protected Routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <AdminLayout>
                    <Dashboard />
                  </AdminLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/interns"
              element={
                <ProtectedRoute>
                  <AdminLayout>
                    <Interns />
                  </AdminLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/interns/add"
              element={
                <ProtectedRoute>
                  <AdminLayout>
                    <AddIntern />
                  </AdminLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/interns/:id"
              element={
                <ProtectedRoute>
                  <AdminLayout>
                    <InternDetail />
                  </AdminLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/interns/:id/edit"
              element={
                <ProtectedRoute>
                  <AdminLayout>
                    <EditIntern />
                  </AdminLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/analytics"
              element={
                <ProtectedRoute>
                  <AdminLayout>
                    <Analytics />
                  </AdminLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/settings"
              element={
                <ProtectedRoute>
                  <AdminLayout>
                    <Settings />
                  </AdminLayout>
                </ProtectedRoute>
              }
            />

            {/* Catch all */}
            <Route 
              path="*" 
              element={
                <AdminLayout>
                  <NotFound />
                </AdminLayout>
              } 
            />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
