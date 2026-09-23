import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Button } from './ui/button';
import { PregnancyData } from '../types';
import { calculatePregnancyWeek } from '../utils/cycleCalculations';
import { getPregnancyTip } from '../utils/pregnancyData';
import { Baby, Calendar, Heart, AlertCircle, Settings } from 'lucide-react';

interface PregnancyTrackerProps {
  pregnancy: PregnancyData;
  onEndPregnancy: () => void;
}

export function PregnancyTracker({ pregnancy, onEndPregnancy }: PregnancyTrackerProps) {
  const currentWeek = calculatePregnancyWeek(pregnancy.lastPeriodDate);
  const pregnancyTip = getPregnancyTip(currentWeek);
  const totalWeeks = 40;
  const progressPercentage = (currentWeek / totalWeeks) * 100;
  
  const today = new Date();
  const daysUntilDue = Math.ceil((pregnancy.dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

  const getTrimester = (week: number) => {
    if (week <= 12) return { name: 'First Trimester', color: 'bg-pink-200' };
    if (week <= 26) return { name: 'Second Trimester', color: 'bg-pink-300' };
    return { name: 'Third Trimester', color: 'bg-pink-400' };
  };

  const trimester = getTrimester(currentWeek);

  return (
    <div className="space-y-6">
      {/* Pregnancy Overview */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Baby className="h-5 w-5" />
              Your Pregnancy Journey
            </CardTitle>
            <Button variant="outline" size="sm" onClick={onEndPregnancy}>
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center space-y-2">
            <div className="text-3xl font-bold text-primary">{currentWeek} weeks</div>
            <Badge className={`${trimester.color} text-white`}>
              {trimester.name}
            </Badge>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Pregnancy Progress</span>
              <span>{Math.round(progressPercentage)}%</span>
            </div>
            <Progress value={progressPercentage} className="h-3" />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Week 1</span>
              <span>Week 40</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-pink-50 rounded-lg">
              <Calendar className="h-5 w-5 mx-auto mb-1 text-pink-600" />
              <div className="text-sm font-medium">Due Date</div>
              <div className="text-xs text-muted-foreground">
                {pregnancy.dueDate.toLocaleDateString('en-US', { 
                  month: 'long', 
                  day: 'numeric',
                  year: 'numeric'
                })}
              </div>
            </div>
            <div className="text-center p-3 bg-pink-50 rounded-lg">
              <Heart className="h-5 w-5 mx-auto mb-1 text-pink-600" />
              <div className="text-sm font-medium">Days to Go</div>
              <div className="text-xs text-muted-foreground">
                {daysUntilDue > 0 ? `${daysUntilDue} days` : 'Overdue'}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Weekly Information */}
      {pregnancyTip && (
        <Card>
          <CardHeader>
            <CardTitle>{pregnancyTip.title}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">{pregnancyTip.description}</p>

            <div className="grid gap-4">
              <div className="space-y-2">
                <h4 className="font-medium flex items-center gap-2">
                  <Baby className="h-4 w-4" />
                  Your Baby This Week
                </h4>
                <div className="text-sm space-y-1">
                  <p><strong>Size:</strong> {pregnancyTip.babySize}</p>
                  <p>{pregnancyTip.babyDevelopment}</p>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium flex items-center gap-2">
                  <Heart className="h-4 w-4" />
                  Your Body This Week
                </h4>
                <p className="text-sm">{pregnancyTip.motherChanges}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Milestones */}
      <Card>
        <CardHeader>
          <CardTitle>Pregnancy Milestones</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { week: 4, title: "Heart begins to beat", reached: currentWeek >= 4 },
              { week: 8, title: "All major organs present", reached: currentWeek >= 8 },
              { week: 12, title: "End of first trimester", reached: currentWeek >= 12 },
              { week: 16, title: "Gender can be determined", reached: currentWeek >= 16 },
              { week: 20, title: "Anatomy scan", reached: currentWeek >= 20 },
              { week: 24, title: "Viability milestone", reached: currentWeek >= 24 },
              { week: 28, title: "Third trimester begins", reached: currentWeek >= 28 },
              { week: 32, title: "Rapid brain development", reached: currentWeek >= 32 },
              { week: 36, title: "Baby is considered full-term soon", reached: currentWeek >= 36 },
              { week: 40, title: "Due date!", reached: currentWeek >= 40 }
            ].map((milestone) => (
              <div key={milestone.week} className="flex items-center gap-3 p-3 rounded-lg border">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ${
                  milestone.reached 
                    ? 'bg-pink-500 text-white' 
                    : currentWeek === milestone.week 
                      ? 'bg-pink-200 text-pink-700 border-2 border-pink-400'
                      : 'bg-gray-100 text-gray-500'
                }`}>
                  {milestone.week}
                </div>
                <div className="flex-1">
                  <p className={`text-sm ${milestone.reached ? 'text-foreground' : 'text-muted-foreground'}`}>
                    {milestone.title}
                  </p>
                </div>
                {milestone.reached && (
                  <div className="text-pink-500">✓</div>
                )}
                {currentWeek === milestone.week && (
                  <Badge variant="secondary" className="bg-pink-100 text-pink-700">Current</Badge>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Important Reminders */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            Reminders & Tips
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-700">
                Remember to take your prenatal vitamins daily, especially folic acid.
              </p>
            </div>
            <div className="p-3 bg-green-50 rounded-lg border border-green-200">
              <p className="text-sm text-green-700">
                Stay hydrated and aim for at least 8-10 glasses of water per day.
              </p>
            </div>
            <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
              <p className="text-sm text-yellow-700">
                Schedule regular prenatal appointments with your healthcare provider.
              </p>
            </div>
            {currentWeek >= 20 && (
              <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
                <p className="text-sm text-purple-700">
                  Start planning for your baby registry and nursery setup.
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}