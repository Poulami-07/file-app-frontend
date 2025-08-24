import React, { useState, useEffect } from "react";
import { Download } from "lucide-react";
import { supabase } from "../supabaseClient";

export default function SharedFiles() {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSharedFiles();
  }, []);

  const fetchSharedFiles = async () => {
    try {
      const { data, error } = await supabase
        .from("file_metadata")
        .select("*")
        .eq("visibility", "public");

      if (error) throw error;
      setFiles(data);
    } catch (error) {
      console.error("Error fetching shared files:", error);
      alert("Failed to load shared files");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (file) => {
    try {
      const { data, error } = await supabase.storage
        .from("Drive")
        .createSignedUrl(file.path, 3600);
      if (error) throw error;

      const a = document.createElement("a");
      a.href = data.signedUrl;
      a.download = file.filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (error) {
      console.error("Download error:", error);
      alert("Failed to download file");
    }
  };

  if (loading) {
    return (
      <div className="text-center py-8">Loading shared files...</div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">🌍 Shared Files</h1>
      {files.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">No shared files</div>
          <p className="text-gray-600">Files marked as public will appear here</p>
        </div>
      ) : (
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="divide-y divide-gray-200">
            {files.map((file) => (
              <div
                key={file.id}
                className="p-4 flex items-center justify-between hover:bg-gray-50"
              >
                <div className="flex items-center space-x-4 flex-1 min-w-0">
                  <div className="h-10 w-10 bg-indigo-100 rounded-md flex items-center justify-center">
                    <span className="text-indigo-600 font-medium">
                      {file.filename.split(".").pop().toUpperCase()}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {file.filename}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleDownload(file)}
                    className="p-2 text-gray-400 hover:text-indigo-600"
                    title="Download"
                  >
                    <Download size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
