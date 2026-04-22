import React from "react";

export default function ExecutiveSummary({ summary, mode, topic, metadata }) {
  const modeLabel = mode === "topic_brief" ? "Topic Brief" : "Daily Debrief";
  const modeColor = mode === "topic_brief" ? "bg-costco-red text-white" : "bg-costco-blue text-white";

  return (
    <div className="card border-l-4 border-costco-blue">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-2 flex-wrap">
          <span className={`tag ${modeColor} text-xs`}>{modeLabel}</span>
          {topic && (
            <span className="tag bg-costco-red-light text-costco-red border border-costco-red/20">
              {topic}
            </span>
          )}
          {metadata?.date_from && metadata?.date_to && (
            <span className="tag bg-gray-100 text-gray-500">
              {metadata.date_from} → {metadata.date_to}
            </span>
          )}
        </div>
        <div className="text-xs text-gray-400 whitespace-nowrap">
          {metadata?.total_articles_processed != null && (
            <span>
              {metadata.total_articles_processed} articles ·{" "}
              {metadata.total_sources_used} sources
            </span>
          )}
        </div>
      </div>

      <div className="mt-3">
        <h2 className="text-xs font-bold uppercase tracking-widest text-costco-gray-dark mb-2">
          Executive Summary
        </h2>
        <p className="text-base text-costco-text leading-relaxed font-medium">
          {summary}
        </p>
      </div>

      {metadata?.generated_at && (
        <p className="text-xs text-gray-400 mt-3">
          Generated{" "}
          {new Date(metadata.generated_at).toLocaleString("en-US", {
            dateStyle: "medium",
            timeStyle: "short",
          })}
          {metadata._refined === false && (
            <span className="ml-2 text-amber-500">
              · GPT draft (Claude refinement unavailable)
            </span>
          )}
        </p>
      )}
    </div>
  );
}
