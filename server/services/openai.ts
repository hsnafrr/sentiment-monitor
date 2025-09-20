import OpenAI from "openai";

// the newest OpenAI model is "gpt-5" which was released August 7, 2025. do not change this unless explicitly requested by the user
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || process.env.OPENAI_KEY || ""
});

export interface SentimentResult {
  label: "positive" | "negative" | "neutral";
  score: number;
  confidence: number;
}

export async function analyzeSentimentWithOpenAI(text: string): Promise<SentimentResult> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-5",
      messages: [
        {
          role: "system",
          content: "You are a sentiment analysis expert. Analyze the sentiment of the text and provide a label (positive, negative, or neutral), a score between -1 (very negative) and 1 (very positive), and a confidence score between 0 and 1. Respond with JSON in this format: { 'label': string, 'score': number, 'confidence': number }",
        },
        {
          role: "user",
          content: text,
        },
      ],
      response_format: { type: "json_object" },
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");

    return {
      label: result.label,
      score: Math.max(-1, Math.min(1, result.score)),
      confidence: Math.max(0, Math.min(1, result.confidence)),
    };
  } catch (error) {
    throw new Error("Failed to analyze sentiment with OpenAI: " + (error as Error).message);
  }
}

export async function batchAnalyzeSentiment(texts: string[]): Promise<SentimentResult[]> {
  const results: SentimentResult[] = [];
  
  for (const text of texts) {
    try {
      const result = await analyzeSentimentWithOpenAI(text);
      results.push(result);
    } catch (error) {
      // Fallback to neutral if analysis fails
      results.push({
        label: "neutral",
        score: 0,
        confidence: 0,
      });
    }
  }
  
  return results;
}
