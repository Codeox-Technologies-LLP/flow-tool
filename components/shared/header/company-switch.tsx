"use client";

import { useState, useEffect, useRef } from "react";
import { Building2, ChevronDown, Check } from "lucide-react";
import type { CompanySwitchProps, Company } from "@/types/header";

export function CompanySwitch({
  activeCompany,
  companies = [],
}: CompanySwitchProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleCompanySwitch = async (companyId: string) => {
    if (companyId === activeCompany) {
      setIsOpen(false);
      return;
    }

    setIsLoading(true);

    try {
      // TODO: Implement company switch API call
      console.log("Switching to company:", companyId);

      // Reload the page to fetch new data for the selected company
      // window.location.reload();
    } catch (error) {
      console.error("Failed to switch company:", error);
      setIsLoading(false);
      setIsOpen(false);
    }
  };

  // Always show company selector, even with single company
  const activeCompanyData = companies.find(
    (company) => company.companyId === activeCompany
  );

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => (companies.length > 1 ? setIsOpen(!isOpen) : undefined)}
        disabled={isLoading}
        className={`flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
          companies.length > 1
            ? "hover:bg-gray-50 hover:border-gray-300 cursor-pointer"
            : "cursor-default"
        }`}
        aria-label="Switch company"
        aria-expanded={isOpen}
      >
        <Building2 className="w-4 h-4 text-gray-500" />
        <span className="hidden sm:inline max-w-[120px] lg:max-w-[180px] truncate">
          {isLoading
            ? "Switching..."
            : activeCompanyData?.companyName || "Select Company"}
        </span>
        {companies.length > 1 && (
          <ChevronDown
            className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-50 overflow-hidden">
          <div className="py-1">
            <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-100">
              Switch Company
            </div>
            <div className="max-h-75 overflow-y-auto">
              {companies.map((company) => {
                const isActive = company.companyId === activeCompany;
                return (
                  <button
                    key={company.companyId}
                    onClick={() => handleCompanySwitch(company.companyId)}
                    disabled={isLoading}
                    className={`w-full flex items-center justify-between px-3 py-2.5 text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                      isActive
                        ? "bg-blue-50 text-blue-700 font-medium"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0 flex-1">
                      <Building2
                        className={`w-4 h-4 shrink-0 ${
                          isActive ? "text-blue-600" : "text-gray-400"
                        }`}
                      />
                      <span className="truncate">{company.companyName}</span>
                    </div>
                    {isActive && (
                      <Check className="w-4 h-4 text-blue-600 shrink-0 ml-2" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
