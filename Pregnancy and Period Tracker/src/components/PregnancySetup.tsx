import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { PregnancyData } from '../types';
import { calculateDueDate, calculatePregnancyWeek } from '../utils/cycleCalculations';
import { Baby, Calendar } from 'lucide-react';

interface PregnancySetupProps {
  onSetupPregnancy: (pregnancy: Omit<PregnancyData, 'id'>) => void;
}

export function PregnancySetup({ onSetupPregnancy }: PregnancySetupProps) {
  const [method, setMethod] = useState<'lmp' | 'conception' | 'dueDate'>('lmp');
  const [lastPeriodDate, setLastPeriodDate] = useState('');
  const [conceptionDate, setConceptionDate] = useState('');
  const [dueDate, setDueDate] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    let pregnancyData: Omit<PregnancyData, 'id'>;

    if (method === 'lmp' && lastPeriodDate) {
      const lmpDate = new Date(lastPeriodDate);
      pregnancyData = {
        lastPeriodDate: lmpDate,
        dueDate: calculateDueDate(lmpDate),
        currentWeek: calculatePregnancyWeek(lmpDate),
        isActive: true
      };
    } else if (method === 'conception' && conceptionDate) {
      const concepDate = new Date(conceptionDate);
      const lmpDate = new Date(concepDate);
      lmpDate.setDate(lmpDate.getDate() - 14); // Approximate LMP from conception
      
      pregnancyData = {
        conceptionDate: concepDate,
        lastPeriodDate: lmpDate,
        dueDate: calculateDueDate(lmpDate),
        currentWeek: calculatePregnancyWeek(lmpDate),
        isActive: true
      };
    } else if (method === 'dueDate' && dueDate) {
      const dueDateObj = new Date(dueDate);
      const lmpDate = new Date(dueDateObj);
      lmpDate.setDate(lmpDate.getDate() - 280); // 40 weeks before due date
      
      pregnancyData = {
        lastPeriodDate: lmpDate,
        dueDate: dueDateObj,
        currentWeek: calculatePregnancyWeek(lmpDate),
        isActive: true
      };
    } else {
      return;
    }

    onSetupPregnancy(pregnancyData);
  };

  return (
    <div className="max-w-md mx-auto">
      <Card>
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-2">
            <Baby className="h-6 w-6 text-primary" />
          </div>
          <CardTitle>Set Up Pregnancy Tracking</CardTitle>
          <p className="text-muted-foreground">
            Choose how you'd like to calculate your pregnancy timeline
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <RadioGroup value={method} onValueChange={(value: 'lmp' | 'conception' | 'dueDate') => setMethod(value)}>
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="lmp" id="lmp" />
                  <Label htmlFor="lmp">Last Menstrual Period (Most Common)</Label>
                </div>
                {method === 'lmp' && (
                  <div className="ml-6 space-y-2">
                    <Label htmlFor="lmpDate">First day of your last period</Label>
                    <Input
                      id="lmpDate"
                      type="date"
                      value={lastPeriodDate}
                      onChange={(e) => setLastPeriodDate(e.target.value)}
                      required
                    />
                  </div>
                )}

                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="conception" id="conception" />
                  <Label htmlFor="conception">Conception Date</Label>
                </div>
                {method === 'conception' && (
                  <div className="ml-6 space-y-2">
                    <Label htmlFor="conceptionDate">Date of conception</Label>
                    <Input
                      id="conceptionDate"
                      type="date"
                      value={conceptionDate}
                      onChange={(e) => setConceptionDate(e.target.value)}
                      required
                    />
                  </div>
                )}

                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="dueDate" id="dueDate" />
                  <Label htmlFor="dueDate">Due Date</Label>
                </div>
                {method === 'dueDate' && (
                  <div className="ml-6 space-y-2">
                    <Label htmlFor="dueDateInput">Your due date</Label>
                    <Input
                      id="dueDateInput"
                      type="date"
                      value={dueDate}
                      onChange={(e) => setDueDate(e.target.value)}
                      required
                    />
                  </div>
                )}
              </div>
            </RadioGroup>

            <Button type="submit" className="w-full">
              <Calendar className="h-4 w-4 mr-2" />
              Start Pregnancy Tracking
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}