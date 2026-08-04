import { Suspense } from "react";
import JobStatusView from "@/components/JobStatusView";

export default async function JobPage({
  params,
}: {
  params: Promise<{ jobId: string }>;
}) {
  const { jobId } = await params;

  return (
    <Suspense fallback={null}>
      <JobStatusView jobId={jobId} />
    </Suspense>
  );
}