import { Button } from "@/components/ui/button";
import { Bell, TrendingUp, Calendar } from "lucide-react";

const Hero = () => {
  return (
    <section className="relative bg-gradient-hero py-24 px-6 overflow-hidden">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iaHNsKDIwNSAzMCUgOTAlKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-40"></div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-accent/10 text-accent px-4 py-2 rounded-full text-sm font-medium mb-6 border border-accent/20">
            <TrendingUp className="w-4 h-4" />
            AI-Powered Calibration Management
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
            Never Miss a Calibration
            <span className="block text-primary mt-2">Due Date Again</span>
          </h1>
          
          <p className="text-xl text-muted-foreground mb-10 max-w-3xl mx-auto leading-relaxed">
            Automated gauge calibration tracking with intelligent scheduling. 
            Get smart alerts, dynamic intervals based on usage, and full compliance visibility.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-medium">
              <Calendar className="mr-2 h-5 w-5" />
              View Dashboard
            </Button>
            <Button size="lg" variant="outline" className="border-2 hover:bg-secondary">
              Learn More
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
            <div className="bg-card p-6 rounded-lg shadow-soft border border-border">
              <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <Bell className="w-6 h-6 text-accent" />
              </div>
              <h3 className="font-semibold text-lg mb-2 text-card-foreground">Smart Alerts</h3>
              <p className="text-muted-foreground text-sm">
                Automated notifications 3 days before due date
              </p>
            </div>
            
            <div className="bg-card p-6 rounded-lg shadow-soft border border-border">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <TrendingUp className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold text-lg mb-2 text-card-foreground">AI Scheduling</h3>
              <p className="text-muted-foreground text-sm">
                Dynamic intervals adjusted by usage patterns
              </p>
            </div>
            
            <div className="bg-card p-6 rounded-lg shadow-soft border border-border">
              <div className="w-12 h-12 bg-status-completed/10 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <Calendar className="w-6 h-6 text-status-completed" />
              </div>
              <h3 className="font-semibold text-lg mb-2 text-card-foreground">Full Compliance</h3>
              <p className="text-muted-foreground text-sm">
                ISO-ready audit trails and reporting
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
