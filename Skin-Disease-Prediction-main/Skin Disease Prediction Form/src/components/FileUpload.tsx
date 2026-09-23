import React, { useRef, useState } from 'react';
import { Upload, X } from 'lucide-react';
import { Button } from './ui/button';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  selectedFile: File | null;
  onRemoveFile: () => void;
  isLoading: boolean;
}

export function FileUpload({ onFileSelect, selectedFile, onRemoveFile, isLoading }: FileUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const handleFileSelect = (file: File) => {
    if (validateFile(file)) {
      onFileSelect(file);
    }
  };

  const validateFile = (file: File): boolean => {
    const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg'];
    const maxSize = 10 * 1024 * 1024; // 10MB

    if (!allowedTypes.includes(file.type)) {
      alert('Please select a PNG, JPG, or JPEG image file.');
      return false;
    }

    if (file.size > maxSize) {
      alert('File size must be less than 10MB.');
      return false;
    }

    return true;
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleClick = () => {
    if (!isLoading) {
      fileInputRef.current?.click();
    }
  };

  return (
    <div className="w-full">
      <input
        ref={fileInputRef}
        type="file"
        name="image"
        id="imageUpload"
        accept=".png,.jpg,.jpeg"
        onChange={handleInputChange}
        className="hidden"
        disabled={isLoading}
      />
      
      {selectedFile ? (
        <div className="relative bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Upload className="h-5 w-5 text-slate-500 dark:text-slate-400" />
              <div>
                <p className="font-medium text-slate-800 dark:text-slate-100">{selectedFile.name}</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onRemoveFile}
              disabled={isLoading}
              className="h-8 w-8 p-0 hover:bg-slate-100 dark:hover:bg-slate-700"
            >
              <X className="h-4 w-4 text-slate-500 dark:text-slate-400" />
            </Button>
          </div>
        </div>
      ) : (
        <div
          className={`relative border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-200 ${
            isDragOver
              ? 'border-blue-400 bg-blue-50 dark:bg-blue-950/50'
              : 'border-slate-300 dark:border-slate-600 hover:border-blue-400 dark:hover:border-blue-500 hover:bg-slate-50 dark:hover:bg-slate-800/50'
          } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={handleClick}
        >
          <Upload className="mx-auto h-12 w-12 text-slate-400 dark:text-slate-500 mb-4" />
          <div>
            <p className="text-lg mb-2 text-slate-700 dark:text-slate-300">
              Drop your medical image here, or{' '}
              <span className="text-blue-600 dark:text-blue-400 underline">browse files</span>
            </p>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Supports PNG, JPG, JPEG • Maximum 10MB
            </p>
          </div>
        </div>
      )}
    </div>
  );
}