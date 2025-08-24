



import React, { useState, useEffect } from "react";
import { X, Search, User, Check } from "lucide-react";
import { supabase } from "../supabaseClient"; // ✅ Import supabase client properly

export default function ShareModal({ isOpen, onClose, file, onShare }) {
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [canEdit, setCanEdit] = useState(false);
  const [sharing, setSharing] = useState(false);

  // Reset modal state on close/open
  useEffect(() => {
    if (!isOpen) {
      setUsers([]);
      setSearchQuery("");
      setSelectedUser(null);
      setCanEdit(false);
    }
  }, [isOpen]);

  // Fetch users when search changes
  useEffect(() => {
    if (isOpen && searchQuery.trim()) {
      fetchUsers();
    }
  }, [searchQuery, isOpen]);

  const fetchUsers = async () => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) throw new Error("Not authenticated");

      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/users?search=${encodeURIComponent(
          searchQuery
        )}`,
        {
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
        }
      );

      if (!response.ok) throw new Error("Failed to fetch users");

      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error("Error fetching users:", error);
      setUsers([]);
    }
  };

  const handleShare = async () => {
    if (!selectedUser) return;

    setSharing(true);
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) throw new Error("Not authenticated");

      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/files/${file.id}/share`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({
            userId: selectedUser.id,
            canEdit: canEdit,
          }),
        }
      );

      if (!response.ok) throw new Error("Failed to share file");

      alert("✅ File shared successfully!");
      if (onShare) onShare();
      onClose();
    } catch (error) {
      console.error("Share error:", error);
      alert("❌ Failed to share file");
    } finally {
      setSharing(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-lg font-semibold text-gray-900">
            Share "{file?.name}"
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-4">
          {/* Search input */}
          <div className="relative mb-4">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Search users by email or name..."
            />
          </div>

          {/* Search results */}
          {searchQuery && (
            <div className="mb-4 max-h-60 overflow-y-auto">
              {users.length === 0 ? (
                <div className="text-center py-4 text-gray-500">No users found</div>
              ) : (
                <div className="space-y-1">
                  {users.map((user) => (
                    <div
                      key={user.id}
                      onClick={() => setSelectedUser(user)}
                      className={`flex items-center p-3 rounded-md cursor-pointer ${
                        selectedUser?.id === user.id
                          ? "bg-indigo-50"
                          : "hover:bg-gray-50"
                      }`}
                    >
                      <div className="flex-shrink-0">
                        <div className="h-8 w-8 bg-indigo-100 rounded-full flex items-center justify-center">
                          <User className="h-4 w-4 text-indigo-600" />
                        </div>
                      </div>
                      <div className="ml-3 flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {user.full_name || user.email}
                        </p>
                        <p className="text-xs text-gray-500 truncate">{user.email}</p>
                      </div>
                      {selectedUser?.id === user.id && (
                        <Check className="h-5 w-5 text-indigo-600" />
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Allow editing checkbox */}
          {selectedUser && (
            <div className="mb-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={canEdit}
                  onChange={(e) => setCanEdit(e.target.checked)}
                  className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <span className="ml-2 text-sm text-gray-900">Allow editing</span>
              </label>
            </div>
          )}

          {/* Buttons */}
          <div className="flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
            >
              Cancel
            </button>
            <button
              onClick={handleShare}
              disabled={!selectedUser || sharing}
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none disabled:opacity-50"
            >
              {sharing ? "Sharing..." : "Share"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
