import React, { useRef, useState } from 'react';

interface EmailUploaderProps {
  onFileUpload: (content: string) => void;
}

export const EmailUploader: React.FC<EmailUploaderProps> = ({ onFileUpload }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.html')) {
      setError('Please upload an HTML file');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      onFileUpload(content);
      setError(null);
    };
    reader.onerror = () => {
      setError('Failed to read file');
    };
    reader.readAsText(file);
  };

  return (
    <div className="p-4">
      <div className="flex items-center justify-center w-full">
        <label
          htmlFor="email-file"
          className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
        >
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <svg
              className="w-10 h-10 mb-3 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
            <p className="mb-2 text-sm text-gray-500">
              <span className="font-semibold">Click to upload</span> or drag and drop
            </p>
            <p className="text-xs text-gray-500">HTML files only</p>
          </div>
          <input
            ref={fileInputRef}
            id="email-file"
            type="file"
            accept=".html"
            className="hidden"
            onChange={handleFileChange}
          />
        </label>
      </div>
      {error && (
        <div className="mt-2 text-red-500 text-sm text-center">
          {error}
        </div>
      )}
    </div>
  );
}; 