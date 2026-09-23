import { useState } from 'react';
import { Button } from './ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from './ui/utils';

interface SimpleCalendarProps {
  selected?: Date;
  onSelect?: (date: Date | undefined) => void;
  className?: string;
  components?: {
    DayContent?: ({ date }: { date: Date }) => React.ReactNode;
  };
}

const DAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export function SimpleCalendar({ selected, onSelect, className, components }: SimpleCalendarProps) {
  const [currentDate, setCurrentDate] = useState(selected || new Date());
  
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  
  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);
  const startDate = new Date(firstDayOfMonth);
  startDate.setDate(startDate.getDate() - firstDayOfMonth.getDay());
  
  const days = [];
  const current = new Date(startDate);
  
  for (let i = 0; i < 42; i++) {
    days.push(new Date(current));
    current.setDate(current.getDate() + 1);
  }
  
  const goToPreviousMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };
  
  const goToNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };
  
  const handleDateClick = (date: Date) => {
    onSelect?.(date);
  };
  
  const isSelected = (date: Date) => {
    if (!selected) return false;
    return date.toDateString() === selected.toDateString();
  };
  
  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };
  
  const isCurrentMonth = (date: Date) => {
    return date.getMonth() === month;
  };

  return (
    <div className={cn("p-3 bg-card rounded-md border", className)}>
      {/* Header */}
      <div className="flex justify-center items-center mb-4 relative">
        <Button
          variant="outline"
          size="sm"
          onClick={goToPreviousMonth}
          className="absolute left-0 h-7 w-7 p-0"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        
        <h3 className="font-medium">
          {MONTHS[month]} {year}
        </h3>
        
        <Button
          variant="outline"
          size="sm"
          onClick={goToNextMonth}
          className="absolute right-0 h-7 w-7 p-0"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
      
      {/* Days of week header */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {DAYS.map((day) => (
          <div key={day} className="h-8 flex items-center justify-center text-sm text-muted-foreground">
            {day}
          </div>
        ))}
      </div>
      
      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1">
        {days.map((date, index) => (
          <div key={index} className="relative">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleDateClick(date)}
              className={cn(
                "h-8 w-8 p-0 font-normal relative",
                isSelected(date) && "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground",
                isToday(date) && !isSelected(date) && "bg-accent text-accent-foreground",
                !isCurrentMonth(date) && "text-muted-foreground opacity-50"
              )}
            >
              <span className="relative z-10">{date.getDate()}</span>
              {components?.DayContent && (
                <div className="absolute inset-0">
                  {components.DayContent({ date })}
                </div>
              )}
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}