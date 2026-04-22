import React from "react";

export default function ErrorState({ error, onRetry }) {
  const isApiKeyError =
    error?.includes("OPENAI_API_KEY") || error?.includes("API key");

  return (
    <div className="card border border-red-200 bg-red-50 py-10 text-center">
      <div className="text-3xl mb-3">⚠️</div>
      <h2 className="text-lg font-bold text-red-700 mb-2">
        {isApiKeyError ? "API Key Required" : "Something went wrong"}
      </h2>
      <p className="text-sm text-red-600 max-w-md mx-auto mb-4 leading-relaxed">
        {isApiKeyError
          ? "An OpenAI API key is required to generate the newsletter. Copy server/.env.example to server/.env and add your key."
          : error || "An unexpected error occurred."}
      </p>
      {isApiKeyError && (
        <pre className="text-left text-xs bg-white border border-red-200 rounded-md px-4 py-3 max-w-sm mx-auto text-red-700 mb-4">
          {`# server/.env\nOPENAI_API_KEY=sk-...\nANTHROPIC_API_KEY=sk-ant-...`}
        </pre>
      )}
      <button onClick={onRetry} className="btn-primary text-sm py-2 px-4">
        Try again
      </button>
    </div>
  );
}
