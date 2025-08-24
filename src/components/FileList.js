
import React, { useState, useEffect } from "react";
import { Download, Share2, Trash2, Eye } from "lucide-react";
import { supabase } from "../supabaseClient";
import ShareModal from "./ShareModal";
import "../App.css";

export default function FileList({ searchQuery }) {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    fetchFiles();
  }, [searchQuery]);

  const fetchFiles = async () => {
    try {
      setLoading(true);

      let { data, error } = await supabase.storage
        .from("Drive")
        .list("uploads", { limit: 100 });

      if (error) throw error;

      if (searchQuery) {
        data = data.filter((file) =>
          file.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }

      const filesWithUrls = await Promise.all(
        data.map(async (file) => {
          const { data: urlData } = await supabase.storage
            .from("Drive")
            .createSignedUrl(`uploads/${file.name}`, 3600);
          return { ...file, url: urlData?.signedUrl || null };
        })
      );

      setFiles(filesWithUrls);
    } catch (error) {
      console.error("Error fetching files:", error.message);
      alert("Failed to load files");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = (file) => {
    if (!file.url) return alert("No download URL available");
    const a = document.createElement("a");
    a.href = file.url;
    a.download = file.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  
  const handleDelete = async (file) => {
    if (!window.confirm("Move this file to Recycle Bin?")) return;

    try {
      const { error } = await supabase.storage
        .from("Drive")
        .move(`uploads/${file.name}`, `recycle-bin/${file.name}`);

      if (error) throw error;

      alert("File moved to Recycle Bin");
      fetchFiles();
    } catch (error) {
      console.error("Delete error:", error.message);
      alert("Failed to move file");
    }
  };

  const openShareModal = (file) => {
    setSelectedFile(file);
    setShareModalOpen(true);
  };

  if (loading) return <div className="text-center py-8">Loading files...</div>;

  if (files.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 mb-4">No files found</div>
        <p className="text-gray-600">Upload your first file to get started</p>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="divide-y divide-gray-200">
          {files.map((file) => (
            <div
              key={file.name}
              className="p-4 flex items-center justify-between hover:bg-gray-50"
            >
              <div className="flex items-center space-x-4 flex-1 min-w-0">
                <div className="h-10 w-10 bg-indigo-100 rounded-md flex items-center justify-center">
                  <span className="text-indigo-600 font-medium">
                    {file.name.split(".").pop()}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {file.name}
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
                <button
                  onClick={() => openShareModal(file)}
                  className="p-2 text-gray-400 hover:text-indigo-600"
                  title="Share"
                >
                  <Share2 size={16} />
                </button>
                <button
                  onClick={() => handleDelete(file)}
                  className="p-2 text-gray-400 hover:text-red-600"
                  title="Delete"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <ShareModal
        isOpen={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
        file={selectedFile}
        onShare={fetchFiles}
      />
    </>
  );
}
