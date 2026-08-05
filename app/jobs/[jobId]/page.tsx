import JobStatusView from "@/components/JobStatusView";

export default async function JobPage({
  params,
}: {
  params: Promise<{ jobId: string }>;
}) {
  const { jobId } = await params;

  return <JobStatusView jobId={jobId} />;
}