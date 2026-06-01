"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Card from "@/components/Card";
import Table from "@/components/Table";

export default function SecurityDashboard() {
  const router = useRouter();
  const [visits, setVisits] = useState<any[]>([]);
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
    const timer = window.setTimeout(() => {
      void fetchSecurityData();
    }, 0);

    return () => window.clearTimeout(timer);
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
      <div className="surface-header">
        <div>
          <div className="eyebrow">Security</div>
          <h1 className="page-title mt-3">Gate Security</h1>
          <p className="page-copy mt-2">Verify approved visitors and manage building access.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Left Column: Waiting at Gate */}
        <Card title={`Gate Verification (${expectedVisitors.length})`}>
          <Table headers={["Visitor", "Host", "Action"]}>
            {expectedVisitors.map((visit: any) => (
              <tr key={visit._id} className="hover:bg-slate-50/80">
                <td className="px-6 py-4 font-medium text-slate-900">{visit.visitorName}</td>
                <td className="px-6 py-4 text-sm text-slate-500">{visit.hostId?.name}</td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => handleGateAction(visit._id, "check-in")}
                    disabled={loadingId === visit._id}
                    className="button-primary"
                  >
                    {loadingId === visit._id ? "Processing..." : "Check-In"}
                  </button>
                </td>
              </tr>
            ))}
            {expectedVisitors.length === 0 && (
              <tr><td colSpan={3} className="px-6 py-4 text-center text-slate-500">No approved visitors waiting.</td></tr>
            )}
          </Table>
        </Card>

        {/* Right Column: Currently Inside */}
        <Card title={`In-Premise (${inPremiseVisitors.length})`}>
          <Table headers={["Visitor", "Entry Time", "Action"]}>
            {inPremiseVisitors.map((visit: any) => (
              <tr key={visit._id} className="bg-emerald-50/40 hover:bg-emerald-50">
                <td className="px-6 py-4 font-medium text-slate-900">{visit.visitorName}</td>
                <td className="px-6 py-4 text-sm text-slate-500">
                  {visit.entryTime ? new Date(visit.entryTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "--"}
                </td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => handleGateAction(visit._id, "check-out")}
                    disabled={loadingId === visit._id}
                    className="button-secondary bg-slate-900 text-white hover:bg-slate-800 hover:text-white"
                  >
                    {loadingId === visit._id ? "Processing..." : "Check-Out"}
                  </button>
                </td>
              </tr>
            ))}
            {inPremiseVisitors.length === 0 && (
              <tr><td colSpan={3} className="px-6 py-4 text-center text-slate-500">Building is clear.</td></tr>
            )}
          </Table>
        </Card>
      </div>
    </div>
  );
}