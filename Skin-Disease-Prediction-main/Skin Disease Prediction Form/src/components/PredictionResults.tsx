import React from 'react';
import { CheckCircle, AlertCircle, Info } from 'lucide-react';
import { Progress } from './ui/progress';
import { Card } from './ui/card';
import { Badge } from './ui/badge';

interface PredictionResult {
  disease: string;
  confidence: number;
  message: string;
}

interface PredictionResultsProps {
  result: PredictionResult | null;
  error: string | null;
}

const diseaseInfo: Record<string, { description: string; severity: 'low' | 'medium' | 'high'; color: string }> = {
  'Acne': {
    description: 'A common skin condition that occurs when hair follicles become plugged with oil and dead skin cells.',
    severity: 'low',
    color: 'bg-blue-600'
  },
  'Melanoma': {
    description: 'A serious form of skin cancer that develops in melanocytes (pigment-producing cells).',
    severity: 'high',
    color: 'bg-red-600'
  },
  'Peeling skin': {
    description: 'Skin peeling can be caused by various factors including sunburn, dry skin, or medical conditions.',
    severity: 'medium',
    color: 'bg-orange-600'
  },
  'Ring worm': {
    description: 'A fungal infection that causes a ring-shaped rash on the skin.',
    severity: 'medium',
    color: 'bg-yellow-600'
  },
  'Vitiligo': {
    description: 'A condition where patches of skin lose their pigmentation due to melanocyte destruction.',
    severity: 'medium',
    color: 'bg-purple-600'
  }
};

export function PredictionResults({ result, error }: PredictionResultsProps) {
  if (error) {
    return (
      <div id="result" className="w-full">
        <Card className="p-6 border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950/50 shadow-sm">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 mt-0.5" />
            <div>
              <h3 className="text-red-800 dark:text-red-200 font-medium mb-2">Analysis Error</h3>
              <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  if (!result) return null;

  const diseaseData = diseaseInfo[result.disease];
  const confidenceLevel = result.confidence >= 80 ? 'high' : result.confidence >= 60 ? 'medium' : 'low';

  return (
    <div id="result" className="w-full space-y-4">
      <Card className="p-6 border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/50 shadow-sm">
        <div className="flex items-start gap-3 mb-4">
          <CheckCircle className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
          <div className="flex-1">
            <h3 className="text-blue-800 dark:text-blue-200 font-medium mb-2">Analysis Complete</h3>
            <p className="text-sm text-slate-700 dark:text-slate-300">{result.message}</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium text-slate-800 dark:text-slate-200">Diagnostic Confidence</span>
              <Badge variant={confidenceLevel === 'high' ? 'default' : confidenceLevel === 'medium' ? 'secondary' : 'destructive'} className="font-medium">
                {result.confidence.toFixed(2)}%
              </Badge>
            </div>
            <Progress value={result.confidence} className="h-3 bg-slate-200 dark:bg-slate-700" />
          </div>

          {diseaseData && (
            <div className="border-t border-slate-200 dark:border-slate-700 pt-4">
              <div className="flex items-center gap-2 mb-3">
                <div className={`w-3 h-3 rounded-full ${diseaseData.color}`} />
                <h4 className="font-medium text-slate-800 dark:text-slate-100">{result.disease}</h4>
                <Badge variant="outline" className="text-xs border-slate-300 dark:border-slate-600">
                  {diseaseData.severity} severity
                </Badge>
              </div>
              <div className="flex items-start gap-2">
                <Info className="h-4 w-4 text-slate-500 dark:text-slate-400 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-slate-600 dark:text-slate-300">{diseaseData.description}</p>
              </div>
            </div>
          )}
        </div>
      </Card>

      <Card className="p-4 bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800">
        <p className="text-xs text-amber-800 dark:text-amber-200 text-center">
          <strong>Medical Disclaimer:</strong> This AI diagnostic tool is for educational and research purposes only. 
          Results should not replace professional medical consultation or clinical diagnosis. Please consult a qualified dermatologist for medical evaluation.
        </p>
      </Card>
    </div>
  );
}