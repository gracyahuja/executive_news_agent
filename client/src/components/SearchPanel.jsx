import React, { useState } from "react";
import { format, subDays } from "date-fns";

function today() {
  return format(new Date(), "yyyy-MM-dd");
}
function daysAgo(n) {
  return format(subDays(new Date(), n), "yyyy-MM-dd");
}

export default function SearchPanel({ onSubmit, loading, prefillTopic }) {
  const [topic, setTopic] = useState(prefillTopic || "");
  const [dateFrom, setDateFrom] = useState(daysAgo(7));
  const [dateTo, setDateTo] = useState(today());

  // Sync when parent passes a prefilled topic (from sidebar click)
  React.useEffect(() => {
    if (prefillTopic !== undefined && prefillTopic !== topic) {
      setTopic(prefillTopic || "");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prefillTopic]);

  function handleSubmit(mode) {
    onSubmit({ mode, topic: topic.trim(), dateFrom, dateTo });
  }

  return (
    <div className="card">
      {/* Headline */}
      <div className="mb-5">
        <h1 className="text-2xl font-bold text-costco-text leading-tight">
          Hi there, how can I help you today?
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Enter a topic for a focused brief, or generate a broad daily debrief across all sources.
        </p>
      </div>

      {/* Input row */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Topic input */}
        <div className="flex-1">
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
            Topic (optional)
          </label>
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && topic.trim()) handleSubmit("topic_brief");
            }}
            placeholder='e.g. "Red Sea shipping disruption", "China tariffs", "AI regulation"'
            className="w-full border border-gray-200 rounded-md px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-costco-blue focus:border-transparent transition"
          />
        </div>

        {/* Date range */}
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
            From
          </label>
          <input
            type="date"
            value={dateFrom}
            max={dateTo}
            onChange={(e) => setDateFrom(e.target.value)}
            className="border border-gray-200 rounded-md px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-costco-blue transition"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
            To
          </label>
          <input
            type="date"
            value={dateTo}
            min={dateFrom}
            max={today()}
            onChange={(e) => setDateTo(e.target.value)}
            className="border border-gray-200 rounded-md px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-costco-blue transition"
          />
        </div>
      </div>

      {/* Quick date shortcuts */}
      <div className="flex flex-wrap gap-2 mt-2">
        {[
          { label: "Today", from: today(), to: today() },
          { label: "Last 3 days", from: daysAgo(3), to: today() },
          { label: "Last 7 days", from: daysAgo(7), to: today() },
          { label: "Last 14 days", from: daysAgo(14), to: today() },
          { label: "Last 30 days", from: daysAgo(30), to: today() },
        ].map(({ label, from, to }) => (
          <button
            key={label}
            onClick={() => { setDateFrom(from); setDateTo(to); }}
            className={`text-xs px-2.5 py-1 rounded-full border transition-colors ${
              dateFrom === from && dateTo === to
                ? "border-costco-blue bg-costco-blue-light text-costco-blue font-medium"
                : "border-gray-200 text-gray-500 hover:border-gray-300 hover:bg-gray-50"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Action buttons */}
      <div className="flex flex-wrap gap-3 mt-4">
        <button
          onClick={() => handleSubmit("topic_brief")}
          disabled={!topic.trim() || loading}
          className="btn-primary flex items-center gap-2"
        >
          {loading ? (
            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <span>📄</span>
          )}
          Topic Brief
        </button>
        <button
          onClick={() => handleSubmit("daily_debrief")}
          disabled={loading}
          className="btn-secondary flex items-center gap-2"
        >
          {loading ? (
            <span className="w-4 h-4 border-2 border-costco-blue border-t-transparent rounded-full animate-spin" />
          ) : (
            <span>🌐</span>
          )}
          Daily Debrief
        </button>
        <p className="self-center text-xs text-gray-400 ml-auto">
          Powered by {topic.trim() ? "Topic Brief" : "Daily Debrief"} pipeline
        </p>
      </div>
    </div>
  );
}
