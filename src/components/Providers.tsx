"use client"

import { ThemeProvider }                    from "next-themes"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { SessionProvider }                  from "next-auth/react"
import { Toaster }                          from "react-hot-toast"
import { useState }                         from "react"

export default function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: { queries: { retry: 1, staleTime: 5 * 60 * 1000 } }
  }))

  return (
    <SessionProvider>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background:   "var(--card)",
                color:        "var(--text)",
                border:       "1px solid var(--border)",
                borderRadius: "12px",
              },
              success: { iconTheme: { primary: "#f97316", secondary: "#fff" } },
            }}
          />
        </ThemeProvider>
      </QueryClientProvider>
    </SessionProvider>
  )
}