import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import LoginPage from "@/pages/login";
import RegisterPage from "@/pages/register";
import NotFound from "@/pages/not-found";
import Landing from "@/pages/landing";
import Dashboard from "@/pages/dashboard";
import Contracts from "@/pages/contracts";
import Clients from "@/pages/clients";
import Projects from "@/pages/projects";
import Tasks from "@/pages/tasks";
import Documents from "@/pages/documents";
import Financial from "@/pages/financial";
import Settings from "@/pages/settings";
import Profile from "@/pages/profile";
import Suppliers from "@/pages/suppliers";
import Employees from "@/pages/employees";
import CalendarPage from "@/pages/calendar";
import CreateContract from "@/pages/create-contract";
import CreateClient from "@/pages/create-client";
import CreateSupplier from "@/pages/create-supplier";
import CreateEmployee from "@/pages/create-employee";
import CreateTransaction from "@/pages/create-transaction";
import CreateProject from "@/pages/create-project";

function Router() {
  const { isAuthenticated, isLoading } = useAuth();
  const [location, setLocation] = useLocation();


  // Permitir acesso à landing page para não autenticados
  if (!isLoading && !isAuthenticated && !["/", "/login", "/register"].includes(location)) {
    setLocation("/login");
    return null;
  }

  // Redireciona para dashboard se autenticado e na rota '/'
  if (isAuthenticated && location === "/") {
    setLocation("/dashboard");
    return null;
  }

  return (
    <Switch>
      <Route path="/" component={Landing} />
      <Route path="/login" component={() => <LoginPage onLogin={() => setLocation("/dashboard")} />} />
      <Route path="/register" component={RegisterPage} />

      {/* Protected routes */}
      {isAuthenticated && (
        <>
          <Route path="/dashboard" component={Dashboard} />
          <Route path="/contracts" component={Contracts} />
          <Route path="/clients" component={Clients} />
          <Route path="/projects" component={Projects} />
          <Route path="/tasks" component={Tasks} />
          <Route path="/documents" component={Documents} />
          <Route path="/financial" component={Financial} />
          <Route path="/settings" component={Settings} />
          <Route path="/profile" component={Profile} />
          <Route path="/suppliers" component={Suppliers} />
          <Route path="/employees" component={Employees} />
          <Route path="/calendar" component={CalendarPage} />

          {/* Create pages */}
          <Route path="/contracts/create" component={CreateContract} />
          <Route path="/clients/create" component={CreateClient} />
          <Route path="/suppliers/create" component={CreateSupplier} />
          <Route path="/employees/create" component={CreateEmployee} />
          <Route path="/financial/create" component={CreateTransaction} />
          <Route path="/projects/create" component={CreateProject} />
        </>
      )}

      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;