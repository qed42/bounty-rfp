"use client"

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ReactNode, useState } from "react"

// Wraps react-query client so it's available across the app
export function ReactQueryClientProvider({ children }: { children: ReactNode }) {
  const [client] = useState(() => new QueryClient())

  return <QueryClientProvider client={client}>{children}</QueryClientProvider>
}
