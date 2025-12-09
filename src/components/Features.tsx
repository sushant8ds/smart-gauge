import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bell, Brain, Calendar, Database, FileText, Shield } from "lucide-react";

const Features = () => {
  const features = [
    {
      icon: Bell,
      title: "Automated Alerts",
      description: "Multi-channel notifications via email, SMS, or push. Get alerts 3 days before due date, when schedules change, or when calibration is overdue.",
      color: "text-accent",
      bgColor: "bg-accent/10",
    },
    {
      icon: Brain,
      title: "AI-Powered Scheduling",
      description: "Machine learning algorithms dynamically adjust calibration intervals based on real usage patterns and historical data.",
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      icon: Calendar,
      title: "Smart Calendar",
      description: "Visual timeline of all upcoming calibrations. Filter by status, gauge type, or location. Never miss a deadline again.",
      color: "text-status-upcoming",
      bgColor: "bg-status-upcoming/10",
    },
    {
      icon: Database,
      title: "SAP Integration",
      description: "Seamless integration with SAP, Excel, or any gauge management system via REST APIs and CSV imports.",
      color: "text-status-current",
      bgColor: "bg-status-current/10",
    },
    {
      icon: FileText,
      title: "Compliance Reports",
      description: "Automated PDF/Excel reports for ISO audits. Complete traceability with full audit trails of all calibration events.",
      color: "text-status-completed",
      bgColor: "bg-status-completed/10",
    },
    {
      icon: Shield,
      title: "Quality Assurance",
      description: "Reduce risk of using uncalibrated equipment. Maintain product quality with automated compliance monitoring.",
      color: "text-destructive",
      bgColor: "bg-destructive/10",
    },
  ];

  return (
    <section className="py-16 px-6 bg-muted/30">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Comprehensive Features
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Everything you need for automated calibration management in one powerful platform
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card 
                key={index} 
                className="border-border shadow-soft hover:shadow-medium transition-all duration-300 hover:-translate-y-1"
              >
                <CardHeader>
                  <div className={`w-12 h-12 ${feature.bgColor} rounded-lg flex items-center justify-center mb-4`}>
                    <Icon className={`w-6 h-6 ${feature.color}`} />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Features;
