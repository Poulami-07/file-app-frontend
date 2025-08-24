// RecycleBin.js
import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { RotateCcw, Trash2 } from "lucide-react";
import "../App.css";

export default function RecycleBin() {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);


    
  useEffect(() => {
    fetchRecycleBinFiles();
  }, []);

  const fetchRecycleBinFiles = async () => {
    try {
      setLoading(true);

      let { data, error } = await supabase.storage
        .from("Drive")
        .list("recycle-bin", { limit: 100 });

      if (error) throw error;
      setFiles(data);
    } catch (error) {
      console.error("Error fetching recycle bin:", error.message);
    } finally {
      setLoading(false);
    }
  };

  const restoreFile = async (file) => {
    try {
      const { error } = await supabase.storage
        .from("Drive")
        .move(`recycle-bin/${file.name}`, `uploads/${file.name}`);

      if (error) throw error;
      alert("File restored!");
      fetchRecycleBinFiles();
    } catch (error) {
      console.error("Restore error:", error.message);
      alert("Failed to restore file");
    }
  };

  const permanentlyDelete = async (file) => {
    if (!window.confirm("Permanently delete this file?")) return;

    try {
      const { error } = await supabase.storage
        .from("Drive")
        .remove([`recycle-bin/${file.name}`]);

      if (error) throw error;
      alert("File permanently deleted!");
      fetchRecycleBinFiles();
    } catch (error) {
      console.error("Permanent delete error:", error.message);
      alert("Failed to delete file");
    }
  };

  if (loading) return <div className="text-center py-8">Loading...</div>;

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden p-4">
      <h2 className="text-lg font-bold mb-4">🗑️ Recycle Bin</h2>
      {files.length === 0 ? (
        <p>No files in recycle bin</p>
      ) : (
        <div className="divide-y divide-gray-200">
          {files.map((file) => (
            <div key={file.name} className="p-3 flex items-center justify-between">
              <p>{file.name}</p>
              <div className="flex space-x-2">
                <button
                  onClick={() => restoreFile(file)}
                  className="p-2 text-gray-400 hover:text-green-600"
                >
                  <RotateCcw size={16} /> Restore
                </button>
                <button
                  onClick={() => permanentlyDelete(file)}
                  className="p-2 text-gray-400 hover:text-red-600"
                >
                  <Trash2 size={16} /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
