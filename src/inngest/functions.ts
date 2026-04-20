// src/inngest/functions.ts
import { generateText } from "ai";
import { Firecrawl } from "@mendable/firecrawl-js";
import { deepseek } from "@ai-sdk/deepseek";
import { inngest } from "./client";

const URL_REGEX = /https?:\/\/[^\s]+/g;

function promptFromEvent(event: { data?: unknown } | undefined): string {
  const raw = (event?.data as { prompt?: unknown } | undefined)?.prompt;
  if (raw == null) return "";
  return typeof raw === "string" ? raw : String(raw);
}

const firecrawl = new Firecrawl({
  apiKey: process.env.FIRECRAWL_API_KEY,
});

export const demoGenerate = inngest.createFunction(
  { id: "demo-generate", triggers: { event: "demo/generate" } },
  async ({ event, step }) => {
    const data = (event.data ?? {}) as { id?: string };
    const prompt = promptFromEvent(event);
    const { id } = data;

    const urls = (await step.run("extract-urls", async () => {
      // Read from `event` inside the step: step bodies must not rely on outer
      // lexical bindings, which can be undefined when Inngest re-executes steps.
      const text = promptFromEvent(event);
      return text.match(URL_REGEX) ?? [];
    })) as string[];

    const scrapedContent = await step.run("scrape-urls", async () => {
      if (urls.length === 0) return [];
      return Promise.all(
        urls.map(async (url) => {
          const doc = await firecrawl.scrape(url, { formats: ["markdown"] });
          return { url, markdown: doc.markdown ?? "" };
        }),
      );
    });

    const context =
      scrapedContent.length > 0
        ? `\n\n## Scraped pages\n${scrapedContent.map((c) => `### ${c.url}\n${c.markdown}`).join("\n\n")}`
        : "";

    const response = await generateText({
      model: deepseek("deepseek-chat"),
      prompt: `${prompt}${context}`,
    });

    return {
      message: `Task ${id ?? "unknown"} complete`,
      result: response,
      scrapedContent,
    };
  },
);

export const demoError = inngest.createFunction(
  { id: "demo-error", triggers: { event: "demo/error" } },
  async ({ step }) => {
    await step.run("fail", async () => {
      throw new Error("Inngest error: Something went wrong in the Inngest function");
    })
  },
);