import React, { useState } from "react";

function App() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);

  const handleUpload = async () => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch("http://127.0.0.1:8000/analyze/", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();
    setResult(data);
  };

  const getColor = (risk) => {
    if (risk === "High") return "red";
    if (risk === "Medium") return "orange";
    return "green";
  };

  return (
    <div style={{ padding: 40 }}>
      <h1>AI Contract Risk Analyzer</h1>

      <input
        type="file"
        onChange={(e) => setFile(e.target.files[0])}
      />

      <button onClick={handleUpload}>
        Analyze Contract
      </button>

      {result && (
        <div>
          <h2>
            Overall Risk:
            <span style={{ color: getColor(result.overall_risk) }}>
              {" "} {result.overall_risk}
            </span>
          </h2>

          <h3>Risk Score: {result.risk_score}</h3>

          {result.analysis.map((clause, index) => (
            <div
              key={index}
              style={{
                border: "1px solid #ddd",
                padding: 20,
                marginTop: 20
              }}
            >
              <h4 style={{ color: getColor(clause.risk_level) }}>
                Clause {index + 1} — {clause.risk_level}
              </h4>

              <p><strong>Summary:</strong> {clause.summary}</p>
              <p><strong>Risk Reason:</strong> {clause.risk_reason}</p>
              <p><strong>Renegotiation:</strong> {clause.renegotiation_suggestion}</p>
              <p><strong>One Sided:</strong> {clause.one_sided ? "Yes" : "No"}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;