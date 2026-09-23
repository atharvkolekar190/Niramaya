import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';
import { Activity, Heart, TrendingUp, Calendar, Users, MapPin, Brain, Zap, Target, Award } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Progress } from './ui/progress';
import { motion } from 'motion/react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface HealthAnalyticsProps {
  userRole: string | null;
  isOnline: boolean;
  emergencyMode: boolean;
}

export function HealthAnalytics({ userRole, isOnline, emergencyMode }: HealthAnalyticsProps) {
  const [selectedTimeframe, setSelectedTimeframe] = useState('7d');
  const [selectedMetric, setSelectedMetric] = useState('overview');

  const healthMetrics = [
    { name: 'Heart Rate', value: 72, unit: 'bpm', trend: '+2', status: 'healthy', color: 'text-green-600' },
    { name: 'Blood Pressure', value: '120/80', unit: 'mmHg', trend: 'stable', status: 'healthy', color: 'text-green-600' },
    { name: 'Steps Today', value: 8450, unit: 'steps', trend: '+15%', status: 'good', color: 'text-blue-600' },
    { name: 'Sleep Quality', value: 85, unit: '%', trend: '+8%', status: 'excellent', color: 'text-purple-600' },
    { name: 'Stress Level', value: 32, unit: '%', trend: '-5%', status: 'low', color: 'text-yellow-600' },
    { name: 'Hydration', value: 78, unit: '%', trend: '+12%', status: 'good', color: 'text-cyan-600' }
  ];

  const weeklyData = [
    { day: 'Mon', steps: 7200, heartRate: 68, sleep: 7.5, stress: 25 },
    { day: 'Tue', steps: 8100, heartRate: 70, sleep: 8.2, stress: 20 },
    { day: 'Wed', steps: 6800, heartRate: 74, sleep: 6.8, stress: 35 },
    { day: 'Thu', steps: 9200, heartRate: 72, sleep: 8.0, stress: 18 },
    { day: 'Fri', steps: 8450, heartRate: 69, sleep: 7.8, stress: 22 },
    { day: 'Sat', steps: 10500, heartRate: 71, sleep: 9.2, stress: 15 },
    { day: 'Sun', steps: 5200, heartRate: 67, sleep: 8.5, stress: 12 }
  ];

  const monthlyHealthTrends = [
    { month: 'Jan', overall: 78, physical: 82, mental: 74, social: 76 },
    { month: 'Feb', overall: 81, physical: 85, mental: 77, social: 79 },
    { month: 'Mar', overall: 85, physical: 88, mental: 82, social: 85 },
    { month: 'Apr', overall: 87, physical: 90, mental: 84, social: 87 },
    { month: 'May', overall: 89, physical: 92, mental: 86, social: 89 },
    { month: 'Jun', overall: 91, physical: 94, mental: 88, social: 91 }
  ];

  const healthScoreBreakdown = [
    { name: 'Physical Health', value: 92, color: '#8884d8' },
    { name: 'Mental Wellness', value: 88, color: '#82ca9d' },
    { name: 'Social Health', value: 85, color: '#ffc658' },
    { name: 'Preventive Care', value: 78, color: '#ff7c7c' }
  ];

  const communityHealthData = [
    { hub: 'Kotagiri Hub', patients: 45, satisfaction: 4.8, efficiency: 92 },
    { hub: 'Hillview Hub', patients: 32, satisfaction: 4.6, efficiency: 88 },
    { hub: 'Main Road Hub', patients: 67, satisfaction: 4.9, efficiency: 95 },
    { hub: 'Riverside Hub', patients: 28, satisfaction: 4.7, efficiency: 85 }
  ];

  const aiInsights = [
    {
      type: 'prediction',
      title: 'Health Trend Prediction',
      content: 'Based on your current patterns, you\'re likely to achieve your wellness goals by next month.',
      confidence: 94,
      icon: Brain,
      color: 'bg-purple-500'
    },
    {
      type: 'recommendation',
      title: 'Activity Optimization',
      content: 'Consider increasing your morning activity by 15 minutes to improve overall energy levels.',
      confidence: 87,
      icon: Target,
      color: 'bg-blue-500'
    },
    {
      type: 'alert',
      title: 'Wellness Alert',
      content: 'Your stress levels have been slightly elevated. Try meditation or breathing exercises.',
      confidence: 91,
      icon: Zap,
      color: 'bg-orange-500'
    }
  ];

  const achievements = [
    { title: '7-Day Activity Streak', icon: Award, color: 'text-yellow-500', earned: true },
    { title: 'Sleep Champion', icon: Activity, color: 'text-blue-500', earned: true },
    { title: 'Hydration Hero', icon: Heart, color: 'text-cyan-500', earned: false },
    { title: 'Wellness Warrior', icon: Target, color: 'text-green-500', earned: true }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            >
              <Activity className="h-8 w-8 text-blue-500" />
            </motion.div>
            Health Analytics
          </h1>
          <p className="text-muted-foreground">
            AI-powered insights and comprehensive health tracking
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Select value={selectedTimeframe} onValueChange={setSelectedTimeframe}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="24h">24 Hours</SelectItem>
              <SelectItem value="7d">7 Days</SelectItem>
              <SelectItem value="30d">30 Days</SelectItem>
              <SelectItem value="90d">90 Days</SelectItem>
              <SelectItem value="1y">1 Year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Calendar className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </motion.div>

      {/* Health Score Overview */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <Card className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950 border-blue-200 dark:border-blue-800">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl">Your Health Score</CardTitle>
                <CardDescription>AI-calculated wellness index based on multiple factors</CardDescription>
              </div>
              <div className="text-right">
                <div className="text-4xl font-bold text-blue-600">91</div>
                <div className="text-sm text-muted-foreground">Excellent Health</div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {healthScoreBreakdown.map((category, index) => (
                <motion.div
                  key={category.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className="relative w-16 h-16 mx-auto mb-2">
                    <svg className="w-16 h-16 transform -rotate-90">
                      <circle
                        cx="32"
                        cy="32"
                        r="28"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="transparent"
                        className="text-muted-foreground/20"
                      />
                      <motion.circle
                        cx="32"
                        cy="32"
                        r="28"
                        stroke={category.color}
                        strokeWidth="4"
                        fill="transparent"
                        strokeLinecap="round"
                        initial={{ strokeDasharray: 0, strokeDashoffset: 0 }}
                        animate={{ 
                          strokeDasharray: `${(category.value / 100) * 175.9} 175.9`,
                          strokeDashoffset: 0 
                        }}
                        transition={{ duration: 1, delay: index * 0.2 }}
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-sm font-semibold">{category.value}</span>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">{category.name}</p>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Health Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {healthMetrics.map((metric, index) => {
          const Icon = Activity;
          return (
            <motion.div
              key={metric.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-2 rounded-full bg-muted group-hover:bg-primary/10 transition-colors">
                      <Heart className={`h-5 w-5 ${metric.color} group-hover:scale-110 transition-transform`} />
                    </div>
                    <Badge variant="outline" className={`${metric.color} border-current`}>
                      {metric.trend}
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">{metric.name}</p>
                    <div className="flex items-end gap-2">
                      <span className="text-2xl font-bold">{metric.value}</span>
                      <span className="text-sm text-muted-foreground pb-1">{metric.unit}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-1 flex-1 bg-muted rounded-full overflow-hidden">
                        <motion.div
                          className={`h-full ${metric.color.replace('text-', 'bg-')}`}
                          initial={{ width: 0 }}
                          animate={{ width: `${typeof metric.value === 'number' ? Math.min(metric.value, 100) : 75}%` }}
                          transition={{ duration: 1, delay: index * 0.1 }}
                        />
                      </div>
                      <span className="text-xs text-muted-foreground capitalize">{metric.status}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      <Tabs defaultValue="trends" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="trends">Health Trends</TabsTrigger>
          <TabsTrigger value="community">Community Health</TabsTrigger>
          <TabsTrigger value="insights">AI Insights</TabsTrigger>
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
        </TabsList>

        <TabsContent value="trends" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Weekly Activity Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Weekly Activity Overview</CardTitle>
                <CardDescription>Your daily health metrics for the past week</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={weeklyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Area 
                      type="monotone" 
                      dataKey="steps" 
                      stroke="#8884d8" 
                      fill="#8884d8" 
                      fillOpacity={0.3}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Monthly Health Trends */}
            <Card>
              <CardHeader>
                <CardTitle>Monthly Health Trends</CardTitle>
                <CardDescription>Overall wellness progression over 6 months</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={monthlyHealthTrends}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="overall" stroke="#8884d8" strokeWidth={2} />
                    <Line type="monotone" dataKey="physical" stroke="#82ca9d" strokeWidth={2} />
                    <Line type="monotone" dataKey="mental" stroke="#ffc658" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Health Score Breakdown Pie Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Health Score Breakdown</CardTitle>
              <CardDescription>Detailed analysis of your wellness components</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={healthScoreBreakdown}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}%`}
                    >
                      {healthScoreBreakdown.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                
                <div className="space-y-4">
                  {healthScoreBreakdown.map((category, index) => (
                    <div key={category.name} className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">{category.name}</span>
                        <span className="text-sm font-medium">{category.value}%</span>
                      </div>
                      <Progress value={category.value} className="h-2" />
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="community" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Community Health Dashboard</CardTitle>
              <CardDescription>Health hub performance and community wellness metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                <div className="text-center p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
                  <Users className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-blue-600">172</div>
                  <div className="text-sm text-muted-foreground">Active Patients</div>
                </div>
                <div className="text-center p-4 bg-green-50 dark:bg-green-950 rounded-lg">
                  <MapPin className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-green-600">4</div>
                  <div className="text-sm text-muted-foreground">Health Hubs</div>
                </div>
                <div className="text-center p-4 bg-purple-50 dark:bg-purple-950 rounded-lg">
                  <Activity className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-purple-600">4.7</div>
                  <div className="text-sm text-muted-foreground">Avg. Rating</div>
                </div>
                <div className="text-center p-4 bg-orange-50 dark:bg-orange-950 rounded-lg">
                  <TrendingUp className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-orange-600">90%</div>
                  <div className="text-sm text-muted-foreground">Efficiency</div>
                </div>
              </div>

              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={communityHealthData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="hub" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="patients" fill="#8884d8" />
                  <Bar dataKey="efficiency" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="insights" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-6">
              {aiInsights.map((insight, index) => {
                const Icon = insight.icon;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.2 }}
                  >
                    <Card className="hover:-translate-y-1 transition-transform cursor-pointer">
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          <div className={`p-3 rounded-full ${insight.color} text-white`}>
                            <Icon className="h-6 w-6" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-semibold">{insight.title}</h4>
                              <Badge variant="outline">{insight.confidence}% Confidence</Badge>
                            </div>
                            <p className="text-muted-foreground">{insight.content}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>

            <Card>
              <CardHeader>
                <CardTitle>AI Health Analysis</CardTitle>
                <CardDescription>Comprehensive wellness assessment</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="relative h-48 mb-4">
                  <ImageWithFallback
                    src="https://images.unsplash.com/photo-1698306642516-9841228dcff3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoZWFsdGglMjBtb25pdG9yaW5nJTIwZGFzaGJvYXJkJTIwY2hhcnRzfGVufDF8fHx8MTc1ODgwNTI0N3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                    alt="Health monitoring dashboard"
                    className="w-full h-full object-cover rounded-lg"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent rounded-lg" />
                  <div className="absolute bottom-4 left-4 text-white">
                    <h4 className="font-semibold">Advanced Analytics</h4>
                    <p className="text-sm opacity-90">AI-powered health insights</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Data Accuracy</span>
                    <span className="font-medium">97.3%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Prediction Reliability</span>
                    <span className="font-medium">94.1%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Personalization Score</span>
                    <span className="font-medium">89.7%</span>
                  </div>
                  <Button className="w-full mt-4">
                    <Brain className="h-4 w-4 mr-2" />
                    Get Detailed Analysis
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="achievements" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {achievements.map((achievement, index) => {
              const Icon = achievement.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                >
                  <Card className={`text-center cursor-pointer transition-all ${
                    achievement.earned 
                      ? 'bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-950 dark:to-orange-950 border-yellow-200 dark:border-yellow-800' 
                      : 'opacity-60 grayscale'
                  }`}>
                    <CardContent className="p-6">
                      <div className="flex justify-center mb-4">
                        <div className={`p-4 rounded-full ${
                          achievement.earned ? 'bg-yellow-100 dark:bg-yellow-900' : 'bg-muted'
                        }`}>
                          <Icon className={`h-8 w-8 ${achievement.earned ? achievement.color : 'text-muted-foreground'}`} />
                        </div>
                      </div>
                      <h4 className="font-semibold mb-2">{achievement.title}</h4>
                      {achievement.earned ? (
                        <Badge variant="default" className="bg-yellow-500">
                          Earned!
                        </Badge>
                      ) : (
                        <Badge variant="outline">
                          In Progress
                        </Badge>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Your Wellness Journey</CardTitle>
              <CardDescription>Track your progress and celebrate milestones</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <span>Overall Progress</span>
                  <span className="font-semibold">75%</span>
                </div>
                <Progress value={75} className="h-3" />
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                  <div className="text-center p-4 bg-green-50 dark:bg-green-950 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">12</div>
                    <div className="text-sm text-muted-foreground">Achievements Earned</div>
                  </div>
                  <div className="text-center p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">4</div>
                    <div className="text-sm text-muted-foreground">Goals Completed</div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 dark:bg-purple-950 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">28</div>
                    <div className="text-sm text-muted-foreground">Day Streak</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}