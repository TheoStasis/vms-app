"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Card from "@/components/Card";
import Table from "@/components/Table";

export default function SecurityDashboard() {
  const router = useRouter();
  const [visits, setVisits] = useState([]);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const fetchSecurityData = async () => {
    try {
      const res = await fetch("/api/visits/security");
      const data = await res.json();
      if (Array.isArray(data)) setVisits(data);
    } catch (error) {
      console.error("Failed to fetch security data:", error);
    }
  };

  useEffect(() => {
    fetchSecurityData();
  }, []);

  const handleGateAction = async (visitId: string, action: "check-in" | "check-out") => {
    setLoadingId(visitId);
    const res = await fetch(`/api/visits/${action}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ visitId }),
    });

    if (res.ok) {
      await fetchSecurityData();
      router.refresh();
    }
    setLoadingId(null);
  };

  // Split data into the two tables
  const expectedVisitors = visits.filter((v: any) => v.status === "Approved");
  const inPremiseVisitors = visits.filter((v: any) => v.status === "Checked-In");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Gate Security</h1>
        <p className="text-sm text-gray-500">Verify approved visitors and manage building access.</p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Left Column: Waiting at Gate */}
        <Card title={`Gate Verification (${expectedVisitors.length})`}>
          <Table headers={["Visitor", "Host", "Action"]}>
            {expectedVisitors.map((visit: any) => (
              <tr key={visit._id}>
                <td className="px-6 py-4 font-medium text-gray-900">{visit.visitorName}</td>
                <td className="px-6 py-4 text-sm text-gray-500">{visit.hostId?.name}</td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => handleGateAction(visit._id, "check-in")}
                    disabled={loadingId === visit._id}
                    className="bg-blue-600 text-white px-4 py-2 rounded text-sm font-medium hover:bg-blue-700 disabled:opacity-50 transition"
                  >
                    {loadingId === visit._id ? "Processing..." : "Check-In"}
                  </button>
                </td>
              </tr>
            ))}
            {expectedVisitors.length === 0 && (
              <tr><td colSpan={3} className="px-6 py-4 text-center text-gray-500">No approved visitors waiting.</td></tr>
            )}
          </Table>
        </Card>

        {/* Right Column: Currently Inside */}
        <Card title={`In-Premise (${inPremiseVisitors.length})`}>
          <Table headers={["Visitor", "Entry Time", "Action"]}>
            {inPremiseVisitors.map((visit: any) => (
              <tr key={visit._id} className="bg-green-50/30">
                <td className="px-6 py-4 font-medium text-gray-900">{visit.visitorName}</td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {visit.entryTime ? new Date(visit.entryTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "--"}
                </td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => handleGateAction(visit._id, "check-out")}
                    disabled={loadingId === visit._id}
                    className="bg-gray-800 text-white px-4 py-2 rounded text-sm font-medium hover:bg-gray-900 disabled:opacity-50 transition"
                  >
                    {loadingId === visit._id ? "Processing..." : "Check-Out"}
                  </button>
                </td>
              </tr>
            ))}
            {inPremiseVisitors.length === 0 && (
              <tr><td colSpan={3} className="px-6 py-4 text-center text-gray-500">Building is clear.</td></tr>
            )}
          </Table>
        </Card>
      </div>
    </div>
  );
}