// localhost:300/demo
"use client"

import { Button } from "@/components/ui/button"
import * as Sentry from "@sentry/nextjs"
import { useState } from "react"

export default function DemoPage() {

  const [loading, setLoading] = useState(false)

  const hnadleBlocking  = async () => {
    setLoading(true)
    await fetch("/api/demo/blocking", { method: "POST" });
    setLoading(false)
  }

  const handleClientError = () => {
    const err = new Error(
      "Client error: Something went wrong in the browser",
    )
    // React event handlers do not bubble to window.onerror; report explicitly.
    Sentry.captureException(err)
    throw err
  }

  const handleApiError = async () => {
    await fetch("/api/demo/error", { method: "POST" });
  }

  const handleInngestError = async () => {
    await fetch("/api/demo/inngest-error", { method: "POST" });
  }

  return (
    <div className="p-8 space-x-4">
      <Button disabled={loading} onClick={hnadleBlocking}>
        {loading ? "Loading..." : "Blocking"}
      </Button>
      <Button onClick={handleClientError} variant="destructive">
        Client Error
      </Button>
      <Button onClick={handleApiError} variant="destructive">
        API Error
      </Button>
      <Button onClick={handleInngestError} variant="destructive">
        Inngest Error
      </Button>
    </div>
  )
}