import { PeriodEntry, CycleData } from '../types';

export function calculateAverageCycleLength(periods: PeriodEntry[]): number {
  if (periods.length < 2) return 28; // Default cycle length
  
  const cycles = [];
  for (let i = 1; i < periods.length; i++) {
    const current = new Date(periods[i - 1].startDate); // Most recent period
    const previous = new Date(periods[i].startDate); // Previous period
    const cycle = Math.round((current.getTime() - previous.getTime()) / (1000 * 60 * 60 * 24));
    if (cycle > 21 && cycle < 35) { // Valid cycle range
      cycles.push(cycle);
    }
  }
  
  if (cycles.length === 0) return 28;
  return Math.round(cycles.reduce((sum, cycle) => sum + cycle, 0) / cycles.length);
}

export function calculateAveragePeriodLength(periods: PeriodEntry[]): number {
  const completePeriods = periods.filter(p => p.endDate);
  if (completePeriods.length === 0) return 5; // Default period length
  
  const lengths = completePeriods.map(p => {
    const start = new Date(p.startDate);
    const end = new Date(p.endDate!);
    return Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
  });
  
  return Math.round(lengths.reduce((sum, length) => sum + length, 0) / lengths.length);
}

export function predictNextPeriod(lastPeriod: Date, cycleLength: number): Date {
  const nextPeriod = new Date(lastPeriod);
  nextPeriod.setDate(nextPeriod.getDate() + cycleLength);
  return nextPeriod;
}

export function calculateOvulationDate(lastPeriod: Date, cycleLength: number): Date {
  const ovulation = new Date(lastPeriod);
  ovulation.setDate(ovulation.getDate() + cycleLength - 14);
  return ovulation;
}

export function calculateFertileWindow(ovulationDate: Date): { start: Date; end: Date } {
  const start = new Date(ovulationDate);
  start.setDate(start.getDate() - 5);
  
  const end = new Date(ovulationDate);
  end.setDate(end.getDate() + 1);
  
  return { start, end };
}

export function calculatePregnancyWeek(lastPeriodDate: Date): number {
  const today = new Date();
  const lmp = new Date(lastPeriodDate);
  const diffTime = today.getTime() - lmp.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  return Math.floor(diffDays / 7);
}

export function calculateDueDate(lastPeriodDate: Date): Date {
  const dueDate = new Date(lastPeriodDate);
  dueDate.setDate(dueDate.getDate() + 280); // 40 weeks
  return dueDate;
}

export function isDateInRange(date: Date, start: Date, end: Date): boolean {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  const s = new Date(start);
  s.setHours(0, 0, 0, 0);
  const e = new Date(end);
  e.setHours(0, 0, 0, 0);
  
  return d >= s && d <= e;
}

export function isSameDay(date1: Date, date2: Date): boolean {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  d1.setHours(0, 0, 0, 0);
  d2.setHours(0, 0, 0, 0);
  return d1.getTime() === d2.getTime();
}