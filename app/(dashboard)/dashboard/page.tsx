// Dashboard overview page — route: /dashboard
import { DashboardStats } from "@/components/features/dashboard/dashboard-stats";
import { RecentUsers } from "@/components/features/dashboard/recent-users";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Dashboard</h1>
      <DashboardStats />
      <RecentUsers />
    </div>
  );
}
