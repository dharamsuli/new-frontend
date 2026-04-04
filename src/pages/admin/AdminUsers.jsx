import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { fetchRegisteredUsers } from "../../lib/adminUsers";
import { useAdminGuard } from "../../hooks/useAdminGuard";

export function AdminUsersPage() {
  const { isAdmin } = useAdminGuard();
  const [users, setUsers] = useState([]);

  useEffect(() => {
    if (!isAdmin) return;

    fetchRegisteredUsers()
      .then(setUsers)
      .catch((error) => toast.error(error.message));
  }, [isAdmin]);

  if (!isAdmin) {
    return <p className="text-sm text-rose-600">Vendor access required.</p>;
  }

  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-semibold text-slate-900">Registered users</h1>

      <div className="space-y-3">
        {users.map((user) => (
          <article key={user._id} className="rounded-[28px] bg-white p-5 shadow-lg shadow-emerald-100">
            <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
              <div>
                <p className="text-lg font-semibold text-slate-900">{user.name}</p>
                <p className="text-sm text-slate-500">{user.email}</p>
                <p className="text-sm text-slate-500">{user.phone || "No phone added"}</p>
              </div>
              <div className="text-right text-sm">
                <p className="font-semibold text-emerald-700">{user.role}</p>
                <p className="text-slate-500">{user.storeName || "Customer account"}</p>
                <p className="text-slate-400">
                  {user.createdAt ? new Date(user.createdAt).toLocaleString("en-IN") : ""}
                </p>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

export default AdminUsersPage;
