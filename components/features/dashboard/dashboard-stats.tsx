// Stat cards row shown at the top of the dashboard overview
import { cn } from "@/utils/cn";

interface Stat {
  label: string;
  value: string;
  delta: string;
  up:    boolean;
}

const DUMMY_STATS: Stat[] = [
  { label: "Total Users",   value: "2,340",  delta: "+12%", up: true  },
  { label: "Active Today",  value: "184",    delta: "+5%",  up: true  },
  { label: "Churned",       value: "23",     delta: "-3%",  up: false },
];

export function DashboardStats() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      {DUMMY_STATS.map((stat) => (
        <div key={stat.label} className="rounded-xl border border-zinc-100 bg-white p-5 shadow-sm">
          <p className="text-sm text-zinc-500">{stat.label}</p>
          <p className="mt-1 text-3xl font-semibold">{stat.value}</p>
          <p className={cn("mt-1 text-xs font-medium", stat.up ? "text-green-600" : "text-red-500")}>
            {stat.delta} vs last month
          </p>
        </div>
      ))}
    </div>
  );
}
