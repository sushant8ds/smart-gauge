import { Card, CardContent } from "@/components/ui/card";
import { Code2, Database, Cpu, Bell, Link2, Clock } from "lucide-react";

const TechStack = () => {
  const techLayers = [
    {
      icon: Code2,
      layer: "Frontend",
      tech: "React.js, TypeScript, Tailwind CSS",
      description: "Modern, responsive UI with real-time updates",
    },
    {
      icon: Database,
      layer: "Database",
      tech: "PostgreSQL / MySQL",
      description: "Robust data storage with full ACID compliance",
    },
    {
      icon: Cpu,
      layer: "ML Engine",
      tech: "Scikit-learn, TensorFlow",
      description: "AI-powered interval prediction and optimization",
    },
    {
      icon: Bell,
      layer: "Notifications",
      tech: "SMTP, Firebase, Twilio",
      description: "Multi-channel alert delivery system",
    },
    {
      icon: Link2,
      layer: "Integration",
      tech: "SAP OData API, REST APIs, CSV",
      description: "Seamless connectivity with existing systems",
    },
    {
      icon: Clock,
      layer: "Scheduler",
      tech: "Celery, APScheduler",
      description: "Automated background task processing",
    },
  ];

  return (
    <section className="py-16 px-6 bg-gradient-hero">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Enterprise-Grade Technology
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Built on proven technologies for scalability, reliability, and performance
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {techLayers.map((layer, index) => {
            const Icon = layer.icon;
            return (
              <Card 
                key={index} 
                className="border-border shadow-soft bg-card hover:shadow-medium transition-all duration-300"
              >
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-1 text-card-foreground">{layer.layer}</h3>
                      <p className="text-sm font-medium text-primary mb-2">{layer.tech}</p>
                      <p className="text-sm text-muted-foreground">{layer.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default TechStack;
