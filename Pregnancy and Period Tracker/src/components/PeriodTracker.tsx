import { useState, useEffect } from 'react';
import { PeriodEntry, CycleData } from '../types';
import { calculateAverageCycleLength, calculateAveragePeriodLength } from '../utils/cycleCalculations';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { PeriodCalendar } from './PeriodCalendar';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Droplets, TrendingUp, Calendar, Clock } from 'lucide-react';

export function PeriodTracker() {
  const [periodsRaw, setPeriodsRaw] = useLocalStorage<PeriodEntry[]>('periods', []);
  
  // Ensure periods are always sorted by date (most recent first)
  const periods = periodsRaw.sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime());
  const setPeriods = (value: PeriodEntry[] | ((prev: PeriodEntry[]) => PeriodEntry[])) => {
    if (typeof value === 'function') {
      setPeriodsRaw(prev => {
        const updated = value(prev);
        return updated.sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime());
      });
    } else {
      const sorted = value.sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime());
      setPeriodsRaw(sorted);
    }
  };
  const [cycleData, setCycleData] = useLocalStorage<CycleData>('cycleData', {
    averageLength: 28,
    periodLength: 5,
    lastCalculated: new Date()
  });

  // Update cycle data when periods change
  useEffect(() => {
    if (periods.length > 0) {
      const avgCycleLength = calculateAverageCycleLength(periods);
      const avgPeriodLength = calculateAveragePeriodLength(periods);
      
      setCycleData({
        averageLength: avgCycleLength,
        periodLength: avgPeriodLength,
        lastCalculated: new Date()
      });
    }
  }, [periods, setCycleData]);

  const addPeriod = (periodData: Omit<PeriodEntry, 'id'>) => {
    const newPeriod: PeriodEntry = {
      ...periodData,
      id: Date.now().toString()
    };
    
    // Add to array (sorting will be handled by setPeriods)
    setPeriods(prevPeriods => [newPeriod, ...prevPeriods]);
  };

  const deletePeriod = (id: string) => {
    setPeriods(prevPeriods => prevPeriods.filter(period => period.id !== id));
  };

  const getInsights = () => {
    if (periods.length === 0) return null;

    const lastPeriod = periods[0];
    const daysSinceLastPeriod = Math.floor(
      (new Date().getTime() - new Date(lastPeriod.startDate).getTime()) / (1000 * 60 * 60 * 24)
    );

    const insights = [];

    if (daysSinceLastPeriod > cycleData.averageLength + 7) {
      insights.push({
        type: 'warning',
        message: `Your period is ${daysSinceLastPeriod - cycleData.averageLength} days late based on your average cycle.`
      });
    } else if (daysSinceLastPeriod < cycleData.averageLength - 7) {
      insights.push({
        type: 'info',
        message: `Your next period is expected in about ${cycleData.averageLength - daysSinceLastPeriod} days.`
      });
    }

    // Cycle regularity insight
    if (periods.length >= 3) {
      const cycles = [];
      for (let i = 1; i < Math.min(periods.length, 4); i++) {
        const current = new Date(periods[i - 1].startDate);
        const previous = new Date(periods[i].startDate);
        cycles.push(Math.round((current.getTime() - previous.getTime()) / (1000 * 60 * 60 * 24)));
      }
      
      const maxVariation = Math.max(...cycles) - Math.min(...cycles);
      if (maxVariation <= 7) {
        insights.push({
          type: 'success',
          message: 'Your cycles are very regular! This makes predictions more accurate.'
        });
      } else if (maxVariation > 14) {
        insights.push({
          type: 'info',
          message: 'Your cycles vary quite a bit. This is normal, but predictions may be less accurate.'
        });
      }
    }

    return insights;
  };

  const insights = getInsights();

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="flex items-center p-6">
            <div className="p-2 bg-pink-100 rounded-lg mr-4">
              <Droplets className="h-6 w-6 text-pink-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{periods.length}</p>
              <p className="text-sm text-muted-foreground">Periods Tracked</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center p-6">
            <div className="p-2 bg-pink-100 rounded-lg mr-4">
              <TrendingUp className="h-6 w-6 text-pink-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{cycleData.averageLength}</p>
              <p className="text-sm text-muted-foreground">Avg Cycle Length</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center p-6">
            <div className="p-2 bg-pink-100 rounded-lg mr-4">
              <Clock className="h-6 w-6 text-pink-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{cycleData.periodLength}</p>
              <p className="text-sm text-muted-foreground">Avg Period Length</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Insights */}
      {insights && insights.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Cycle Insights</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {insights.map((insight, index) => (
              <div
                key={index}
                className={`p-3 rounded-lg ${
                  insight.type === 'warning' 
                    ? 'bg-yellow-50 border border-yellow-200' 
                    : insight.type === 'success'
                    ? 'bg-green-50 border border-green-200'
                    : 'bg-blue-50 border border-blue-200'
                }`}
              >
                <p className={`text-sm ${
                  insight.type === 'warning' 
                    ? 'text-yellow-700' 
                    : insight.type === 'success'
                    ? 'text-green-700'
                    : 'text-blue-700'
                }`}>
                  {insight.message}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Calendar */}
      <PeriodCalendar
        periods={periods}
        cycleData={cycleData}
        onAddPeriod={addPeriod}
        onDeletePeriod={deletePeriod}
      />

      {/* Recent Periods */}
      {periods.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recent Periods</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {periods.slice(0, 5).map((period) => (
                <div key={period.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">
                      {new Date(period.startDate).toLocaleDateString('en-US', { 
                        month: 'long', 
                        day: 'numeric',
                        year: 'numeric'
                      })}
                      {period.endDate && (
                        <span className="text-muted-foreground">
                          {' '}- {new Date(period.endDate).toLocaleDateString('en-US', { 
                            month: 'long', 
                            day: 'numeric'
                          })}
                        </span>
                      )}
                    </p>
                    {period.symptoms.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-1">
                        {period.symptoms.slice(0, 3).map(symptom => (
                          <Badge key={symptom} variant="outline" className="text-xs">
                            {symptom}
                          </Badge>
                        ))}
                        {period.symptoms.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{period.symptoms.length - 3} more
                          </Badge>
                        )}
                      </div>
                    )}
                  </div>
                  <Badge variant="secondary" className={`
                    ${period.flow === 'light' ? 'bg-pink-100 text-pink-600' : 
                      period.flow === 'heavy' ? 'bg-pink-500 text-white' : 
                      'bg-pink-300 text-pink-800'}
                  `}>
                    {period.flow}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}