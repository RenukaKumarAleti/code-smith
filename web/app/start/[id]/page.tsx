import { ProjectDashboard } from "@/components/walkthrough/project-dashboard";

export const metadata = {
  title: "Project — Walkthrough",
};

type Props = { params: Promise<{ id: string }> };

export default async function ProjectPage({ params }: Props) {
  const { id } = await params;
  return <ProjectDashboard projectId={id} />;
}
