import { useState } from 'react';
import { SimpleCalendar } from './SimpleCalendar';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { PeriodEntry, CycleData } from '../types';
import { 
  calculateOvulationDate, 
  calculateFertileWindow, 
  predictNextPeriod,
  isDateInRange,
  isSameDay
} from '../utils/cycleCalculations';
import { AddPeriodDialog } from './AddPeriodDialog';
import { Button } from './ui/button';
import { Droplets, Heart, Calendar as CalendarIcon, Trash2 } from 'lucide-react';

interface PeriodCalendarProps {
  periods: PeriodEntry[];
  cycleData: CycleData;
  onAddPeriod: (period: Omit<PeriodEntry, 'id'>) => void;
  onDeletePeriod: (id: string) => void;
}

export function PeriodCalendar({ periods, cycleData, onAddPeriod, onDeletePeriod }: PeriodCalendarProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  
  const lastPeriod = periods.length > 0 ? new Date(periods[0].startDate) : null;
  const nextPeriod = lastPeriod ? predictNextPeriod(lastPeriod, cycleData.averageLength) : null;
  const ovulationDate = lastPeriod ? calculateOvulationDate(lastPeriod, cycleData.averageLength) : null;
  const fertileWindow = ovulationDate ? calculateFertileWindow(ovulationDate) : null;

  const getDayContent = (date: Date) => {
    const dayPeriods = periods.filter(period => {
      const start = new Date(period.startDate);
      const end = period.endDate ? new Date(period.endDate) : start;
      return isDateInRange(date, start, end);
    });

    const isOvulation = ovulationDate && isSameDay(date, ovulationDate);
    const isFertile = fertileWindow && isDateInRange(date, fertileWindow.start, fertileWindow.end) && !isOvulation;
    const isNextPeriod = nextPeriod && isSameDay(date, nextPeriod);

    if (dayPeriods.length > 0) {
      return (
        <div className="absolute inset-0 bg-pink-500 text-white rounded-sm flex items-center justify-center">
          <Droplets className="h-3 w-3" />
        </div>
      );
    }

    if (isOvulation) {
      return (
        <div className="absolute inset-0 bg-pink-300 text-white rounded-sm flex items-center justify-center">
          <Heart className="h-3 w-3" />
        </div>
      );
    }

    if (isFertile) {
      return (
        <div className="absolute inset-0 bg-pink-100 border border-pink-300 rounded-sm">
        </div>
      );
    }

    if (isNextPeriod) {
      return (
        <div className="absolute inset-0 bg-pink-200 border-2 border-dashed border-pink-400 rounded-sm">
        </div>
      );
    }

    return null;
  };

  const getSelectedDateInfo = () => {
    if (!selectedDate) return null;

    const selectedPeriod = periods.find(period => {
      const start = new Date(period.startDate);
      const end = period.endDate ? new Date(period.endDate) : start;
      return isDateInRange(selectedDate, start, end);
    });

    const isOvulation = ovulationDate && isSameDay(selectedDate, ovulationDate);
    const isFertile = fertileWindow && isDateInRange(selectedDate, fertileWindow.start, fertileWindow.end);
    const isNextPeriod = nextPeriod && isSameDay(selectedDate, nextPeriod);

    return {
      period: selectedPeriod,
      isOvulation,
      isFertile,
      isNextPeriod
    };
  };

  const selectedInfo = getSelectedDateInfo();

  return (
    <div className="space-y-6">
      {/* Legend */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarIcon className="h-5 w-5" />
            Period Calendar
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4 mb-4">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-pink-500 rounded-sm"></div>
              <span className="text-sm">Period Days</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-pink-300 rounded-sm"></div>
              <span className="text-sm">Ovulation</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-pink-100 border border-pink-300 rounded-sm"></div>
              <span className="text-sm">Fertile Window</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-pink-200 border-2 border-dashed border-pink-400 rounded-sm"></div>
              <span className="text-sm">Predicted Period</span>
            </div>
          </div>

          <SimpleCalendar
            selected={selectedDate}
            onSelect={setSelectedDate}
            className="w-full"
            components={{
              DayContent: ({ date }) => getDayContent(date)
            }}
          />

          <div className="mt-4 flex justify-between items-center">
            <AddPeriodDialog onAddPeriod={onAddPeriod} selectedDate={selectedDate} />
            
            {/* Cycle Stats */}
            <div className="text-sm text-muted-foreground">
              Cycle: {cycleData.averageLength} days | Period: {cycleData.periodLength} days
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Selected Date Info */}
      {selectedDate && (
        <Card>
          <CardHeader>
            <CardTitle>
              {selectedDate.toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {selectedInfo?.period && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Badge variant="secondary" className="bg-pink-100 text-pink-700">
                    Period Day - {selectedInfo.period.flow} flow
                  </Badge>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDeletePeriod(selectedInfo.period!.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                
                {selectedInfo.period.symptoms.length > 0 && (
                  <div>
                    <p className="text-sm font-medium">Symptoms:</p>
                    <div className="flex flex-wrap gap-1">
                      {selectedInfo.period.symptoms.map(symptom => (
                        <Badge key={symptom} variant="outline" className="text-xs">
                          {symptom}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                
                {selectedInfo.period.notes && (
                  <div>
                    <p className="text-sm font-medium">Notes:</p>
                    <p className="text-sm text-muted-foreground">{selectedInfo.period.notes}</p>
                  </div>
                )}
              </div>
            )}

            {selectedInfo?.isOvulation && (
              <Badge variant="secondary" className="bg-pink-100 text-pink-700">
                Ovulation Day - High fertility
              </Badge>
            )}

            {selectedInfo?.isFertile && !selectedInfo.isOvulation && (
              <Badge variant="outline" className="border-pink-300 text-pink-700">
                Fertile Window
              </Badge>
            )}

            {selectedInfo?.isNextPeriod && (
              <Badge variant="outline" className="border-pink-400 text-pink-700">
                Predicted Period Start
              </Badge>
            )}

            {!selectedInfo?.period && !selectedInfo?.isOvulation && !selectedInfo?.isFertile && !selectedInfo?.isNextPeriod && (
              <p className="text-muted-foreground">No events on this date</p>
            )}
          </CardContent>
        </Card>
      )}

      {/* Upcoming Events */}
      <Card>
        <CardHeader>
          <CardTitle>Upcoming Events</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {nextPeriod && (
            <div className="flex items-center justify-between p-3 bg-pink-50 rounded-lg">
              <div>
                <p className="font-medium text-pink-700">Next Period</p>
                <p className="text-sm text-pink-600">
                  {nextPeriod.toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </p>
              </div>
              <Droplets className="h-5 w-5 text-pink-500" />
            </div>
          )}

          {ovulationDate && (
            <div className="flex items-center justify-between p-3 bg-pink-50 rounded-lg">
              <div>
                <p className="font-medium text-pink-700">Next Ovulation</p>
                <p className="text-sm text-pink-600">
                  {ovulationDate.toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </p>
              </div>
              <Heart className="h-5 w-5 text-pink-500" />
            </div>
          )}

          {fertileWindow && (
            <div className="p-3 bg-pink-50 rounded-lg">
              <p className="font-medium text-pink-700">Fertile Window</p>
              <p className="text-sm text-pink-600">
                {fertileWindow.start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - {' '}
                {fertileWindow.end.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}