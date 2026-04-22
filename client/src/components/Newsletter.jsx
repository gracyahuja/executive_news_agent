import React, { useRef, useState } from "react";
import ExecutiveSummary from "./ExecutiveSummary.jsx";
import Insight from "./Insight.jsx";
import { exportToPDF } from "../utils/pdf.js";

export default function Newsletter({ data, sourceStatus }) {
  const exportRef = useRef(null);
  const [exporting, setExporting] = useState(false);
  const [filterCategory, setFilterCategory] = useState(null);

  const { newsletter } = data;
  const insights = newsletter.insights || [];
  const categories = [...new Set(insights.map((i) => i.category))].sort();

  const filtered = filterCategory
    ? insights.filter((i) => i.category === filterCategory)
    : insights;

  async function handleExportPDF() {
    setExporting(true);
    try {
      const filename = `Costco-Executive-Brief-${newsletter.mode === "topic_brief" ? newsletter.metadata?.topic?.replace(/\s+/g, "-") || "Topic" : "Daily-Debrief"}-${newsletter.metadata?.date_to || ""}`;
      await exportToPDF(exportRef.current, filename);
    } catch (err) {
      alert(`PDF export failed: ${err.message}`);
    } finally {
      setExporting(false);
    }
  }

  const failedSources = sourceStatus?.filter((s) => s.error) || [];

  return (
    <div>
      {/* Toolbar */}
      <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm font-semibold text-gray-600">
            {insights.length} insight{insights.length !== 1 ? "s" : ""}
          </span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() =>
                setFilterCategory(filterCategory === cat ? null : cat)
              }
              className={`text-xs px-2.5 py-1 rounded-full border transition-colors ${
                filterCategory === cat
                  ? "border-costco-blue bg-costco-blue-light text-costco-blue font-medium"
                  : "border-gray-200 text-gray-500 hover:border-gray-300"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <button
          onClick={handleExportPDF}
          disabled={exporting || insights.length === 0}
          className="btn-primary flex items-center gap-2 text-sm py-2 px-4"
        >
          {exporting ? (
            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            "⬇"
          )}
          {exporting ? "Exporting…" : "Export PDF"}
        </button>
      </div>

      {/* Failed sources notice */}
      {failedSources.length > 0 && (
        <div className="mb-3 bg-amber-50 border border-amber-200 rounded-md px-4 py-2.5 flex items-start gap-2">
          <span className="text-amber-500 mt-0.5 flex-shrink-0">⚠</span>
          <p className="text-xs text-amber-700">
            <span className="font-semibold">
              {failedSources.length} source{failedSources.length > 1 ? "s" : ""} unavailable
            </span>{" "}
            during ingestion:{" "}
            {failedSources.map((s) => s.name).join(", ")}. Results reflect
            available sources only.
          </p>
        </div>
      )}

      {/* Newsletter content for PDF export */}
      <div ref={exportRef} className="newsletter-export-root space-y-4">
        {/* PDF header (visible in export) */}
        <div className="hidden-screen bg-white px-8 py-4 border-b-2 border-costco-blue print-only">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xl font-black text-costco-red tracking-tight">
                COSTCO WHOLESALE
              </div>
              <div className="text-sm text-costco-blue font-semibold">
                Executive Intelligence Briefing — Internal Use Only
              </div>
            </div>
            <div className="text-xs text-gray-400 text-right">
              <div>Generated {new Date(newsletter.metadata?.generated_at).toLocaleString()}</div>
              <div className="font-medium">CONFIDENTIAL</div>
            </div>
          </div>
        </div>

        <ExecutiveSummary
          summary={newsletter.executive_summary}
          mode={newsletter.mode}
          topic={newsletter.metadata?.topic}
          metadata={newsletter.metadata}
        />

        {filtered.length === 0 ? (
          <div className="card text-center py-10 text-gray-400">
            No insights match the selected filter.
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((insight, i) => (
              <Insight key={insight.id || i} insight={insight} index={i} />
            ))}
          </div>
        )}

        {/* Source attribution footer */}
        <div className="card bg-gray-50">
          <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">
            Source Universe
          </h3>
          <div className="flex flex-wrap gap-2">
            {sourceStatus?.filter((s) => !s.error && s.articleCount > 0).map((s) => (
              <span
                key={s.sourceId}
                className="text-xs text-gray-500 bg-white border border-gray-200 px-2 py-0.5 rounded"
              >
                {s.name} ({s.articleCount})
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
