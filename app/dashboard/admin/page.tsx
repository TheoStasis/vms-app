"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Card from "@/components/Card";
import Table from "@/components/Table";

export default function AdminDashboard() {
  const router = useRouter();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  // Form State
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("Host");

  const fetchUsers = async () => {
    const res = await fetch("/api/users");
    setUsers(await res.json());
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await fetch("/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password, role }),
    });

    if (res.ok) {
      setName(""); setEmail(""); setPassword(""); setRole("Host");
      await fetchUsers();
      router.refresh();
    } else {
      const data = await res.json();
      alert(data.error);
    }
    setLoading(false);
  };

  const handleDeleteUser = async (id: string) => {
    if (!confirm("Are you sure you want to delete this user?")) return;
    await fetch("/api/users", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    await fetchUsers();
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">System Administration</h1>
        <p className="text-sm text-gray-500">Manage employee accounts and system access.</p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <Card title="Add New Employee">
            <form onSubmit={handleCreateUser} className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium">Full Name</label>
                <input required value={name} onChange={(e) => setName(e.target.value)} className="w-full rounded-md border px-3 py-2 text-sm text-gray-900 bg-white" />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Email</label>
                <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full rounded-md border px-3 py-2 text-sm text-gray-900 bg-white" />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Temporary Password</label>
                <input required value={password} onChange={(e) => setPassword(e.target.value)} className="w-full rounded-md border px-3 py-2 text-sm text-gray-900 bg-white" />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">System Role</label>
                <select required value={role} onChange={(e) => setRole(e.target.value)} className="w-full rounded-md border px-3 py-2 text-sm text-gray-900 bg-white">
                  <option value="Admin">Admin</option>
                  <option value="Host">Host</option>
                  <option value="Receptionist">Receptionist</option>
                  <option value="Security">Security</option>
                  <option value="Auditor">Auditor</option>
                </select>
              </div>
              <button type="submit" disabled={loading} className="w-full rounded-md bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700 disabled:opacity-50">
                {loading ? "Creating..." : "Create Account"}
              </button>
            </form>
          </Card>
        </div>

        <div className="lg:col-span-2">
          <Card title="Active System Users">
            <Table headers={["Name", "Email", "Role", "Action"]}>
              {users.map((user: any) => (
                <tr key={user._id}>
                  <td className="px-6 py-4 font-medium text-gray-900">{user.name}</td>
                  <td className="px-6 py-4">{user.email}</td>
                  <td className="px-6 py-4"><span className="bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded border border-gray-200">{user.role}</span></td>
                  <td className="px-6 py-4">
                    <button onClick={() => handleDeleteUser(user._id)} className="text-red-600 hover:text-red-800 text-sm font-medium">Delete</button>
                  </td>
                </tr>
              ))}
            </Table>
          </Card>
        </div>
      </div>
    </div>
  );
}