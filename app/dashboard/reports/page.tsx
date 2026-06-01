"use client";

import { useState, useEffect } from "react";
import Card from "@/components/Card";
import Table from "@/components/Table";

export default function ReportsDashboard() {
  const [allVisits, setAllVisits] = useState([]);
  
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
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Master Audit Log</h1>
          <p className="text-sm text-gray-500">Review all historical visitor records and export for compliance.</p>
        </div>
        <button onClick={handleExportCSV} className="bg-green-600 text-white px-4 py-2 rounded text-sm font-medium hover:bg-green-700 transition">
          Export to CSV
        </button>
      </div>

      <Card title="Filter Records">
        <div className="flex space-x-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Start Date</label>
            <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="rounded-md border px-3 py-2 text-sm text-gray-900 bg-white" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">End Date</label>
            <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="rounded-md border px-3 py-2 text-sm text-gray-900 bg-white" />
          </div>
          <div className="flex items-end pb-1">
            <button onClick={() => { setStartDate(""); setEndDate(""); }} className="text-sm text-blue-600 hover:underline">
              Clear Filters
            </button>
          </div>
        </div>
      </Card>

      <Card title={`Historical Data (${filteredVisits.length} records)`}>
        <Table headers={["Visitor", "Host", "Date", "Status", "Entry", "Exit"]}>
          {filteredVisits.map((visit: any) => (
            <tr key={visit._id}>
              <td className="px-6 py-4 font-medium text-gray-900">{visit.visitorName}</td>
              <td className="px-6 py-4 text-sm text-gray-500">{visit.hostId?.name}</td>
              <td className="px-6 py-4 text-sm">{new Date(visit.createdAt).toLocaleDateString()}</td>
              <td className="px-6 py-4"><span className={`badge badge-${visit.status.toLowerCase()}`}>{visit.status}</span></td>
              <td className="px-6 py-4 text-sm">{visit.entryTime ? new Date(visit.entryTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "--"}</td>
              <td className="px-6 py-4 text-sm">{visit.exitTime ? new Date(visit.exitTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "--"}</td>
            </tr>
          ))}
          {filteredVisits.length === 0 && (
            <tr><td colSpan={6} className="px-6 py-4 text-center text-gray-500">No records found for this date range.</td></tr>
          )}
        </Table>
      </Card>
    </div>
  );
}