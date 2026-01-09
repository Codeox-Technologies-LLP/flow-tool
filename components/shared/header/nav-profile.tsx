"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { User, LogOut } from "lucide-react";
import { cookieStorage } from "@/lib/utils/cookies";

type DropDownItem = {
  name: string;
  displayName: string;
  navigate: string;
  icon: React.ReactNode;
};

const dropDown: DropDownItem[] = [
  {
    displayName: "Profile",
    name: "profile",
    navigate: "/profile",
    icon: <User className="w-5 h-5" />,
  },
  {
    displayName: "Logout",
    name: "logout",
    navigate: "/auth/login",
    icon: <LogOut className="w-5 h-5" />,
  },
];

interface NavProfileProps {
  userName?: string;
  userInitial?: string;
}

export function NavProfile({ userName, userInitial }: NavProfileProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();

  const handleClick = async (item: DropDownItem) => {
    setIsOpen(false);
    if (item.name === "logout") {
      // Clear all cookies
      cookieStorage.clearAll();
      router.push("/auth/login");
      router.refresh();
    } else {
      router.push(item.navigate);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        className="flex items-center justify-center w-8 h-8 rounded-md hover:bg-gray-50 active:bg-gray-100 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="User menu"
        aria-expanded={isOpen}
      >
        <div className="w-7 h-7 rounded-md bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-semibold text-sm ring-1 ring-gray-200">
          {userInitial || "U"}
        </div>
      </button>

      {isOpen && (
        <>
          {/* Mobile Backdrop */}
          <div
            className="fixed inset-0 bg-black/10 z-30 lg:hidden"
            onClick={() => setIsOpen(false)}
          />

          <div className="absolute right-0 mt-1.5 w-48 bg-white rounded-lg shadow-lg border border-gray-100 z-40 py-1 animate-in fade-in slide-in-from-top-1 duration-150">
            {dropDown.map((item, index) => (
              <button
                key={index}
                className={`w-full flex items-center gap-2.5 px-3 py-2 text-sm transition-colors ${
                  item.name === "logout"
                    ? "text-red-600 hover:bg-red-50"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
                onClick={() => handleClick(item)}
              >
                <span
                  className={`${
                    item.name === "logout" ? "text-red-500" : "text-gray-500"
                  }`}
                >
                  {item.icon}
                </span>
                <span className="font-medium">{item.displayName}</span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
