export const analyzeText = async (text: string) => {
  const response = await fetch(
    "https://write-clean-xxxx.vercel.app/api/analyze",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    }
  );

  if (!response.ok) {
    throw new Error("Analysis failed");
  }

  return response.json();
};
