import React from "react";

const EXAMPLE_QUERIES = [
  "Red Sea shipping disruptions",
  "China tariff impact on retail",
  "AI regulation in the EU",
  "US Federal Reserve rate decisions",
  "Semiconductor supply chain risk",
  "Consumer confidence trends",
  "WTO dispute updates",
];

export default function LandingState({ onExampleClick }) {
  return (
    <div className="card py-12 text-center">
      <div className="text-4xl mb-4">📰</div>
      <h2 className="text-xl font-bold text-costco-text mb-2">
        Your executive briefing is one click away
      </h2>
      <p className="text-sm text-gray-500 max-w-lg mx-auto mb-8 leading-relaxed">
        Type a topic or select a theme on the left, then click{" "}
        <span className="font-semibold text-costco-red">Topic Brief</span>{" "}
        for a focused analysis, or{" "}
        <span className="font-semibold text-costco-blue">Daily Debrief</span>{" "}
        for a broad global overview — pulled from{" "}
        <span className="font-semibold">19 approved credible sources</span>.
      </p>

      <div className="flex flex-col items-center gap-3">
        <p className="text-xs font-bold uppercase tracking-widest text-gray-400">
          Try these topics
        </p>
        <div className="flex flex-wrap justify-center gap-2">
          {EXAMPLE_QUERIES.map((q) => (
            <button
              key={q}
              onClick={() => onExampleClick(q)}
              className="text-sm border border-gray-200 rounded-full px-3.5 py-1.5 text-gray-600 hover:border-costco-blue hover:text-costco-blue hover:bg-costco-blue-light transition-colors"
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-10 flex justify-center gap-8 text-center">
        {[
          { icon: "🌍", label: "Global Coverage", sub: "44+ countries" },
          { icon: "📡", label: "Live Feeds", sub: "19 approved sources" },
          { icon: "🤖", label: "AI-Distilled", sub: "GPT + Claude pipeline" },
          { icon: "✅", label: "Source-Backed", sub: "Every claim cited" },
        ].map(({ icon, label, sub }) => (
          <div key={label} className="flex flex-col items-center gap-1">
            <span className="text-2xl">{icon}</span>
            <span className="text-xs font-semibold text-gray-700">{label}</span>
            <span className="text-xs text-gray-400">{sub}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
