// Table of recently joined users — in a real app this would call useFetch
import { formatDate } from "@/utils/format-date";
import type { User } from "@/types/auth";

const DUMMY_USERS: User[] = [
  { id: "1", name: "Alice Martin",  email: "alice@example.com",  role: "admin", createdAt: "2026-06-20T10:00:00Z" },
  { id: "2", name: "Bob Chen",      email: "bob@example.com",    role: "user",  createdAt: "2026-06-22T14:30:00Z" },
  { id: "3", name: "Carol Nguyen",  email: "carol@example.com",  role: "user",  createdAt: "2026-06-24T09:15:00Z" },
];

export function RecentUsers() {
  return (
    <div className="rounded-xl border border-zinc-100 bg-white shadow-sm">
      <div className="border-b border-zinc-100 px-5 py-4">
        <h2 className="text-sm font-semibold">Recent Users</h2>
      </div>
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-zinc-100 text-left text-xs text-zinc-400">
            <th className="px-5 py-3 font-medium">Name</th>
            <th className="px-5 py-3 font-medium">Email</th>
            <th className="px-5 py-3 font-medium">Role</th>
            <th className="px-5 py-3 font-medium">Joined</th>
          </tr>
        </thead>
        <tbody>
          {DUMMY_USERS.map((user) => (
            <tr key={user.id} className="border-b border-zinc-50 last:border-0">
              <td className="px-5 py-3 font-medium">{user.name}</td>
              <td className="px-5 py-3 text-zinc-500">{user.email}</td>
              <td className="px-5 py-3">
                <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs font-medium capitalize">
                  {user.role}
                </span>
              </td>
              <td className="px-5 py-3 text-zinc-500">{formatDate(user.createdAt)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
