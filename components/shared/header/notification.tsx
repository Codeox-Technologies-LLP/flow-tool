"use client";

import { useState, useEffect } from "react";
import {
  X,
  CheckCheck,
  Trash2,
  BellRing,
  Calendar,
  UserPlus,
  FilePlus,
} from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import type { NotificationModule, Notification } from "@/types/header";

const iconMap: Record<NotificationModule, React.ReactNode> = {
  schedule: <Calendar className="md:w-4 md:h-5 w-5 h-6 text-blue-500" />,
  enquiry: <FilePlus className="md:w-4 md:h-5 w-5 h-6 text-teal-500" />,
  client: <UserPlus className="md:w-4 md:h-5 w-5 h-6 text-green-500" />,
};

const formatTime = (date: string) => {
  const now = new Date();
  const created = new Date(date);
  const diffMs = now.getTime() - created.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMins / 60);

  if (
    now.getDate() === created.getDate() &&
    now.getMonth() === created.getMonth() &&
    now.getFullYear() === created.getFullYear()
  ) {
    if (diffMins < 60)
      return `${diffMins} minute${diffMins !== 1 ? "s" : ""} ago`;
    return `${diffHours} hour${diffHours !== 1 ? "s" : ""} ago`;
  }

  return created.toLocaleDateString("en-GB");
};

export function Notification() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    // TODO: Fetch notifications from API
    fetchData();
    const interval = setInterval(fetchData, 60000);
    return () => clearInterval(interval);
  }, []);

  const fetchData = async () => {
    try {
      // TODO: Replace with actual API call
      // const response = await NotificationApi.fetchNotificationData();
      // setNotifications(response.data.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleDeleteNotification = async (id: string) => {
    try {
      // TODO: Replace with actual API call
      // await NotificationApi.deleteNotification(id);
      setNotifications((prev) => prev.filter((n) => n._id !== id));
    } catch (error) {
      console.error("Error deleting notification:", error);
    }
  };

  const markAllAsRead = async () => {
    const notificationIds = notifications.map((n) => n._id);
    try {
      // TODO: Replace with actual API call
      // await NotificationApi.clearAllNotifications(notificationIds);
      setNotifications([]);
      setOpen(false);
    } catch (error) {
      console.error("Error clearing notifications:", error);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          className="relative flex items-center justify-center w-8 h-8 rounded-md text-gray-700 hover:bg-gray-50 active:bg-gray-100 transition-colors"
          aria-label="Notifications"
        >
          <BellRing className="w-[18px] h-[18px]" />
          {unreadCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[9px] min-w-[16px] h-4 px-1 rounded-full flex items-center justify-center font-semibold">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </button>
      </PopoverTrigger>

      <PopoverContent className="w-[380px] p-0" align="end" sideOffset={8}>
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-gray-50">
          <div>
            <h3 className="text-sm font-semibold text-gray-900">
              Notifications
            </h3>
            {unreadCount > 0 && (
              <p className="text-[11px] text-gray-500 mt-0.5">
                {unreadCount} unread
              </p>
            )}
          </div>
          <div className="flex items-center gap-1">
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="flex items-center gap-1 px-2 py-1 text-[11px] text-blue-600 hover:bg-blue-50 rounded-md transition-colors font-medium"
              >
                <CheckCheck className="w-3 h-3" />
                Clear
              </button>
            )}
            <button
              onClick={() => setOpen(false)}
              className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Notification List */}
        <div className="max-h-[400px] overflow-y-auto">
          {notifications.length > 0 ? (
            <div className="divide-y divide-gray-50">
              {notifications.map((notif) => (
                <div
                  key={notif._id}
                  className={`flex items-start gap-3 p-3 transition-colors hover:bg-gray-50 ${
                    !notif.read ? "bg-blue-50/40" : ""
                  }`}
                >
                  <div className="mt-0.5 flex-shrink-0">
                    {iconMap[notif.module]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h4 className="text-xs font-semibold text-gray-900">
                        {notif.module.charAt(0).toUpperCase() +
                          notif.module.slice(1)}{" "}
                        Update
                      </h4>
                      {!notif.read && (
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500 flex-shrink-0 mt-1" />
                      )}
                    </div>
                    <p className="text-xs text-gray-600 break-words leading-relaxed">
                      {notif.content}
                    </p>
                    <p className="text-[11px] text-gray-400 mt-1.5">
                      {formatTime(notif.createdAt)}
                    </p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteNotification(notif._id);
                    }}
                    className="flex-shrink-0 p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
              <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-3">
                <BellRing className="w-6 h-6 text-gray-400" />
              </div>
              <h4 className="text-xs font-medium text-gray-900 mb-0.5">
                No notifications
              </h4>
              <p className="text-[11px] text-gray-500">You're all caught up!</p>
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
