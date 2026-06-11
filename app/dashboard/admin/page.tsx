"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Card from "@/components/Card";
import Table from "@/components/Table";

export default function AdminDashboard() {
  const router = useRouter();
  const [users, setUsers] = useState<any[]>([]);
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

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void fetchUsers();
    }, 0);

    return () => window.clearTimeout(timer);
  }, []);

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
  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      const res = await fetch("/api/users/update-role", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, role: newRole }),
      });

      if (!res.ok) throw new Error("Failed to update role");

      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user._id === userId ? { ...user, role: newRole } : user
        )
      );
      
    } catch (error) {
      console.error(error);
      alert("Failed to update user role.");
    }
  };

 return (
    <div className="space-y-6">
      <div className="surface-header">
        <div>
          <div className="eyebrow">Administration</div>
          <h1 className="page-title mt-3">System Administration</h1>
          <p className="page-copy mt-2">Manage employee accounts and system access.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <Card title="Add New Employee">
            <form onSubmit={handleCreateUser} className="space-y-4">
              <div>
                <label className="form-label">Full Name</label>
                <input required value={name} onChange={(e) => setName(e.target.value)} className="input-field w-full" />
              </div>
              <div>
                <label className="form-label">Email</label>
                <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="input-field w-full" />
              </div>
              <div>
                <label className="form-label">Temporary Password</label>
                <input required value={password} onChange={(e) => setPassword(e.target.value)} className="input-field w-full" />
              </div>
              <div>
                <label className="form-label">System Role</label>
                <select required value={role} onChange={(e) => setRole(e.target.value)} className="input-field w-full">
                  <option value="Admin">Admin</option>
                  <option value="Host">Host</option>
                  <option value="Receptionist">Receptionist</option>
                  <option value="Security">Security</option>
                  <option value="Auditor">Auditor</option>
                </select>
              </div>
              <button type="submit" disabled={loading} className="button-primary w-full">
                {loading ? "Creating..." : "Create Account"}
              </button>
            </form>
          </Card>
        </div>

        <div className="lg:col-span-2">
          <Card title="Active System Users">
            <Table headers={["Name", "Email", "Role", "Action"]}>
              {users.map((user: any) => (
                <tr key={user._id} className="hover:bg-slate-50/80">
                  <td className="px-6 py-4 font-medium text-slate-900">{user.name}</td>
                  <td className="px-6 py-4">{user.email}</td>
                  
                  {/*DROPDOWN DESIGNED */}
                  <td className="px-6 py-4">
                    <select
                      value={user.role}
                      onChange={(e) => handleRoleChange(user._id, e.target.value)}
                      className="input-field py-1 px-2 text-sm w-full max-w-[140px] cursor-pointer"
                    >
                      <option value="Admin">Admin</option>
                      <option value="Host">Host</option>
                      <option value="Receptionist">Receptionist</option>
                      <option value="Security">Security</option>
                      <option value="Auditor">Auditor</option>
                    </select>
                  </td>
                  
                  <td className="px-6 py-4">
                    <button onClick={() => handleDeleteUser(user._id)} className="text-sm font-medium text-rose-600 transition hover:text-rose-700">Delete</button>
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