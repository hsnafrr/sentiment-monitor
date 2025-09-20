import { analyzeSentimentWithOpenAI, SentimentResult } from "./openai";

// Vader sentiment fallback (simple implementation)
function vaderSentiment(text: string): SentimentResult {
  const positiveWords = ['good', 'great', 'excellent', 'amazing', 'wonderful', 'fantastic', 'love', 'awesome', 'perfect', 'best'];
  const negativeWords = ['bad', 'terrible', 'awful', 'hate', 'worst', 'horrible', 'disgusting', 'disappointing', 'fail', 'broken'];
  
  const words = text.toLowerCase().split(/\s+/);
  let positiveCount = 0;
  let negativeCount = 0;
  
  words.forEach(word => {
    if (positiveWords.some(pw => word.includes(pw))) positiveCount++;
    if (negativeWords.some(nw => word.includes(nw))) negativeCount++;
  });
  
  const totalSentimentWords = positiveCount + negativeCount;
  if (totalSentimentWords === 0) {
    return { label: "neutral", score: 0, confidence: 0.5 };
  }
  
  const score = (positiveCount - negativeCount) / totalSentimentWords;
  const confidence = Math.min(totalSentimentWords / words.length, 1);
  
  let label: "positive" | "negative" | "neutral" = "neutral";
  if (score > 0.1) label = "positive";
  else if (score < -0.1) label = "negative";
  
  return { label, score, confidence };
}

export async function analyzeSentiment(text: string): Promise<SentimentResult> {
  try {
    // Try OpenAI first
    return await analyzeSentimentWithOpenAI(text);
  } catch (error) {
    console.warn("OpenAI sentiment analysis failed, falling back to Vader:", error);
    // Fallback to Vader sentiment
    return vaderSentiment(text);
  }
}

export async function analyzeBatchSentiment(texts: string[]): Promise<SentimentResult[]> {
  const results: SentimentResult[] = [];
  
  for (const text of texts) {
    const result = await analyzeSentiment(text);
    results.push(result);
  }
  
  return results;
}
