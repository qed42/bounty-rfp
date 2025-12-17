import "./globals.css"
import { ReactQueryClientProvider } from "@/lib/react-query"
import { Sidebar } from "@/components/Sidebar"
import { Navbar } from "@/components/Navbar"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-gray-50 text-gray-900 dark:bg-black dark:text-gray-100">
        <div className="flex min-h-screen">
          <Sidebar />

          <div className="flex flex-1 flex-col">
            <Navbar />

            <ReactQueryClientProvider>
              <main className="flex-1 p-6 bg-gray-50 dark:bg-black">
                {children}
              </main>
            </ReactQueryClientProvider>
          </div>
        </div>
      </body>
    </html>
  )
}
