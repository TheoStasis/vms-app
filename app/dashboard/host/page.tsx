"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Card from "@/components/Card";
import Table from "@/components/Table";

export default function HostDashboard() {
  const { data: session } = useSession();
  const router = useRouter();
  
  const [visits, setVisits] = useState([]);
  const [hostId, setHostId] = useState("");
  const [loading, setLoading] = useState(false);

  // Pre-registration form state
  const [visitorName, setVisitorName] = useState("");
  const [contact, setContact] = useState("");
  const [purpose, setPurpose] = useState("");

  const fetchHostData = async () => {
    if (!session?.user?.email) return;
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
  };

  useEffect(() => {
    fetchHostData();
  }, [session]);

  const handleUpdateStatus = async (visitId: string, status: string) => {
    const res = await fetch("/api/visits/update-status", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ visitId, status }),
    });
    if (res.ok) {
      await fetchHostData();
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
      await fetchHostData();
      router.refresh();
    }
    setLoading(false);
  };

  // Split visits into Pending vs History
  const pendingVisits = visits.filter((v: any) => v.status === "Pending");
  const historyVisits = visits.filter((v: any) => v.status !== "Pending");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">My Dashboard</h1>
        <p className="text-sm text-gray-500">Manage your pending approvals and pre-register guests.</p>
      </div>

      {/* Pending Approvals Section */}
      <Card title={`Action Required: Pending Approvals (${pendingVisits.length})`}>
        {pendingVisits.length === 0 ? (
          <p className="text-sm text-gray-500 py-4">You have no visitors waiting.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {pendingVisits.map((visit: any) => (
              <div key={visit._id} className="border border-gray-200 rounded-lg p-4 bg-gray-50 shadow-sm">
                <h3 className="font-bold text-lg text-gray-900">{visit.visitorName}</h3>
                <p className="text-sm text-gray-600 mb-1">Purpose: {visit.purpose}</p>
                <p className="text-sm text-gray-600 mb-4">Time: {new Date(visit.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                <div className="flex space-x-3">
                  <button onClick={() => handleUpdateStatus(visit._id, "Approved")} className="flex-1 bg-green-600 text-white py-2 rounded hover:bg-green-700 text-sm font-medium transition">
                    Approve
                  </button>
                  <button onClick={() => handleUpdateStatus(visit._id, "Rejected")} className="flex-1 bg-red-600 text-white py-2 rounded hover:bg-red-700 text-sm font-medium transition">
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
                <label className="mb-1 block text-sm font-medium">Guest Name</label>
                <input required value={visitorName} onChange={(e) => setVisitorName(e.target.value)} className="w-full rounded-md border px-3 py-2 text-sm text-gray-900 bg-white" placeholder="Clark Kent" />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Contact Number</label>
                <input required value={contact} onChange={(e) => setContact(e.target.value)} className="w-full rounded-md border px-3 py-2 text-sm text-gray-900 bg-white" placeholder="555-0199" />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Purpose</label>
                <select required value={purpose} onChange={(e) => setPurpose(e.target.value)} className="w-full rounded-md border px-3 py-2 text-sm text-gray-900 bg-white">
                  <option value="" disabled>Select a reason...</option>
                  <option value="Meeting">Meeting</option>
                  <option value="Interview">Interview</option>
                  <option value="Personal">Personal</option>
                </select>
              </div>
              <button type="submit" disabled={loading || !hostId} className="w-full rounded-md bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700 disabled:opacity-50">
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
                <tr key={visit._id}>
                  <td className="px-6 py-4 font-medium text-gray-900">{visit.visitorName}</td>
                  <td className="px-6 py-4">{visit.purpose}</td>
                  <td className="px-6 py-4">{new Date(visit.createdAt).toLocaleDateString()}</td>
                  <td className="px-6 py-4">
                    <span className={`badge badge-${visit.status.toLowerCase()}`}>{visit.status}</span>
                  </td>
                </tr>
              ))}
              {historyVisits.length === 0 && (
                <tr><td colSpan={4} className="px-6 py-4 text-center text-gray-500">No past visitors found.</td></tr>
              )}
            </Table>
          </Card>
        </div>
      </div>
    </div>
  );
}