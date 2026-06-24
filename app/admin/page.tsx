"use client";

import { useState, useEffect, useCallback } from "react";

type Submission = {
  id: string;
  created_at: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  employees: string;
  message: string;
  status: "new" | "contacted" | "converted";
};

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [authError, setAuthError] = useState("");
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [storedPassword, setStoredPassword] = useState("");

  const fetchSubmissions = useCallback(async (pwd: string) => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/submissions", {
        headers: {
          Authorization: `Bearer ${pwd}`,
        },
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to fetch");
      }
      const data = await res.json();
      setSubmissions(data.submissions || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load");
    } finally {
      setLoading(false);
    }
  }, []);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setAuthError("");
    setLoading(true);

    try {
      const res = await fetch("/api/submissions", {
        headers: { Authorization: `Bearer ${password}` },
      });
      if (res.status === 401) {
        setAuthError("Invalid password");
        setLoading(false);
        return;
      }
      const data = await res.json();
      setStoredPassword(password);
      setSubmissions(data.submissions || []);
      setAuthenticated(true);
    } catch {
      setAuthError("Connection error");
    } finally {
      setLoading(false);
    }
  }

  async function updateStatus(id: string, status: string) {
    try {
      const res = await fetch(`/api/submissions/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${storedPassword}`,
        },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        setSubmissions((prev) =>
          prev.map((s) =>
            s.id === id ? { ...s, status: status as Submission["status"] } : s
          )
        );
      }
    } catch (err) {
      console.error("Update error:", err);
    }
  }

  function exportCSV() {
    const headers = [
      "Date",
      "Name",
      "Email",
      "Phone",
      "Company",
      "Employees",
      "Status",
      "Message",
    ];
    const rows = submissions.map((s) => [
      new Date(s.created_at).toLocaleDateString("en-AU"),
      s.name,
      s.email,
      s.phone || "",
      s.company,
      s.employees,
      s.status,
      (s.message || "").replace(/"/g, '""'),
    ]);
    const csv = [headers, ...rows]
      .map((row) => row.map((cell) => `"${cell}"`).join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `preventli-leads-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  const now = new Date();
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const thisWeek = submissions.filter(
    (s) => new Date(s.created_at) >= weekAgo
  ).length;
  const converted = submissions.filter((s) => s.status === "converted").length;
  const conversionRate =
    submissions.length > 0
      ? Math.round((converted / submissions.length) * 100)
      : 0;

  const statusColors = {
    new: "bg-blue-100 text-blue-700",
    contacted: "bg-amber-100 text-amber-700",
    converted: "bg-green-100 text-green-700",
  };

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-[#0A1628] flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl p-10 w-full max-w-md shadow-2xl">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-[#00E676] rounded-xl flex items-center justify-center">
              <svg
                width="20"
                height="20"
                fill="none"
                stroke="#0A1628"
                strokeWidth="2.5"
                viewBox="0 0 24 24"
              >
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
            </div>
            <div>
              <div className="font-bold text-[#0A1628]">Preventli Admin</div>
              <div className="text-gray-400 text-sm">Secure dashboard</div>
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Admin Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#00E676] transition-colors"
                placeholder="Enter admin password"
                autoFocus
              />
              {authError && (
                <p className="text-red-500 text-xs mt-1">{authError}</p>
              )}
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#0A1628] text-white py-3 px-6 rounded-xl font-semibold text-sm hover:bg-[#0D1F3C] transition-colors disabled:opacity-70"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F9FA]">
      {/* Header */}
      <header className="bg-[#0A1628] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-[#00E676] rounded-lg flex items-center justify-center">
                <svg
                  width="18"
                  height="18"
                  fill="none"
                  stroke="#0A1628"
                  strokeWidth="2.5"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
              </div>
              <div>
                <span className="font-bold">Preventli</span>
                <span className="text-gray-400 text-sm ml-2">Admin</span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => fetchSubmissions(storedPassword)}
                className="text-gray-400 hover:text-white text-sm transition-colors flex items-center gap-1.5"
              >
                <svg
                  width="14"
                  height="14"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <polyline points="23 4 23 10 17 10" />
                  <path d="M20.49 15a9 9 0 11-2.12-9.36L23 10" />
                </svg>
                Refresh
              </button>
              <button
                onClick={exportCSV}
                className="bg-[#00E676] text-[#0A1628] px-4 py-2 rounded-lg text-sm font-semibold hover:bg-[#00C060] transition-colors flex items-center gap-1.5"
              >
                <svg
                  width="14"
                  height="14"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" />
                </svg>
                Export CSV
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          {[
            {
              label: "Total Leads",
              value: submissions.length,
              icon: "👥",
              color: "border-blue-400",
            },
            {
              label: "This Week",
              value: thisWeek,
              icon: "📅",
              color: "border-amber-400",
            },
            {
              label: "Conversion Rate",
              value: `${conversionRate}%`,
              icon: "🎯",
              color: "border-green-400",
            },
          ].map((stat) => (
            <div
              key={stat.label}
              className={`bg-white rounded-2xl p-6 border-l-4 ${stat.color} shadow-sm`}
            >
              <div className="text-2xl mb-2">{stat.icon}</div>
              <div className="text-3xl font-bold text-[#0A1628]">
                {stat.value}
              </div>
              <div className="text-gray-500 text-sm mt-1">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="font-bold text-[#0A1628]">All Leads</h2>
          </div>

          {loading ? (
            <div className="p-12 text-center text-gray-400">Loading...</div>
          ) : error ? (
            <div className="p-12 text-center text-red-500">{error}</div>
          ) : submissions.length === 0 ? (
            <div className="p-12 text-center text-gray-400">
              No submissions yet. Share your site to start getting leads!
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50">
                    {[
                      "Date",
                      "Name",
                      "Email",
                      "Phone",
                      "Company",
                      "Employees",
                      "Status",
                      "Message",
                      "Actions",
                    ].map((h) => (
                      <th
                        key={h}
                        className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {submissions.map((s) => (
                    <tr
                      key={s.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-4 py-4 text-sm text-gray-500 whitespace-nowrap">
                        {new Date(s.created_at).toLocaleDateString("en-AU")}
                      </td>
                      <td className="px-4 py-4 text-sm font-semibold text-[#0A1628] whitespace-nowrap">
                        {s.name}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-600">
                        <a
                          href={`mailto:${s.email}`}
                          className="text-[#0A1628] hover:text-[#00E676] transition-colors"
                        >
                          {s.email}
                        </a>
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-600 whitespace-nowrap">
                        {s.phone || "—"}
                      </td>
                      <td className="px-4 py-4 text-sm font-medium text-gray-700 whitespace-nowrap">
                        {s.company}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-600 whitespace-nowrap">
                        {s.employees}
                      </td>
                      <td className="px-4 py-4">
                        <span
                          className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold ${
                            statusColors[s.status]
                          }`}
                        >
                          {s.status}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-500 max-w-[200px]">
                        <div className="truncate" title={s.message}>
                          {s.message || "—"}
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <select
                          value={s.status}
                          onChange={(e) => updateStatus(s.id, e.target.value)}
                          className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 focus:outline-none focus:border-[#00E676] cursor-pointer bg-white"
                        >
                          <option value="new">New</option>
                          <option value="contacted">Contacted</option>
                          <option value="converted">Converted</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
