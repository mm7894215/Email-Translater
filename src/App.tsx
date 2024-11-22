import React, { useState } from 'react';
import { EmailUploader } from './components/EmailUploader';
import { EmailPreview } from './components/EmailPreview';

function App() {
  const [emailContent, setEmailContent] = useState<string>('');

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-[1600px] mx-auto">
        <header className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Email Translator</h1>
          <p className="text-gray-600">Upload and translate your HTML emails into multiple languages</p>
        </header>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-3 bg-white rounded-lg shadow">
            <div className="p-4 border-b">
              <h2 className="text-lg font-semibold text-gray-800">Upload Email</h2>
              <p className="text-sm text-gray-500 mt-1">Select an HTML email file to translate</p>
            </div>
            <EmailUploader onFileUpload={setEmailContent} />
          </div>
          
          <div className="lg:col-span-9 bg-white rounded-lg shadow">
            <EmailPreview htmlContent={emailContent} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;