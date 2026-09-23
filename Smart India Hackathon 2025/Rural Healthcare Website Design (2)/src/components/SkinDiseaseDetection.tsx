import React, { useState } from 'react';
import { ArrowLeft, Upload, Brain, Activity, AlertTriangle, Camera, X } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';

interface SkinDiseaseDetectionProps {
  onBack: () => void;
}

interface PredictionResult {
  disease: string;
  confidence: number;
  message: string;
}

export default function SkinDiseaseDetection({ onBack }: SkinDiseaseDetectionProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Helper function to format confidence percentage correctly
  const formatConfidence = (confidence: number): string => {
    // If confidence is already a percentage (>= 1), use it as is
    // If confidence is a decimal (< 1), convert to percentage
    if (confidence >= 1) {
      return confidence.toFixed(2);
    } else {
      return (confidence * 100).toFixed(2);
    }
  };

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
    setResult(null);
    setError(null);
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setResult(null);
    setError(null);
  };

  const handlePredict = async () => {
    if (!selectedFile) return;

    setIsLoading(true);
    setResult(null);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('image', selectedFile);

      console.log('Sending prediction request with file:', selectedFile.name);
      console.log('File details:', {
        name: selectedFile.name,
        size: selectedFile.size,
        type: selectedFile.type
      });
      console.log('Request URL:', 'http://localhost:5002/predict');
      
      const response = await fetch('http://localhost:5002/predict', {
        method: 'POST',
        body: formData,
        headers: {
          // Don't set Content-Type, let browser set it with boundary
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Prediction response:', data);

      if (data.success && data.disease && data.confidence !== undefined) {
        setResult({
          disease: data.disease,
          confidence: data.confidence,
          message: data.prediction || `The AI model suggests this might be ${data.disease} with ${formatConfidence(data.confidence)}% confidence.`
        });
      } else {
        throw new Error(data.error || 'Invalid response format from prediction API');
      }
    } catch (err: any) {
      console.error('Prediction error:', err);
      if (err instanceof TypeError && err.message.includes('fetch')) {
        setError('Unable to connect to the prediction server. Please make sure the Flask backend is running on port 5002.');
      } else if (err.message.includes('Failed to fetch')) {
        setError('Network error: Unable to reach the prediction server. Please check your internet connection and try again.');
      } else {
        setError(err.message || 'An error occurred during prediction. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    console.log('File selected:', file);
    if (file) {
      console.log('File details:', {
        name: file.name,
        size: file.size,
        type: file.type,
        lastModified: file.lastModified
      });
      handleFileSelect(file);
    } else {
      console.log('No file selected');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[10000] p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={onBack}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back</span>
              </Button>
              <div className="h-6 w-px bg-gray-300" />
              <div className="flex items-center space-x-2">
                <Brain className="h-6 w-6 text-purple-600" />
                <h1 className="text-xl font-bold text-gray-900">
                  AI Skin Disease Detection
                </h1>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onBack}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Upload Section */}
          {!selectedFile ? (
            <div className="text-center">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 hover:border-purple-400 transition-colors">
                <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Upload Skin Image
                </h3>
                <p className="text-gray-600 mb-4">
                  Upload a clear image of the affected skin area for analysis
                </p>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                  id="file-upload"
                />
                <Button asChild>
                  <label htmlFor="file-upload" className="cursor-pointer">
                    <Camera className="h-4 w-4 mr-2" />
                    Choose Image
                  </label>
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-16 h-16 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Brain className="h-8 w-8 text-purple-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{selectedFile.name}</h4>
                    <p className="text-sm text-gray-600">
                      {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleRemoveFile}
                  className="text-gray-400 hover:text-red-600"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <Button
                onClick={handlePredict}
                disabled={isLoading}
                className="w-full bg-purple-600 hover:bg-purple-700"
              >
                {isLoading ? (
                  <>
                    <Activity className="h-4 w-4 mr-2 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Brain className="h-4 w-4 mr-2" />
                    Analyze Image
                  </>
                )}
              </Button>
            </div>
          )}

          {/* Results Display */}
          {result && (
            <div className="space-y-4">
              <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold text-purple-900">Predicted Condition</h4>
                    <p className="text-lg capitalize text-purple-800">{result.disease}</p>
                  </div>
                  <Brain className="h-8 w-8 text-purple-600" />
                </div>
              </div>

              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold text-blue-900">Confidence Level</h4>
                    <p className="text-lg text-blue-800">{formatConfidence(result.confidence)}%</p>
                  </div>
                  <Activity className="h-8 w-8 text-blue-600" />
                </div>
              </div>

              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-start space-x-3">
                  <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-yellow-800">Important Disclaimer</h4>
                    <p className="text-yellow-700 text-sm mt-1">
                      This is an AI-powered preliminary assessment only. Please consult with a qualified dermatologist for proper diagnosis and treatment.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Error Display */}
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-red-800">Error</h4>
                  <p className="text-red-700 mt-1">{error}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
