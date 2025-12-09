import Hero from "@/components/Hero";
import Dashboard from "@/components/Dashboard";
import Features from "@/components/Features";
import Notifications from "@/components/Notifications";
import TechStack from "@/components/TechStack";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Hero />
      <Dashboard />
      <Notifications />
      <Features />
      <TechStack />
      
      <footer className="bg-card border-t border-border py-8 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-muted-foreground">
            Auto Gauge Calibration Trigger System - AI/ML Powered Calibration Management
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
