"use client";

import { useState, useEffect } from "react";
import Card from "@/components/Card";
import Table from "@/components/Table";

export default function ReportsDashboard() {
  const [allVisits, setAllVisits] = useState<any[]>([]);
  
  // Date Filters
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    const fetchAllVisits = async () => {
      const res = await fetch("/api/visits/all");
      const data = await res.json();
      setAllVisits(data);
    };
    fetchAllVisits();
  
  }, []);

  // DERIVED STATE
  const filteredVisits = allVisits.filter((visit: any) => {
    if (!startDate && !endDate) return true;

    const visitDate = new Date(visit.createdAt).getTime();
    const start = startDate ? new Date(startDate).setHours(0, 0, 0, 0) : 0;
    const end = endDate ? new Date(endDate).setHours(23, 59, 59, 999) : Infinity;
    return visitDate >= start && visitDate <= end;
  });

  const handleExportCSV = () => {
    const headers = ["Visitor Name", "Contact", "Host Name", "Purpose", "Status", "Created At", "Entry Time", "Exit Time"];
    
    const rows = filteredVisits.map((v: any) => [
      `"${v.visitorName}"`,
      `"${v.contact}"`,
      `"${v.hostId?.name || 'Unknown'}"`,
      `"${v.purpose}"`,
      `"${v.status}"`,
      `"${new Date(v.createdAt).toLocaleString()}"`,
      v.entryTime ? `"${new Date(v.entryTime).toLocaleString()}"` : '"--"',
      v.exitTime ? `"${new Date(v.exitTime).toLocaleString()}"` : '"--"'
    ]);

    const csvContent = [headers.join(","), ...rows.map(e => e.join(","))].join("\n");

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `vms_audit_log_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <div className="surface-header">
        <div>
          <div className="eyebrow">Compliance</div>
          <h1 className="page-title mt-3">Master Audit Log</h1>
          <p className="page-copy mt-2">Review all historical visitor records and export for compliance.</p>
        </div>
        <button onClick={handleExportCSV} className="button-primary bg-emerald-600 hover:bg-emerald-700">
          Export to CSV
        </button>
      </div>

      <Card title="Filter Records">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:gap-6">
          <div>
            <label className="form-label">Start Date</label>
            <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="input-field" />
          </div>
          <div>
            <label className="form-label">End Date</label>
            <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="input-field" />
          </div>
          <div className="flex items-end pb-1">
            <button onClick={() => { setStartDate(""); setEndDate(""); }} className="button-ghost px-0 hover:bg-transparent hover:text-blue-700">
              Clear Filters
            </button>
          </div>
        </div>
      </Card>

      <Card title={`Historical Data (${filteredVisits.length} records)`}>
        <Table headers={["Visitor", "Host", "Date", "Status", "Entry", "Exit"]}>
          {filteredVisits.map((visit: any) => (
            <tr key={visit._id} className="hover:bg-slate-50/80">
              <td className="px-6 py-4 font-medium text-slate-900">{visit.visitorName}</td>
              <td className="px-6 py-4 text-sm text-slate-500">{visit.hostId?.name}</td>
              <td className="px-6 py-4 text-sm text-slate-700">{new Date(visit.createdAt).toLocaleDateString()}</td>
              <td className="px-6 py-4"><span className={`badge badge-${visit.status.toLowerCase()}`}>{visit.status}</span></td>
              <td className="px-6 py-4 text-sm text-slate-700">{visit.entryTime ? new Date(visit.entryTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "--"}</td>
              <td className="px-6 py-4 text-sm text-slate-700">{visit.exitTime ? new Date(visit.exitTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "--"}</td>
            </tr>
          ))}
          {filteredVisits.length === 0 && (
            <tr><td colSpan={6} className="px-6 py-4 text-center text-slate-500">No records found for this date range.</td></tr>
          )}
        </Table>
      </Card>
    </div>
  );
}