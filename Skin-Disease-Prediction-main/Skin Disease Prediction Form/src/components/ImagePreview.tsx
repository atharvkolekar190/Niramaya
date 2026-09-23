import React from 'react';

interface ImagePreviewProps {
  file: File | null;
}

export function ImagePreview({ file }: ImagePreviewProps) {
  if (!file) return null;

  const imageUrl = URL.createObjectURL(file);

  return (
    <div id="imagePreview" className="w-full">
      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-4 shadow-sm">
        <h3 className="mb-3 text-slate-800 dark:text-slate-100 font-medium">Clinical Image Preview</h3>
        <div className="relative overflow-hidden rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
          <img
            src={imageUrl}
            alt="Medical image preview"
            className="w-full h-64 object-contain"
            onLoad={() => URL.revokeObjectURL(imageUrl)}
          />
        </div>
        <div className="mt-3 text-sm text-slate-600 dark:text-slate-400">
          <p>Image preprocessing: Automatic normalization and 22×22 pixel standardization for neural network analysis</p>
        </div>
      </div>
    </div>
  );
}