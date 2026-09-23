import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Checkbox } from './ui/checkbox';
import { Textarea } from './ui/textarea';
import { PeriodEntry } from '../types';
import { Plus } from 'lucide-react';

interface AddPeriodDialogProps {
  onAddPeriod: (period: Omit<PeriodEntry, 'id'>) => void;
  selectedDate?: Date;
}

const symptoms = [
  'Cramps', 'Bloating', 'Mood swings', 'Headache', 'Fatigue', 
  'Breast tenderness', 'Acne', 'Food cravings', 'Back pain', 'Irritability'
];

export function AddPeriodDialog({ onAddPeriod, selectedDate }: AddPeriodDialogProps) {
  const [open, setOpen] = useState(false);
  const [startDate, setStartDate] = useState(
    selectedDate ? selectedDate.toISOString().split('T')[0] : ''
  );
  const [endDate, setEndDate] = useState('');
  const [flow, setFlow] = useState<'light' | 'medium' | 'heavy'>('medium');
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [notes, setNotes] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!startDate) return;

    onAddPeriod({
      startDate: new Date(startDate),
      endDate: endDate ? new Date(endDate) : undefined,
      flow,
      symptoms: selectedSymptoms,
      notes: notes || undefined
    });

    // Reset form
    setStartDate(selectedDate ? selectedDate.toISOString().split('T')[0] : '');
    setEndDate('');
    setFlow('medium');
    setSelectedSymptoms([]);
    setNotes('');
    setOpen(false);
  };

  const toggleSymptom = (symptom: string) => {
    setSelectedSymptoms(prev => 
      prev.includes(symptom) 
        ? prev.filter(s => s !== symptom)
        : [...prev, symptom]
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Add Period
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add Period Entry</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="startDate">Start Date</Label>
            <Input
              id="startDate"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="endDate">End Date (optional)</Label>
            <Input
              id="endDate"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              min={startDate}
            />
          </div>

          <div className="space-y-2">
            <Label>Flow Intensity</Label>
            <Select value={flow} onValueChange={(value: 'light' | 'medium' | 'heavy') => setFlow(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">Light</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="heavy">Heavy</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Symptoms</Label>
            <div className="grid grid-cols-2 gap-2">
              {symptoms.map((symptom) => (
                <div key={symptom} className="flex items-center space-x-2">
                  <Checkbox
                    id={symptom}
                    checked={selectedSymptoms.includes(symptom)}
                    onCheckedChange={() => toggleSymptom(symptom)}
                  />
                  <Label htmlFor={symptom} className="text-sm">
                    {symptom}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes (optional)</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any additional notes..."
              rows={3}
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Add Period</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}