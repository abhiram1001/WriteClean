import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult } from "../types";

const SYSTEM_INSTRUCTION = `
You are "WriteClean", an advanced NLP Text Normalization and Analysis engine. 
Your goal is to simulate accurate NLP pipeline results (Tokenization, POS Tagging, Stemming, Lemmatization) 
and perform deep sentiment analysis that specifically understands Gen Z slang, internet culture, and emojis.

You must output strictly structured JSON data matching the schema provided.

Key responsibilities:
1. **Tokenization & Normalization**: Break text into tokens. Identify Stop Words.
2. **Algorithm Simulation**: For each token, simulate the output of:
   - Porter Stemmer
   - Snowball Stemmer
   - WordNet Lemmatizer
   - spaCy Lemmatizer
3. **Sentiment Analysis**:
   - Analyze the tone. Range: Very Bad, Bad, Neutral, Good, Very Good.
   - Detect Gen Z slang (e.g., "no cap", "slay", "mid", "bet") and explain their impact.
   - Analyze emoji usage.
   - Identify specific sentences that carry strong emotion.
4. **Improvement**: Suggest a "Clean" version of the text suitable for a blog or academic submission, removing toxicity or improving clarity while maintaining the core message.
`;

export const analyzeText = async (text: string): Promise<AnalysisResult> => {
  if (!process.env.API_KEY) {
    throw new Error("API Key is missing. Please check your environment configuration.");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Analyze the following text: "${text}"`,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            tokens: {
              type: Type.ARRAY,
              description: "List of all tokens with their NLP attributes",
              items: {
                type: Type.OBJECT,
                properties: {
                  word: { type: Type.STRING },
                  posTag: { type: Type.STRING, description: "Part of speech tag (e.g., NN, VBZ, JJ)" },
                  isStopWord: { type: Type.BOOLEAN },
                  stemPorter: { type: Type.STRING, description: "Output of Porter Stemmer" },
                  stemSnowball: { type: Type.STRING, description: "Output of Snowball Stemmer" },
                  lemmaWordNet: { type: Type.STRING, description: "Output of WordNet Lemmatizer" },
                  lemmaSpacy: { type: Type.STRING, description: "Output of spaCy Lemmatizer" },
                },
                required: ["word", "posTag", "isStopWord", "stemPorter", "stemSnowball", "lemmaWordNet", "lemmaSpacy"],
              },
            },
            sentiment: {
              type: Type.OBJECT,
              properties: {
                score: { type: Type.NUMBER, description: "Sentiment score from -1.0 (negative) to 1.0 (positive)" },
                label: { type: Type.STRING, enum: ["Very Good", "Good", "Neutral", "Bad", "Very Bad"] },
                explanation: { type: Type.STRING, description: "Brief explanation of the sentiment" },
                emotionalSentences: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Sentences with strong emotion" },
                slangDetected: { type: Type.ARRAY, items: { type: Type.STRING }, description: "List of slang words found" },
                emojiSentiment: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Explanation of emojis used" },
              },
              required: ["score", "label", "explanation", "emotionalSentences", "slangDetected", "emojiSentiment"],
            },
            improvement: {
              type: Type.OBJECT,
              properties: {
                original: { type: Type.STRING },
                improved: { type: Type.STRING, description: "Rewritten cleaner version" },
                changes: { type: Type.ARRAY, items: { type: Type.STRING }, description: "List of key changes made" },
              },
              required: ["original", "improved", "changes"],
            },
          },
          required: ["tokens", "sentiment", "improvement"],
        },
      },
    });

    const resultText = response.text;
    if (!resultText) {
      throw new Error("No response received from AI.");
    }

    const parsedData = JSON.parse(resultText);
    return { ...parsedData, rawText: text };

  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    throw error;
  }
};
