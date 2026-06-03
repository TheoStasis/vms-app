"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Card from "@/components/Card";
import Table from "@/components/Table";

export default function HostDashboard() {
  const { data: session } = useSession();
  const router = useRouter();
  
  const [visits, setVisits] = useState<any[]>([]);
  const [hostId, setHostId] = useState("");
  const [loading, setLoading] = useState(false);

  // Pre-registration form state
  const [visitorName, setVisitorName] = useState("");
  const [contact, setContact] = useState("");
  const [purpose, setPurpose] = useState("");

 const refreshHostData = async () => {
    const userEmail = session?.user?.email;

   
    if (!userEmail) return;

    try {
      const res = await fetch(`/api/visits/host?email=${userEmail}`);
      const data = await res.json();
      if (data.visits) {
        setVisits(data.visits);
        setHostId(data.hostId);
      }
    } catch (error) {
      console.error("Failed to fetch host data:", error);
    }
  };

  useEffect(() => {
    const timer = window.setTimeout(() => {
      if (!session?.user?.email) return;

      void (async () => {
        try {
          const res = await fetch(`/api/visits/host?email=${session.user.email}`);
          const data = await res.json();
          if (data.visits) {
            setVisits(data.visits);
            setHostId(data.hostId);
          }
        } catch (error) {
          console.error("Failed to fetch host data:", error);
        }
      })();
    }, 0);

    return () => window.clearTimeout(timer);
  }, [session?.user?.email]);

  const handleUpdateStatus = async (visitId: string, status: string) => {
    const res = await fetch("/api/visits/update-status", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ visitId, status }),
    });
    if (res.ok) {
      await refreshHostData();
      router.refresh();
    }
  };

  const handlePreRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await fetch("/api/visits/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      // Automatically "Approved" since the host is creating it themselves
      body: JSON.stringify({ visitorName, contact, hostId, purpose, status: "Approved" }),
    });

    if (res.ok) {
      setVisitorName("");
      setContact("");
      setPurpose("");
      await refreshHostData();
      router.refresh();
    }
    setLoading(false);
  };

  // Split visits into Pending vs History
  const pendingVisits = visits.filter((v: any) => v.status === "Pending");
  const historyVisits = visits.filter((v: any) => v.status !== "Pending");

  return (
    <div className="space-y-6">
      <div className="surface-header">
        <div>
          <div className="eyebrow">Host Workspace</div>
          <h1 className="page-title mt-3">My Dashboard</h1>
          <p className="page-copy mt-2">Manage your pending approvals and pre-register guests.</p>
        </div>
      </div>

      {/* Pending Approvals Section */}
      <Card title={`Action Required: Pending Approvals (${pendingVisits.length})`}>
        {pendingVisits.length === 0 ? (
          <p className="py-4 text-sm text-slate-500">You have no visitors waiting.</p>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {pendingVisits.map((visit: any) => (
              <div key={visit._id} className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4 shadow-sm transition hover:-translate-y-0.5 hover:bg-white hover:shadow-md">
                <h3 className="text-lg font-semibold tracking-tight text-slate-900">{visit.visitorName}</h3>
                <p className="mb-1 text-sm text-slate-600">Purpose: {visit.purpose}</p>
                <p className="mb-4 text-sm text-slate-600">Time: {new Date(visit.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                <div className="flex space-x-3">
                  <button onClick={() => handleUpdateStatus(visit._id, "Approved")} className="button-primary flex-1 bg-emerald-600 hover:bg-emerald-700">
                    Approve
                  </button>
                  <button onClick={() => handleUpdateStatus(visit._id, "Rejected")} className="button-secondary flex-1 border-rose-200 text-rose-700 hover:border-rose-200 hover:bg-rose-50 hover:text-rose-700">
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pre-Register Form */}
        <div className="lg:col-span-1">
          <Card title="Pre-Register a Guest">
            <form onSubmit={handlePreRegister} className="space-y-4">
              <div>
                <label className="form-label">Guest Name</label>
                <input required value={visitorName} onChange={(e) => setVisitorName(e.target.value)} className="input-field" placeholder="Clark Kent" />
              </div>
              <div>
                <label className="form-label">Contact Number</label>
                <input required value={contact} onChange={(e) => setContact(e.target.value)} className="input-field" placeholder="555-0199" />
              </div>
              <div>
                <label className="form-label">Purpose</label>
                <select required value={purpose} onChange={(e) => setPurpose(e.target.value)} className="input-field">
                  <option value="" disabled>Select a reason...</option>
                  <option value="Meeting">Meeting</option>
                  <option value="Interview">Interview</option>
                  <option value="Personal">Personal</option>
                </select>
              </div>
              <button type="submit" disabled={loading || !hostId} className="button-primary w-full">
                {loading ? "Registering..." : "Pre-Register (Auto-Approve)"}
              </button>
            </form>
          </Card>
        </div>

        {/* History Table */}
        <div className="lg:col-span-2">
          <Card title="My Visitor History">
            <Table headers={["Visitor", "Purpose", "Date", "Status"]}>
              {historyVisits.map((visit: any) => (
                <tr key={visit._id} className="hover:bg-slate-50/80">
                  <td className="px-6 py-4 font-medium text-slate-900">{visit.visitorName}</td>
                  <td className="px-6 py-4">{visit.purpose}</td>
                  <td className="px-6 py-4">{new Date(visit.createdAt).toLocaleDateString()}</td>
                  <td className="px-6 py-4">
                    <span className={`badge badge-${visit.status.toLowerCase()}`}>{visit.status}</span>
                  </td>
                </tr>
              ))}
              {historyVisits.length === 0 && (
                <tr><td colSpan={4} className="px-6 py-4 text-center text-slate-500">No past visitors found.</td></tr>
              )}
            </Table>
          </Card>
        </div>
      </div>
    </div>
  );
}