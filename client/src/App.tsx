import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/lib/auth";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import Family from "@/pages/Family";
import Posts from "@/pages/Posts";
import FamilyMemberPosts from "@/pages/FamilyMemberPosts";
import Wolf from "@/pages/Wolf";
import FlightHours from "@/pages/FlightHours";
import AviationCertifications from "@/pages/AviationCertifications";
import PythonProgramming from "@/pages/PythonProgramming";
import MachineLearning from "@/pages/MachineLearning";
import TCASSafety from "@/pages/TCASSafety";
import NetworkSecurity from "@/pages/NetworkSecurity";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/family" component={Family} />
      <Route path="/posts" component={Posts} />
      <Route path="/family/:id/posts" component={FamilyMemberPosts} />
      <Route path="/wolf" component={Wolf} />
      <Route path="/accomplishments/flight-hours" component={FlightHours} />
      <Route path="/accomplishments/aviation-certifications" component={AviationCertifications} />
      <Route path="/accomplishments/python-programming" component={PythonProgramming} />
      <Route path="/accomplishments/machine-learning" component={MachineLearning} />
      <Route path="/accomplishments/tcas-safety" component={TCASSafety} />
      <Route path="/accomplishments/network-security" component={NetworkSecurity} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <div className="min-h-screen bg-warm-gray">
            <Header />
            <Router />
            <Footer />
          </div>
          <Toaster />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
