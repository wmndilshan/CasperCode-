// src/inngest/client.ts
import { Inngest } from "inngest";
import { sentryMiddleware } from "@inngest/middleware-sentry";

export const inngest = new Inngest({
  id: "casper-code",
  middleware: [
    sentryMiddleware({
      // Step throws (e.g. demo/error) are step-scoped; surface them as issues.
      captureStepErrors: true,
      // Default true only reports after Inngest exhausts retries — easy to miss in dev.
      onlyCaptureFinalAttempt: false,
    }),
  ],
});