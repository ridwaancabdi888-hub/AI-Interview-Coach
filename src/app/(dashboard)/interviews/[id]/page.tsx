import { DashboardShell } from '@/components/layout/dashboard-shell';
import { InterviewRoom } from '@/components/interview/interview-room';

export default async function InterviewPage({ params }: { params: Promise<{ id: string }> }) { const { id } = await params; return <DashboardShell><InterviewRoom id={id} /></DashboardShell>; }
