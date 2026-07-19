import { DashboardShell } from '@/components/layout/dashboard-shell';
import { ResultsReport } from '@/components/interview/results-report';
export default async function ResultsPage({ params }: { params: Promise<{ id: string }> }) { const { id } = await params; return <DashboardShell><ResultsReport id={id} /></DashboardShell>; }
