// src/inngest/functions.ts
import { generateText } from "ai";
import { inngest } from "./client";
import { deepseek } from "@ai-sdk/deepseek";

export const demoGenerate = inngest.createFunction(
  { id: "demo-generate", triggers: { event: "demo/generate" } },
  async ({ event }) => {
    const response = await generateText({
      model: deepseek("deepseek-chat"),
      prompt: "What is love?",
    });

    return { message: `Task ${event.data.id} complete`, result: response };
  }
);