import React from "react";

const STEPS = [
  { icon: "📡", label: "Fetching RSS feeds from approved sources…" },
  { icon: "🔍", label: "Filtering and clustering articles by date range…" },
  { icon: "🧠", label: "Running GPT extraction pipeline…" },
  { icon: "✍️", label: "Claude Sonnet refining for executive tone…" },
  { icon: "📄", label: "Assembling your brief…" },
];

export default function LoadingState({ mode, topic }) {
  const [step, setStep] = React.useState(0);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setStep((s) => Math.min(s + 1, STEPS.length - 1));
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="card flex flex-col items-center justify-center py-16 text-center">
      {/* Spinner */}
      <div className="relative mb-6">
        <div className="w-14 h-14 rounded-full border-4 border-costco-blue-light border-t-costco-blue animate-spin" />
        <div className="absolute inset-0 flex items-center justify-center text-xl">
          {STEPS[step].icon}
        </div>
      </div>

      <h2 className="text-lg font-bold text-costco-text mb-1">
        {mode === "topic_brief"
          ? `Building Topic Brief for "${topic}"`
          : "Building Daily Debrief"}
      </h2>
      <p className="text-sm text-gray-500 mb-6 max-w-sm">
        This may take 20–60 seconds. We are fetching live feeds, extracting facts, and refining for executive quality.
      </p>

      {/* Progress steps */}
      <div className="w-full max-w-sm space-y-2 text-left">
        {STEPS.map((s, i) => (
          <div
            key={i}
            className={`flex items-center gap-2.5 text-sm transition-all duration-300 ${
              i < step
                ? "text-green-600"
                : i === step
                ? "text-costco-blue font-medium"
                : "text-gray-300"
            }`}
          >
            <span className="w-4 text-center text-xs">
              {i < step ? "✓" : i === step ? "›" : "○"}
            </span>
            <span>{s.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
