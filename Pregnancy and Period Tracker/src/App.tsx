import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from './components/ui/card';
import { Button } from './components/ui/button';
import { PeriodTracker } from './components/PeriodTracker';
import { PregnancyTracker } from './components/PregnancyTracker';
import { PregnancySetup } from './components/PregnancySetup';
import { useLocalStorage } from './hooks/useLocalStorage';
import { PregnancyData } from './types';
import { Droplets, Baby, Heart, Calendar } from 'lucide-react';

export default function App() {
  const [pregnancy, setPregnancy] = useLocalStorage<PregnancyData | null>('pregnancy', null);
  const [activeTab, setActiveTab] = useState<'period' | 'pregnancy'>('period');

  const handleSetupPregnancy = (pregnancyData: Omit<PregnancyData, 'id'>) => {
    const newPregnancy: PregnancyData = {
      ...pregnancyData,
      id: Date.now().toString()
    };
    setPregnancy(newPregnancy);
    setActiveTab('pregnancy');
  };

  const handleEndPregnancy = () => {
    setPregnancy(null);
    setActiveTab('period');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                <Heart className="h-8 w-8 text-primary" />
                <Droplets className="h-6 w-6 text-primary/70" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-primary">FloraTrack</h1>
                <p className="text-sm text-muted-foreground">Your complete reproductive health companion</p>
              </div>
            </div>
            <div className="hidden md:flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>Track with confidence</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'period' | 'pregnancy')} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto">
            <TabsTrigger value="period" className="flex items-center gap-2">
              <Droplets className="h-4 w-4" />
              Period Tracker
            </TabsTrigger>
            <TabsTrigger value="pregnancy" className="flex items-center gap-2">
              <Baby className="h-4 w-4" />
              Pregnancy
            </TabsTrigger>
          </TabsList>

          <TabsContent value="period" className="space-y-6">
            <div className="text-center space-y-2">
              <h2 className="text-3xl font-bold">Period Tracking</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Monitor your menstrual cycle, predict your next period, and track ovulation with our intelligent calendar system.
              </p>
            </div>
            <PeriodTracker />
          </TabsContent>

          <TabsContent value="pregnancy" className="space-y-6">
            <div className="text-center space-y-2">
              <h2 className="text-3xl font-bold">Pregnancy Journey</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Track your pregnancy week by week with personalized tips, milestone tracking, and important reminders.
              </p>
            </div>
            
            {pregnancy && pregnancy.isActive ? (
              <PregnancyTracker 
                pregnancy={pregnancy} 
                onEndPregnancy={handleEndPregnancy}
              />
            ) : (
              <PregnancySetup onSetupPregnancy={handleSetupPregnancy} />
            )}
          </TabsContent>
        </Tabs>

        {/* Welcome Message for New Users */}
        {activeTab === 'period' && (
          <Card className="mt-8 bg-gradient-to-r from-pink-50 to-rose-50 border-pink-200">
            <CardContent className="p-6 text-center">
              <Heart className="h-12 w-12 text-pink-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-pink-700 mb-2">Welcome to FloraTrack!</h3>
              <p className="text-pink-600 mb-4 max-w-md mx-auto">
                Start by adding your most recent period to begin tracking your cycle and get personalized predictions.
              </p>
              <div className="flex flex-wrap justify-center gap-4 text-sm text-pink-600">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-pink-500 rounded-full"></div>
                  <span>Accurate cycle predictions</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-pink-400 rounded-full"></div>
                  <span>Ovulation tracking</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-pink-300 rounded-full"></div>
                  <span>Symptom monitoring</span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t bg-muted/30 mt-12">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center text-sm text-muted-foreground">
            <p>FloraTrack - Empowering women through better health tracking</p>
            <p className="mt-1">Always consult with healthcare professionals for medical advice</p>
          </div>
        </div>
      </footer>
    </div>
  );
}