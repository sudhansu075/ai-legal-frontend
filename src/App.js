import React, { useState } from "react";
import RiskChart from "./components/RiskChart";

function App() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleUpload = async () => {
    if (!file) {
      setError("Please upload a contract file.");
      return;
    }

    setError(""); // clear previous error
    setLoading(true);

    const formData = new FormData();
    formData.append("file", file);

    setLoading(true);

    try {
      const response = await fetch(
        "https://ai-legal-analyzer-w3ad.onrender.com/analyze/",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError("Something went wrong. Please try again.");
    }
    setLoading(false);
  };

  const riskColor = {
    Low: "bg-green-600",
    Medium: "bg-yellow-500",
    High: "bg-red-600",
  };

  return (
    <div className="min-h-screen p-10">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <h1 className="text-4xl font-extrabold text-center mb-8">
          AI Contract Risk Analyzer
        </h1>

        {/* Upload Card */}
        <div className="flex flex-col items-center space-y-6">
          <input
            type="file"
            onChange={(e) => setFile(e.target.files[0])}
            className="hidden"
            id="fileUpload"
          />

          {/* Custom Upload Button */}
          <label
            htmlFor="fileUpload"
            className="cursor-pointer bg-gray-800 px-6 py-3 rounded-xl font-semibold hover:bg-gray-700 transition"
          >
            {file ? file.name : "Choose Contract File"}
          </label>

          {error && (
            <div className="text-red-500 font-semibold text-center mt-2">
              {error}
            </div>
          )}
          <button
            onClick={handleUpload}
            disabled={loading}
            className={`flex items-center justify-center gap-2
            px-8 py-3 rounded-xl font-bold shadow-lg
            transition transform
            ${loading
                ? "bg-gray-700 cursor-not-allowed"
                : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:scale-105"
              }`}
          >
            {loading ? (
              <>
                {/* Spinner */}
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Analyzing...
              </>
            ) : (
              "Analyze Contract"
            )}
          </button>
        </div>

        {/* Results */}
        {result && (
          <div>

            {/* Overall Risk */}
            <div className="bg-gray-900 p-8 rounded-2xl shadow-xl mb-8 text-center">

              <h2 className="text-2xl font-bold mb-4">
                Overall Risk
              </h2>

              <div className="flex justify-center mb-3">
                <span
                  className={`px-6 py-2 rounded-full text-white font-bold text-lg ${riskColor[result.overall_risk]}`}
                >
                  {result.overall_risk}
                </span>
              </div>

              <p className="text-gray-400">
                Risk Score: {result.risk_score}
              </p>

            </div>
            <RiskChart analysis={result.analysis} />

            {/* Clause Cards */}
            <div className="space-y-6">
              {result.analysis.map((clause, index) => (
                <div
                  key={index}
                  className="bg-gray-900 p-6 rounded-2xl shadow-lg"
                >
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="text-xl font-semibold">
                      Clause {index + 1}
                    </h3>

                    <span
                      className={`px-3 py-1 rounded-full text-sm font-semibold ${riskColor[clause.risk_level]}`}
                    >
                      {clause.risk_level}
                    </span>
                  </div>

                  <p className="text-gray-300 mb-3">
                    <strong>Summary:</strong> {clause.summary}
                  </p>

                  <p className="text-gray-400 mb-2">
                    <strong>Risk Reason:</strong> {clause.risk_reason}
                  </p>

                  <p className="text-blue-400">
                    <strong>Renegotiation Suggestion:</strong>{" "}
                    {clause.renegotiation_suggestion}
                  </p>

                  <p className="mt-2 text-sm text-gray-500">
                    One-Sided: {clause.one_sided ? "Yes" : "No"}
                  </p>
                </div>
              ))}
            </div>

          </div>
        )}

      </div>
    </div>
  );
}

export default App;