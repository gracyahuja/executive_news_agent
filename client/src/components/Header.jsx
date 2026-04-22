import React from "react";

export default function Header() {
  return (
    <header className="bg-costco-blue text-white shadow-md">
      <div className="max-w-screen-2xl mx-auto px-6 py-3 flex items-center justify-between">
        {/* Costco Logo + Wordmark */}
        <div className="flex items-center gap-3">
          {/* SVG approximation of Costco wordmark colors */}
          <div className="flex items-center bg-white rounded px-3 py-1 gap-0.5">
            <span
              style={{ fontFamily: "Arial Black, sans-serif", fontSize: 18, color: "#E31837", fontWeight: 900, letterSpacing: "-0.5px" }}
            >
              COSTCO
            </span>
            <span
              style={{ fontFamily: "Arial Black, sans-serif", fontSize: 18, color: "#005DAA", fontWeight: 900, letterSpacing: "-0.5px", marginLeft: 4 }}
            >
              WHOLESALE
            </span>
          </div>
          <div className="hidden md:flex flex-col leading-none">
            <span className="text-sm font-semibold tracking-wide text-blue-100">
              Executive Intelligence
            </span>
            <span className="text-xs text-blue-200">Internal Use Only</span>
          </div>
        </div>

        {/* Right-side badge */}
        <div className="flex items-center gap-2">
          <span className="hidden sm:inline-block bg-costco-red text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
            Confidential
          </span>
          <span className="text-blue-200 text-xs hidden lg:inline">
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </span>
        </div>
      </div>
    </header>
  );
}
