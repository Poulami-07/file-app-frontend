import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, X } from 'lucide-react';
import { supabase } from '../supabaseClient';
import "../App.css";
export default function FileUpload() {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles(selectedFiles);
  };

  const removeFile = (index) => {
    const newFiles = [...files];
    newFiles.splice(index, 1);
    setFiles(newFiles);
  };

  const handleUpload = async () => {
    if (files.length === 0) return;

    setUploading(true);

    try {
      for (const file of files) {
        // 👇 Upload directly to Supabase bucket named "Drive"
        const { data, error } = await supabase.storage
          .from("Drive") // bucket name
          .upload(`uploads/${Date.now()}-${file.name}`, file, {
            cacheControl: "3600",
            upsert: false,
          });

        if (error) {
          throw new Error(`Failed to upload ${file.name}: ${error.message}`);
        }
      }

      alert("Files uploaded successfully!");
      navigate("/");
    } catch (error) {
      alert(`Upload failed: ${error.message}`);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Upload Files</h1>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
          <input
            type="file"
            multiple
            onChange={handleFileChange}
            className="hidden"
            id="file-upload"
          />
          <label htmlFor="file-upload" className="cursor-pointer">
            <Upload className="mx-auto h-12 w-12 text-gray-400" />
            <span className="mt-2 block text-sm font-medium text-gray-900">
              Drag files here or click to select
            </span>
          </label>
        </div>

        {files.length > 0 && (
          <div className="mt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Selected Files</h3>
            <div className="space-y-2">
              {files.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between bg-gray-50 rounded-md p-3"
                >
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0">
                      <div className="h-10 w-10 bg-indigo-100 rounded-md flex items-center justify-center">
                        <span className="text-indigo-600 font-medium">
                          {file.name.split(".").pop()}
                        </span>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{file.name}</p>
                      <p className="text-xs text-gray-500">
                        {(file.size / 1024).toFixed(2)} KB
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => removeFile(index)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
            </div>

            <div className="mt-6">
              <button
                onClick={handleUpload}
                disabled={uploading}
                className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
              >
                {uploading
                  ? "Uploading..."
                  : `Upload ${files.length} file${files.length !== 1 ? "s" : ""}`}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
