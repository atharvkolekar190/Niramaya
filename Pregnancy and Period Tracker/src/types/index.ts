export interface PeriodEntry {
  id: string;
  startDate: Date;
  endDate?: Date;
  flow: 'light' | 'medium' | 'heavy';
  symptoms: string[];
  notes?: string;
}

export interface PregnancyData {
  id: string;
  conceptionDate?: Date;
  lastPeriodDate: Date;
  dueDate: Date;
  currentWeek: number;
  isActive: boolean;
}

export interface CycleData {
  averageLength: number;
  periodLength: number;
  lastCalculated: Date;
}

export interface Reminder {
  id: string;
  type: 'period' | 'ovulation' | 'medication' | 'pregnancy';
  title: string;
  date: Date;
  enabled: boolean;
}

export interface PregnancyTip {
  week: number;
  title: string;
  description: string;
  babySize: string;
  babyDevelopment: string;
  motherChanges: string;
}