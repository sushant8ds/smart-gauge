import { Bell } from "lucide-react";
import { useNotificationStore } from "@/store/notificationStore";
import { useState } from "react";

const NotificationBell = () => {
  const { notifications } = useNotificationStore();
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="relative rounded-full p-2 hover:bg-muted"
      >
        <Bell className="h-6 w-6" />
        {notifications.length > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs px-1 rounded-full">
            {notifications.length}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 mt-2 w-72 bg-white shadow-lg rounded-lg p-3 z-50">
          <h4 className="font-semibold mb-2">Notifications</h4>

          {notifications.length === 0 ? (
            <p className="text-sm text-gray-500">No notifications</p>
          ) : (
            notifications.map((n) => (
              <div key={n.id} className="border-b py-2">
                <p className="font-medium">{n.message}</p>
                <p className="text-xs text-muted-foreground">{n.description}</p>
                <p className="text-[10px] text-gray-400">{n.date}</p>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
