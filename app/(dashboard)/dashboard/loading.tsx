// Skeleton shown while the dashboard page suspends
export default function DashboardLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-8 w-40 rounded-md bg-zinc-100" />
      <div className="grid grid-cols-3 gap-4">
        {[0, 1, 2].map((i) => (
          <div key={i} className="h-28 rounded-xl bg-zinc-100" />
        ))}
      </div>
      <div className="h-64 rounded-xl bg-zinc-100" />
    </div>
  );
}
