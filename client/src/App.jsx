import React, { useState } from "react";
import Header from "./components/Header.jsx";
import Sidebar from "./components/Sidebar.jsx";
import SearchPanel from "./components/SearchPanel.jsx";
import Newsletter from "./components/Newsletter.jsx";
import LoadingState from "./components/LoadingState.jsx";
import LandingState from "./components/LandingState.jsx";
import ErrorState from "./components/ErrorState.jsx";
import { generateNewsletter } from "./api/client.js";

export default function App() {
  const [state, setState] = useState("idle"); // idle | loading | done | error
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [lastRequest, setLastRequest] = useState(null);
  const [prefillTopic, setPrefillTopic] = useState(undefined);
  const [activeTheme, setActiveTheme] = useState(null);

  async function handleSubmit({ mode, topic, dateFrom, dateTo }) {
    setState("loading");
    setError(null);
    setLastRequest({ mode, topic, dateFrom, dateTo });
    try {
      const data = await generateNewsletter({ mode, topic, dateFrom, dateTo });
      setResult(data);
      setState("done");
    } catch (err) {
      setError(err.message);
      setState("error");
    }
  }

  function handleThemeSelect(themeId) {
    setActiveTheme(themeId);
    setPrefillTopic(themeId || "");
  }

  function handleExampleClick(query) {
    setPrefillTopic(query);
  }

  function handleRetry() {
    if (lastRequest) handleSubmit(lastRequest);
  }

  function handleReset() {
    setState("idle");
    setResult(null);
    setError(null);
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <div className="flex-1 max-w-screen-2xl mx-auto w-full px-4 sm:px-6 py-5 flex gap-5">
        {/* Left Sidebar */}
        <Sidebar onThemeSelect={handleThemeSelect} activeTheme={activeTheme} />

        {/* Main content */}
        <main className="flex-1 min-w-0 flex flex-col gap-4">
          <SearchPanel
            onSubmit={handleSubmit}
            loading={state === "loading"}
            prefillTopic={prefillTopic}
          />

          {state === "idle" && (
            <LandingState onExampleClick={handleExampleClick} />
          )}

          {state === "loading" && (
            <LoadingState
              mode={lastRequest?.mode}
              topic={lastRequest?.topic}
            />
          )}

          {state === "error" && (
            <ErrorState error={error} onRetry={handleRetry} />
          )}

          {state === "done" && result && (
            <>
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold text-gray-500">
                  {result.newsletter?.mode === "topic_brief"
                    ? `Topic Brief: "${result.newsletter?.metadata?.topic}"`
                    : "Daily Debrief"}
                </h2>
                <button
                  onClick={handleReset}
                  className="text-xs text-gray-400 hover:text-costco-blue underline"
                >
                  ← New search
                </button>
              </div>
              <Newsletter
                data={result}
                sourceStatus={result.sourceStatus}
              />
            </>
          )}
        </main>
      </div>

      <footer className="border-t border-costco-gray-mid bg-white mt-auto">
        <div className="max-w-screen-2xl mx-auto px-6 py-3 flex items-center justify-between text-xs text-gray-400">
          <span>© Costco Wholesale — Internal Tool — Not for External Distribution</span>
          <span>RSS sources · GPT-4o extraction · Claude Sonnet refinement</span>
        </div>
      </footer>
    </div>
  );
}
