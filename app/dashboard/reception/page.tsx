"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Card from "@/components/Card";
import Table from "@/components/Table";


export default function ReceptionDashboard() {
  const router = useRouter();
  const [hosts, setHosts] = useState([]);
  const [visits, setVisits] = useState([]);
  const [loading, setLoading] = useState(false);
  const [visitorToPrint, setVisitorToPrint] = useState<any>(null);
  const [contact, setContact] = useState("");

  // Form State
  const [visitorName, setVisitorName] = useState("");
  const [hostId, setHostId] = useState("");
  const [purpose, setPurpose] = useState("");

  // Fetch data on load
  const fetchData = async () => {
    const [hostsRes, visitsRes] = await Promise.all([
      fetch("/api/users/hosts"),
      fetch("/api/visits/today")
    ]);
    setHosts(await hostsRes.json());
    setVisits(await visitsRes.json());
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const res = await fetch("/api/visits/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ visitorName, hostId, contact, purpose }),
    });

    if (res.ok) {
      setVisitorName("");
      setHostId("");
      setPurpose("");
      await fetchData(); // Instantly refresh the table
      router.refresh();
    }
    setLoading(false);
  };

  const handlePrint = (visit: any) => {
    setVisitorToPrint(visit);
    setTimeout(() => {
      window.print(); // Triggers browser print dialog
      setVisitorToPrint(null); // Clean up after
    }, 100);
  };

  return (
    <div className="space-y-6 relative">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Reception Desk</h1>
        <p className="text-sm text-gray-500">Register walk-ins and print visitor passes.</p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Form Column */}
        <div className="lg:col-span-1">
          <Card title="New Visitor Walk-in">
            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium">Visitor Name</label>
                <input 
                    required 
                    value={visitorName} 
                    onChange={(e) => setVisitorName(e.target.value)} 
                    className="w-full rounded-md border px-3 py-2 text-sm text-gray-900 bg-white" 
                    placeholder="John Doe" 
                    />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Contact Number</label>
                <input 
                  required 
                  value={contact} 
                  onChange={(e) => setContact(e.target.value)} 
                  className="w-full rounded-md border px-3 py-2 text-sm text-gray-900 bg-white" 
                  placeholder="555-0199" 
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Host (Employee)</label>
                <select 
                    required 
                    value={hostId} 
                    onChange={(e) => setHostId(e.target.value)} 
                    className="w-full rounded-md border px-3 py-2 text-sm text-gray-900 bg-white"
                    >
                  <option value="" disabled>Select a host...</option>
                  {hosts.map((h: any) => (
                    <option key={h._id} value={h._id}>{h.name} ({h.email})</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Purpose</label>
                <select 
                    required 
                    value={purpose} 
                    onChange={(e) => setPurpose(e.target.value)} 
                    className="w-full rounded-md border px-3 py-2 text-sm text-gray-900 bg-white"
                    >
                  <option value="" disabled>Select a reason...</option>
                  <option value="Meeting">Meeting</option>
                  <option value="Interview">Interview</option>
                  <option value="Delivery">Delivery</option>
                  <option value="Personal">Personal</option>
                </select>
              </div>
              <button type="submit" disabled={loading} className="w-full rounded-md bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700 disabled:opacity-50">
                {loading ? "Registering..." : "Register & Notify Host"}
              </button>
            </form>
          </Card>
        </div>

        {/* Table Column */}
        <div className="lg:col-span-2">
          <Card title="Today's Visitor Log">
            <Table headers={["Visitor", "Host", "Time", "Status", "Action"]}>
              {visits.map((visit: any) => (
                <tr key={visit._id}>
                  <td className="px-6 py-4 font-medium text-gray-900">{visit.visitorName}</td>
                  <td className="px-6 py-4">{visit.hostId?.name || "Unknown"}</td>
                  <td className="px-6 py-4">{new Date(visit.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
                  <td className="px-6 py-4">
                    <span className={`badge badge-${visit.status.toLowerCase()}`}>{visit.status}</span>
                  </td>
                  <td className="px-6 py-4">
                    {visit.status === "Approved" ? (
                      <button onClick={() => handlePrint(visit)} className="text-blue-600 hover:text-blue-800 text-sm font-medium">Print Pass</button>
                    ) : (
                      <span className="text-sm text-gray-400">Wait for approval</span>
                    )}
                  </td>
                </tr>
              ))}
              {visits.length === 0 && (
                <tr><td colSpan={5} className="px-6 py-4 text-center text-gray-500">No visitors registered today.</td></tr>
              )}
            </Table>
          </Card>
        </div>
      </div>

      {/* Hidden Printable Pass (Only visible during window.print) */}
      {visitorToPrint && (
        <div id="print-section" className="border-2 border-black p-6 bg-white shadow-none text-center">
          <h2 className="text-2xl font-bold uppercase mb-2">Visitor Pass</h2>
          <div className="border-b-2 border-black mb-4"></div>
          <p className="text-sm text-gray-500 uppercase">Name</p>
          <p className="text-xl font-bold mb-4">{visitorToPrint.visitorName}</p>
          <p className="text-sm text-gray-500 uppercase">Host</p>
          <p className="text-lg mb-4">{visitorToPrint.host?.name}</p>
          <p className="text-sm text-gray-500 uppercase">Date</p>
          <p className="text-md font-medium">{new Date().toLocaleDateString()}</p>
          <div className="mt-6 text-xs text-gray-400">Please wear this badge at all times.</div>
        </div>
      )}
    </div>
  );
}