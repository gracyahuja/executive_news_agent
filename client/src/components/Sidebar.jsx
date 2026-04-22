import React from "react";

const THEMES = [
  { id: "Tariffs", label: "Tariffs", icon: "⚖️", desc: "Trade duties & customs" },
  { id: "Foreign Affairs", label: "Foreign Affairs", icon: "🌐", desc: "Diplomacy & geopolitics" },
  { id: "Geography", label: "Geography", icon: "🗺️", desc: "Regions, routes & chokepoints" },
  { id: "Supply Chain", label: "Supply Chain", icon: "🚢", desc: "Shipping & logistics" },
  { id: "Retail", label: "Retail", icon: "🛒", desc: "Industry & competition" },
  { id: "AI", label: "AI", icon: "🤖", desc: "Tech & automation" },
  { id: "Markets", label: "Markets", icon: "📈", desc: "Equities, rates & macro" },
  { id: "Regulation", label: "Regulation", icon: "📋", desc: "Policy & compliance" },
  { id: "Consumer Trends", label: "Consumer Trends", icon: "👥", desc: "Demand & sentiment" },
];

export default function Sidebar({ onThemeSelect, activeTheme }) {
  return (
    <aside className="w-56 flex-shrink-0">
      <div className="card sticky top-4">
        <h2 className="text-xs font-bold uppercase tracking-widest text-costco-gray-dark mb-3 px-1">
          Guided Topics
        </h2>
        <nav className="space-y-0.5">
          {THEMES.map((theme) => {
            const isActive = activeTheme === theme.id;
            return (
              <button
                key={theme.id}
                onClick={() => onThemeSelect(isActive ? null : theme.id)}
                className={`w-full text-left px-3 py-2.5 rounded-md transition-all duration-100 group ${
                  isActive
                    ? "bg-costco-blue-light border-l-2 border-costco-blue"
                    : "hover:bg-gray-50 border-l-2 border-transparent"
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-base leading-none">{theme.icon}</span>
                  <div>
                    <div
                      className={`text-sm font-medium leading-tight ${
                        isActive ? "text-costco-blue" : "text-costco-text"
                      }`}
                    >
                      {theme.label}
                    </div>
                    <div className="text-xs text-gray-400 leading-tight mt-0.5">
                      {theme.desc}
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </nav>

        <div className="mt-4 pt-4 border-t border-costco-gray-mid">
          <p className="text-xs text-gray-400 px-1 leading-relaxed">
            Click a topic to pre-fill the search field, or type freely above.
          </p>
        </div>
      </div>
    </aside>
  );
}
