import React, { useState } from 'react';
import { Button } from './components/ui/button';
import { Card } from './components/ui/card';
import { Brain, Activity, ArrowLeft } from 'lucide-react';
import { FileUpload } from './components/FileUpload';
import { ImagePreview } from './components/ImagePreview';
import { LoadingSpinner } from './components/LoadingSpinner';
import { PredictionResults } from './components/PredictionResults';

interface PredictionResult {
  disease: string;
  confidence: number;
  message: string;
}

export default function App() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [error, setError] = useState<string | null>(null);

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

  const handleBackToMain = () => {
    window.location.href = 'http://localhost:3000';
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
      
      const response = await fetch('http://localhost:5002/predict', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Server error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      
      if (data.success && data.prediction) {
        setResult({
          disease: data.disease,
          confidence: data.confidence,
          message: data.prediction
        });
      } else {
        throw new Error(data.error || 'Invalid response format from server');
      }
    } catch (err) {
      console.error('Prediction error:', err);
      
      if (err instanceof TypeError && err.message.includes('fetch')) {
        setError('Unable to connect to the prediction server. Please make sure the Flask backend is running on port 5002.');
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred during prediction. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-between">
            <Button
              onClick={handleBackToMain}
              variant="outline"
              className="flex items-center gap-2 text-slate-600 hover:text-slate-800 hover:bg-slate-50"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Main Website
            </Button>
            <div className="flex items-center justify-center gap-3 flex-1">
              <div className="p-3 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800">
                <Brain className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              </div>
              <h1 className="text-3xl font-semibold text-slate-800 dark:text-slate-100">Medical AI Diagnostics</h1>
            </div>
            <div className="w-32"></div> {/* Spacer for centering */}
          </div>
          <p className="text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
            Advanced AI-powered dermatological analysis system for clinical-grade skin condition detection. 
            Our neural network identifies Acne, Melanoma, Dermatitis, Fungal infections, and Vitiligo with medical-grade accuracy.
          </p>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Upload Section */}
          <div className="space-y-6">
            <Card className="p-6 border border-slate-200 dark:border-slate-700 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-md">
                  <Activity className="h-5 w-5 text-slate-600 dark:text-slate-400" />
                </div>
                <h2 className="text-slate-800 dark:text-slate-100 font-medium">Image Analysis</h2>
              </div>
              
              <div className="space-y-6">
                <FileUpload
                  onFileSelect={handleFileSelect}
                  selectedFile={selectedFile}
                  onRemoveFile={handleRemoveFile}
                  isLoading={isLoading}
                />
                
                <Button
                  id="btn-predict"
                  onClick={handlePredict}
                  disabled={!selectedFile || isLoading}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                  size="lg"
                >
                  {isLoading ? 'Processing Analysis...' : 'Begin Diagnostic Analysis'}
                </Button>
              </div>
            </Card>

            {selectedFile && !isLoading && !result && (
              <ImagePreview file={selectedFile} />
            )}
          </div>

          {/* Results Section */}
          <div className="space-y-6">
            {isLoading && (
              <LoadingSpinner
                isVisible={isLoading}
                message="Running AI diagnostic analysis..."
              />
            )}

            {(result || error) && (
              <PredictionResults result={result} error={error} />
            )}

            {!isLoading && !result && !error && (
              <Card className="p-8 text-center border border-slate-200 dark:border-slate-700">
                <div className="space-y-4">
                  <div className="w-16 h-16 mx-auto bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center">
                    <Brain className="h-8 w-8 text-slate-500 dark:text-slate-400" />
                  </div>
                  <h3 className="text-slate-700 dark:text-slate-300 font-medium">System Ready</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Upload a dermatological image to begin AI-powered diagnostic analysis
                  </p>
                </div>
              </Card>
            )}
          </div>
        </div>

        {/* Clinical Features */}
        <Card className="p-6 border border-slate-200 dark:border-slate-700">
          <h3 className="mb-4 text-slate-800 dark:text-slate-100 font-medium">Clinical Capabilities</h3>
          <div className="grid md:grid-cols-3 gap-6 text-sm">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                <h4 className="font-medium text-slate-800 dark:text-slate-100">Deep Learning Architecture</h4>
              </div>
              <p className="text-slate-600 dark:text-slate-300">
                Convolutional neural network trained on extensive dermatological datasets with clinical validation
              </p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                <h4 className="font-medium text-slate-800 dark:text-slate-100">Multi-Class Detection</h4>
              </div>
              <p className="text-slate-600 dark:text-slate-300">
                Simultaneous identification across five primary dermatological condition categories
              </p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-amber-600 rounded-full"></div>
                <h4 className="font-medium text-slate-800 dark:text-slate-100">Confidence Analytics</h4>
              </div>
              <p className="text-slate-600 dark:text-slate-300">
                Statistical confidence intervals with uncertainty quantification for clinical decision support
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}