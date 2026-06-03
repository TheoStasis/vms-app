"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Card from "@/components/Card";
import Table from "@/components/Table";
import VisitorCamera from "@/components/VisitorCamera";

export default function ReceptionDashboard() {
  const router = useRouter();
  const [hosts, setHosts] = useState<any[]>([]);
  const [visits, setVisits] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [visitorToPrint, setVisitorToPrint] = useState<any>(null);
  const [contact, setContact] = useState("");
  const [visitorPhoto, setVisitorPhoto] = useState<string | null>(null);
  const [cameraResetToken, setCameraResetToken] = useState(0);
  const [visitorName, setVisitorName] = useState("");
  const [hostId, setHostId] = useState("");
  const [purpose, setPurpose] = useState("");

  const fetchData = async () => {
    const [hostsRes, visitsRes] = await Promise.all([
      fetch("/api/users/hosts"),
      fetch("/api/visits/today")
    ]);
    setHosts(await hostsRes.json());
    setVisits(await visitsRes.json());
  };

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void fetchData();
    }, 0);

    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleAfterPrint = () => {
      setVisitorToPrint(null);
    };
    
    window.addEventListener("afterprint", handleAfterPrint);
    return () => window.removeEventListener("afterprint", handleAfterPrint);
  }, []);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let finalPhotoUrl = "";

      if (visitorPhoto) {
        const photoBlob = await fetch(visitorPhoto).then((response) => response.blob());
        const formData = new FormData();
        formData.append("file", photoBlob, "visitor-photo.jpg");
        formData.append("upload_preset", "vms_visitors");

        const cloudRes = await fetch("https://api.cloudinary.com/v1_1/dxre6ikxq/image/upload", {
          method: "POST",
          body: formData,
        });

        const cloudData = await cloudRes.json();

        if (!cloudRes.ok || !cloudData?.secure_url) {
          console.error("Cloudinary Error Details:", cloudData);
          throw new Error(cloudData?.error?.message || "Cloudinary upload failed.");
        }

        finalPhotoUrl = cloudData.secure_url;
      }

      const res = await fetch("/api/visits/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          visitorName,
          hostId,
          contact,
          purpose,
          ...(finalPhotoUrl ? { photoUrl: finalPhotoUrl } : {}),
        }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to save visitor.");
      }

      setVisitorName("");
      setHostId("");
      setContact("");
      setPurpose("");
      setVisitorPhoto(null);
      setCameraResetToken((currentToken) => currentToken + 1);
      await fetchData();
      router.refresh();
    } catch (error: any) {
      console.error("Visitor registration failed:", error);
      alert(error?.message || "Visitor registration failed.");
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = (visit: any) => {
    setVisitorToPrint(visit);
    
    setTimeout(() => {
      window.print(); 
      
    }, 300); 
  };

  return (
    <div className="relative">
      
      <div className="space-y-6 print:hidden">
        <div className="surface-header">
          <div>
            <div className="eyebrow">Reception Desk</div>
            <h1 className="page-title mt-3">Reception Desk</h1>
            <p className="page-copy mt-2">Register walk-ins and print visitor passes.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-1">
            <Card title="New Visitor Walk-in">
              <form onSubmit={handleRegister} className="space-y-4">
                <div>
                  <label className="form-label">Visitor Name</label>
                  <input 
                      required 
                      value={visitorName} 
                      onChange={(e) => setVisitorName(e.target.value)} 
                      className="input-field w-full" 
                      placeholder="John Doe" 
                      />
                </div>
                <div>
                  <label className="form-label">Contact Number</label>
                  <input 
                    required 
                    value={contact} 
                    onChange={(e) => setContact(e.target.value)} 
                    className="input-field w-full" 
                    placeholder="555-0199" 
                  />
                </div>
                <div>
                  <label className="form-label">Host (Employee)</label>
                  <select 
                      required 
                      value={hostId} 
                      onChange={(e) => setHostId(e.target.value)} 
                      className="input-field w-full"
                      >
                    <option value="" disabled>Select a host...</option>
                    {hosts.map((h: any) => (
                      <option key={h._id} value={h._id}>{h.name} ({h.email})</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="form-label">Purpose</label>
                  <select 
                      required 
                      value={purpose} 
                      onChange={(e) => setPurpose(e.target.value)} 
                      className="input-field w-full"
                      >
                    <option value="" disabled>Select a reason...</option>
                    <option value="Meeting">Meeting</option>
                    <option value="Interview">Interview</option>
                    <option value="Delivery">Delivery</option>
                    <option value="Personal">Personal</option>
                  </select>
                </div>
                <VisitorCamera
                  onCapture={(img) => setVisitorPhoto(img)}
                  resetSignal={cameraResetToken}
                />
                <button type="submit" disabled={loading} className="button-primary w-full">
                  {loading ? "Registering..." : "Register & Notify Host"}
                </button>
              </form>
            </Card>
          </div>

          <div className="lg:col-span-2">
            <Card title="Today's Visitor Log">
              <Table headers={["Visitor", "Host", "Time", "Status", "Action"]}>
                {visits.map((visit: any) => (
                  <tr key={visit._id} className="hover:bg-slate-50/80">
                    <td className="px-6 py-4 font-medium text-slate-900">
                      <div className="flex items-center gap-3">
                        {visit.photoUrl ? (
                          <img 
                            src={visit.photoUrl} 
                            alt={visit.visitorName} 
                            className="w-10 h-10 rounded-full object-cover border border-slate-200 shadow-sm"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400 font-bold text-sm">
                            {visit.visitorName.charAt(0).toUpperCase()}
                          </div>
                        )}
                        <span>{visit.visitorName}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">{visit.hostId?.name || "Unknown"}</td>
                    <td className="px-6 py-4">{new Date(visit.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
                    <td className="px-6 py-4">
                      <span className={`badge badge-${visit.status.toLowerCase()}`}>{visit.status}</span>
                    </td>
                    <td className="px-6 py-4">
                      {visit.status === "Approved" ? (
                        <button onClick={() => handlePrint(visit)} className="text-sm font-medium text-blue-700 transition hover:text-blue-800 sm:whitespace-nowrap">Print Pass</button>
                      ) : (
                        <span className="text-sm text-slate-400">Wait for approval</span>
                      )}
                    </td>
                  </tr>
                ))}
                {visits.length === 0 && (
                  <tr><td colSpan={5} className="px-6 py-4 text-center text-slate-500">No visitors registered today.</td></tr>
                )}
              </Table>
            </Card>
          </div>
        </div>
      </div>

      {visitorToPrint && (
        <div id="print-section" className="w-full max-w-[400px] mx-auto bg-white p-6 text-center mt-10">
          <h2 className="text-2xl font-bold uppercase mb-2">Visitor Pass</h2>
          <div className="border-b-2 border-black w-full mb-4"></div>
          
          {visitorToPrint.photoUrl && (
            <img 
              src={visitorToPrint.photoUrl} 
              alt="Visitor" 
              className="w-28 h-28 mx-auto rounded-lg object-cover border-2 border-slate-900 mb-4"
            />
          )}

          <p className="text-sm text-gray-500 uppercase">Name</p>
          <p className="text-xl font-bold mb-4">{visitorToPrint.visitorName}</p>
          <p className="text-sm text-gray-500 uppercase">Host</p>
          <p className="text-lg mb-4">{visitorToPrint.hostId?.name || "Unknown"}</p>
          <p className="text-sm text-gray-500 uppercase">Date</p>
          <p className="text-md font-medium">{new Date().toLocaleDateString()}</p>
          <div className="mt-6 text-xs text-gray-400">Please wear this badge at all times.</div>
        </div>
      )}
    </div>
  );
}