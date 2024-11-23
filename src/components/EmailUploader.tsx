import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, File } from 'lucide-react';
import { Card } from './ui/card';

interface EmailUploaderProps {
  onUpload: (content: string, fileName: string) => void;
}

export function EmailUploader({ onUpload }: EmailUploaderProps) {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (file) {
        if (!file.name.endsWith('.html') && !file.name.endsWith('.htm')) {
          console.error('Please upload an HTML file');
          return;
        }

        console.log('Reading file:', file.name); // Debug log
        const reader = new FileReader();
        
        reader.onabort = () => {
          console.error('File reading was aborted');
        };
        
        reader.onerror = () => {
          console.error('File reading has failed');
        };
        
        reader.onload = () => {
          try {
            const content = reader.result as string;
            console.log('File content length:', content.length); // Debug log
            onUpload(content, file.name);
          } catch (error) {
            console.error('Error processing file:', error);
          }
        };

        reader.readAsText(file);
      }
    },
    [onUpload]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/html': ['.html', '.htm'],
    },
    multiple: false,
  });

  return (
    <Card
      {...getRootProps()}
      className={`p-6 border-2 border-dashed cursor-pointer transition-colors
        ${isDragActive 
          ? 'border-primary bg-primary/5' 
          : 'border-border hover:border-primary/50'}`}
    >
      <input {...getInputProps()} />
      <div className="flex flex-col items-center justify-center gap-2 text-center">
        {isDragActive ? (
          <>
            <File className="h-8 w-8 text-primary animate-bounce" />
            <p className="text-lg font-medium">Drop the HTML file here</p>
          </>
        ) : (
          <>
            <Upload className="h-8 w-8" />
            <p className="text-lg font-medium">
              Drag & drop your HTML file here
            </p>
            <p className="text-sm text-muted-foreground">
              or click to select a file
            </p>
          </>
        )}
      </div>
    </Card>
  );
}