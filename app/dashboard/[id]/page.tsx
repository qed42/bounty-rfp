"use client"

import { useParams } from "next/navigation"
import { useQuery } from "@tanstack/react-query"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Skeleton } from "@/components/ui/skeleton"

// Mock API Fetcher
async function fetchRfpDetail(id: string) {
  // Replace with actual API
  const response = await fetch(`/api/rfps/${id}`)
  if (!response.ok) throw new Error("Failed to fetch RFP detail")
  return response.json()
}

export default function RfpDetailPage() {
  const { id } = useParams()
  const { data, isLoading, error } = useQuery({
    queryKey: ["rfpDetail", id],
    queryFn: () => fetchRfpDetail(id as string),
    enabled: !!id,
  })

  if (isLoading) return <Skeleton className="h-96 w-full" />
  if (error) return <p className="text-red-500">Failed to load RFP details.</p>

  return (
    <div className="grid grid-cols-3 gap-6 p-6">
      {/* ---- Left Section: Main RFP Detail ---- */}
      <div className="col-span-2 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-semibold">{data?.title}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold">Summary</h3>
              <p className="text-gray-600">{data?.summary || "No summary available."}</p>
            </div>

            <Separator />

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <strong>Budget:</strong> ${data?.budget || "N/A"}
              </div>
              <div>
                <strong>Deadline:</strong> {data?.deadline || "N/A"}
              </div>
              <div>
                <strong>Sector:</strong> {data?.sector || "N/A"}
              </div>
              <div>
                <strong>Location:</strong> {data?.country || "N/A"}
              </div>
              <div>
                <strong>Tech Stack:</strong> {data?.techStack?.join(", ") || "N/A"}
              </div>
              <div>
                <strong>Language:</strong> {data?.language || "English"}
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="font-semibold">Full Description</h3>
              <ScrollArea className="h-[400px] mt-2 border rounded-md p-3">
                <p className="text-gray-700 whitespace-pre-line">{data?.description}</p>
              </ScrollArea>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ---- Right Section: Reports ---- */}
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Reports & Insights</CardTitle>
          </CardHeader>
          <CardContent>
            {data?.reports?.length ? (
              <ul className="list-disc ml-4 space-y-2">
                {data.reports.map((report: any, idx: number) => (
                  <li key={idx}>
                    <a
                      href={report.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      {report.title}
                    </a>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 text-sm">No reports available.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
