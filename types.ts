export interface TokenData {
  word: string;
  posTag: string;
  isStopWord: boolean;
  stemPorter: string;
  stemSnowball: string;
  lemmaWordNet: string;
  lemmaSpacy: string;
}

export interface SentimentData {
  score: number; // -1 to 1
  label: 'Very Good' | 'Good' | 'Neutral' | 'Bad' | 'Very Bad';
  explanation: string;
  emotionalSentences: string[];
  slangDetected: string[];
  emojiSentiment: string[];
}

export interface ImprovementData {
  original: string;
  improved: string;
  changes: string[];
}

export interface AnalysisResult {
  tokens: TokenData[];
  sentiment: SentimentData;
  improvement: ImprovementData;
  rawText: string;
}

export enum ViewMode {
  INPUT = 'INPUT',
  ANALYSIS = 'ANALYSIS',
}