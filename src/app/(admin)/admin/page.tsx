import { getHealthData } from "@/lib/admin/health";
import { DashboardShell } from "@/components/admin/DashboardShell";

export const revalidate = 0;

export default async function AdminDashboardPage() {
  const health = await getHealthData();

  return <DashboardShell health={health} />;
}
