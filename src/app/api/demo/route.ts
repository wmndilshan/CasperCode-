// POST localhost:3000/api/demo/blocking

import { generateText } from "ai";
import { createDeepSeek } from '@ai-sdk/deepseek';

const deepseek = createDeepSeek({
  apiKey: process.env.DEEPSEEK_API_KEY ?? '',
});

export async function POST() {
  const response = await generateText({
    model: deepseek("deepseek-chat"),
    prompt: "What is love?",
  });

  return Response.json(response);
}