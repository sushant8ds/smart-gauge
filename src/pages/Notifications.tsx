import { Bell, Trash2 } from "lucide-react";
import { useState } from "react";
import { useNotificationStore } from "@/store/notificationStore";
import { Badge } from "./ui/badge";

const Notifications = () => {
  const [open, setOpen] = useState(false);
  const { notifications, clearNotifications } = useNotificationStore();

  const unread = notifications.length;

  return (
    <div className="relative">
      {/* Bell Icon */}
      <button 
        className="relative p-2 rounded-full hover:bg-gray-200"
        onClick={() => setOpen(!open)}
      >
        <Bell className="h-6 w-6" />

        {unread > 0 && (
          <span className="absolute top-0 right-0 bg-red-600 text-white text-xs px-1 rounded-full">
            {unread}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 mt-2 w-80 bg-white shadow-lg rounded-lg p-4 z-50 max-h-96 overflow-y-auto">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-bold text-lg">Notifications</h3>
            <button onClick={clearNotifications}>
              <Trash2 className="h-5 w-5 text-red-600" />
            </button>
          </div>

          {notifications.length === 0 && (
            <p className="text-sm text-gray-500 text-center">No notifications</p>
          )}

          {notifications.map((n) => (
            <div
              key={n.id}
              className="border-b py-2 text-sm flex flex-col gap-1"
            >
              <Badge className={n.type === "overdue" ? "bg-red-600" : "bg-yellow-500 text-black"}>
                {n.type.toUpperCase()}
              </Badge>

              <span>{n.message}</span>

              <span className="text-xs text-gray-500">{n.date}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Notifications;
