import React, { useState } from "react";

const CATEGORY_STYLES = {
  Tariffs: "bg-amber-50 text-amber-700 border-amber-200",
  "Foreign Affairs": "bg-purple-50 text-purple-700 border-purple-200",
  Geography: "bg-teal-50 text-teal-700 border-teal-200",
  "Supply Chain": "bg-blue-50 text-blue-700 border-blue-200",
  Retail: "bg-red-50 text-red-700 border-red-200",
  AI: "bg-violet-50 text-violet-700 border-violet-200",
  Markets: "bg-green-50 text-green-700 border-green-200",
  Regulation: "bg-orange-50 text-orange-700 border-orange-200",
  "Consumer Trends": "bg-pink-50 text-pink-700 border-pink-200",
  General: "bg-gray-50 text-gray-700 border-gray-200",
};

export default function Insight({ insight, index }) {
  const [expanded, setExpanded] = useState(false);
  const categoryStyle =
    CATEGORY_STYLES[insight.category] || CATEGORY_STYLES.General;

  return (
    <article className="card hover:shadow-card-hover transition-shadow duration-150">
      <div className="flex items-start gap-3">
        {/* Index number */}
        <div className="flex-shrink-0 w-7 h-7 rounded-full bg-costco-blue text-white flex items-center justify-center text-xs font-bold mt-0.5">
          {index + 1}
        </div>

        <div className="flex-1 min-w-0">
          {/* Category tag */}
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <span
              className={`tag border text-xs ${categoryStyle}`}
            >
              {insight.category}
            </span>
            {insight.geopolitical_relevance && (
              <span className="tag bg-gray-100 text-gray-500 border border-gray-200 text-xs">
                🌍 Geopolitical
              </span>
            )}
          </div>

          {/* Headline */}
          <h3 className="text-base font-bold text-costco-text leading-snug mb-2">
            {insight.headline}
          </h3>

          {/* Executive summary */}
          <p className="text-sm text-gray-700 leading-relaxed mb-2">
            {insight.executive_summary}
          </p>

          {/* Why it matters */}
          <div className="bg-costco-blue-light border-l-2 border-costco-blue rounded-r-md px-3 py-2 mb-3">
            <span className="text-xs font-bold uppercase tracking-wide text-costco-blue">
              Why it matters
            </span>
            <p className="text-sm text-gray-700 mt-0.5 leading-relaxed">
              {insight.why_it_matters}
            </p>
          </div>

          {/* Geopolitical context (expandable) */}
          {insight.geopolitical_relevance && (
            <div className="mb-3">
              <button
                onClick={() => setExpanded(!expanded)}
                className="text-xs text-costco-blue font-medium hover:underline flex items-center gap-1"
              >
                {expanded ? "▾" : "▸"} Geopolitical context
              </button>
              {expanded && (
                <p className="text-xs text-gray-600 mt-1.5 leading-relaxed bg-gray-50 rounded-md px-3 py-2">
                  {insight.geopolitical_relevance}
                </p>
              )}
            </div>
          )}

          {/* Sources */}
          <div className="flex flex-wrap gap-x-3 gap-y-1">
            {insight.sources?.map((src, i) => (
              <a
                key={i}
                href={src.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-costco-blue hover:text-costco-blue-dark hover:underline flex items-center gap-1"
                title={src.title}
              >
                <span className="text-gray-400">↗</span>
                {src.publisher}
              </a>
            ))}
          </div>
        </div>
      </div>
    </article>
  );
}
