"use client";

import { useState, useEffect } from "react";

interface Tab {
  id: string;
  label: string;
}

interface ItineraryTabsProps {
  tabs: Tab[];
  children: (activeTab: string) => React.ReactNode;
}

export function ItineraryTabs({ tabs, children }: ItineraryTabsProps) {
  const [active, setActive] = useState(tabs[0]?.id ?? "");

  useEffect(() => {
    const hash = window.location.hash.replace("#", "");
    if (tabs.find((t) => t.id === hash)) setActive(hash);
  }, [tabs]);

  function switchTab(id: string) {
    setActive(id);
    window.history.replaceState(null, "", `#${id}`);
  }

  return (
    <div>
      <div className="sticky top-16 z-20 bg-white border-b border-stone-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex overflow-x-auto no-scrollbar">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => switchTab(tab.id)}
                className={`px-5 py-4 text-sm font-semibold whitespace-nowrap border-b-2 transition-colors ${
                  active === tab.id
                    ? "border-amber-500 text-amber-600"
                    : "border-transparent text-stone-500 hover:text-stone-700"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="pt-10">{children(active)}</div>
    </div>
  );
}
