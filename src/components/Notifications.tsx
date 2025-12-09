import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bell, AlertTriangle, CheckCircle2, Calendar } from "lucide-react";

const Notifications = () => {
  const notifications = [
    {
      icon: AlertTriangle,
      title: "Calibration Overdue",
      message: "Gauge G-418 (Flow Meter C) calibration overdue by 25 days!",
      time: "2 hours ago",
      type: "overdue",
      color: "text-status-overdue",
      bgColor: "bg-status-overdue/10",
      borderColor: "border-status-overdue/20",
    },
    {
      icon: Bell,
      title: "Upcoming Calibration",
      message: "Gauge G-205 (Temperature Sensor B) calibration due in 3 days.",
      time: "1 day ago",
      type: "upcoming",
      color: "text-status-upcoming",
      bgColor: "bg-status-upcoming/10",
      borderColor: "border-status-upcoming/20",
    },
    {
      icon: Calendar,
      title: "Schedule Updated",
      message: "Calibration date for G-523 updated due to increased usage pattern.",
      time: "3 days ago",
      type: "changed",
      color: "text-primary",
      bgColor: "bg-primary/10",
      borderColor: "border-primary/20",
    },
    {
      icon: CheckCircle2,
      title: "Calibration Complete",
      message: "Gauge G-647 (Micrometer E) calibration completed successfully by QA Team.",
      time: "1 week ago",
      type: "completed",
      color: "text-status-completed",
      bgColor: "bg-status-completed/10",
      borderColor: "border-status-completed/20",
    },
  ];

  return (
    <section className="py-16 px-6 bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Smart Notification System
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Stay informed with real-time alerts delivered via email, SMS, or in-app notifications
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {notifications.map((notification, index) => {
            const Icon = notification.icon;
            return (
              <Card 
                key={index} 
                className={`border ${notification.borderColor} shadow-soft hover:shadow-medium transition-all duration-300`}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start gap-4">
                    <div className={`w-10 h-10 ${notification.bgColor} rounded-lg flex items-center justify-center flex-shrink-0`}>
                      <Icon className={`w-5 h-5 ${notification.color}`} />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-base font-semibold mb-1">
                        {notification.title}
                      </CardTitle>
                      <p className="text-xs text-muted-foreground">{notification.time}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{notification.message}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Notifications;
