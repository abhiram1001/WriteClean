import { AnalysisResult } from "../types";

export const analyzeText = async (text: string): Promise<AnalysisResult> => {
  const response = await fetch("http://localhost:5000/analyze", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
  });

  if (!response.ok) {
    throw new Error("Failed to analyze text");
  }

  return response.json();
};
