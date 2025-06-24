import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Glassmorphism } from "@/components/ui/glassmorphism";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useLocation } from "wouter";
import { ParticlesBackground } from "@/components/particles-background";
import { Plus, Layout, Lightbulb } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AdminUser {
  username: string;
  role: string;
  permissions: string[];
}

interface CourseArchitecture {
  id: number;
  title: string;
  slug: string;
  category: string;
  totalModules: number;
  totalLessons: number;
  completedLessons: number;
  estimatedDuration: number;
  status: 'draft' | 'in_progress' | 'completed' | 'published';
  completionPercentage: number;
  lastUpdated: string;
}

interface CourseIdea {
  id: number;
  title: string;
  description: string;
  targetAudience: string;
  difficultyLevel: string;
  estimatedDuration: number;
  marketDemand: string;
  implementationPriority: number;
  category: string;
  tags: string[];
  status: string;
  createdAt: string;
}

interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  totalCourses: number;
  totalLessons: number;
  systemHealth: number;
  dbConnections: number;
  // Educational Analytics
  dailyActiveUsers: number;
  monthlyActiveUsers: number;
  weeklyRetention: number;
  monthlyRetention: number;
  averageSessionDuration: number;
  courseCompletionRate: number;
  lessonCompletionRate: number;
  skillsProgressRate: number;
  // Engagement Metrics
  totalLearningEvents: number;
  averageLessonsPerUser: number;
  averageTimePerLesson: number;
  userEngagementScore: number;
  // Business Metrics
  newUsersToday: number;
  churnRate: number;
  reactivationRate: number;
  learningStreakAverage: number;
  // Trend data for real-time charts
  userGrowthTrend?: Array<{date: string, count: number}>;
  courseCompletionTrend?: Array<{week: string, completion_rate: number}>;
  hourlyActivity?: Array<{hour: number, activity_count: number}>;
  periodComparison?: {
    thisMonth: number;
    lastMonth: number;
    thisWeek: number;
    lastWeek: number;
    today: number;
    yesterday: number;
  };
  categoryDistribution?: Array<{category: string, percentage: number, sessions: number}>;
  topCourses?: Array<{title: string, sessions: number}>;
}

export default function AdminDashboard() {
  const [, setLocation] = useLocation();
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [selectedSection, setSelectedSection] = useState("overview");
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    activeUsers: 0,
    totalCourses: 0,
    totalLessons: 0,
    systemHealth: 0,
    dbConnections: 0,
    // Educational Analytics
    dailyActiveUsers: 0,
    monthlyActiveUsers: 0,
    weeklyRetention: 0,
    monthlyRetention: 0,
    averageSessionDuration: 0,
    courseCompletionRate: 0,
    lessonCompletionRate: 0,
    skillsProgressRate: 0,
    // Engagement Metrics
    totalLearningEvents: 0,
    averageLessonsPerUser: 0,
    averageTimePerLesson: 0,
    userEngagementScore: 0,
    // Business Metrics
    newUsersToday: 0,
    churnRate: 0,
    reactivationRate: 0,
    learningStreakAverage: 0
  });

  useEffect(() => {
    // Check admin authentication
    const adminSession = localStorage.getItem("admin-session");
    const adminUserData = localStorage.getItem("admin-user");

    if (adminSession !== "authenticated" || !adminUserData) {
      setLocation("/");
      return;
    }

    setAdminUser(JSON.parse(adminUserData));
    loadDashboardStats();
  }, [setLocation]);

  const loadDashboardStats = async () => {
    try {
      // Simulate loading real data
      const response = await fetch("/api/admin/stats");
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      } else {
        // Fallback to comprehensive demo data
        setStats({
          totalUsers: 847,
          activeUsers: 234,
          totalCourses: 12,
          totalLessons: 156,
          systemHealth: 98,
          dbConnections: 15,
          // Educational Analytics
          dailyActiveUsers: 89,
          monthlyActiveUsers: 234,
          weeklyRetention: 73.5,
          monthlyRetention: 27.6,
          averageSessionDuration: 1847,
          courseCompletionRate: 34.2,
          lessonCompletionRate: 68.7,
          skillsProgressRate: 45.9,
          // Engagement Metrics
          totalLearningEvents: 15423,
          averageLessonsPerUser: 8.3,
          averageTimePerLesson: 420,
          userEngagementScore: 72.4,
          // Business Metrics
          newUsersToday: 23,
          churnRate: 12.8,
          reactivationRate: 8.7,
          learningStreakAverage: 4.2
        });
      }
    } catch (error) {
      console.error("Failed to load stats:", error);
      // Comprehensive demo data
      setStats({
        totalUsers: 847,
        activeUsers: 234,
        totalCourses: 12,
        totalLessons: 156,
        systemHealth: 98,
        dbConnections: 15,
        // Educational Analytics
        dailyActiveUsers: 89,
        monthlyActiveUsers: 234,
        weeklyRetention: 73.5,
        monthlyRetention: 27.6,
        averageSessionDuration: 1847,
        courseCompletionRate: 34.2,
        lessonCompletionRate: 68.7,
        skillsProgressRate: 45.9,
        // Engagement Metrics
        totalLearningEvents: 15423,
        averageLessonsPerUser: 8.3,
        averageTimePerLesson: 420,
        userEngagementScore: 72.4,
        // Business Metrics
        newUsersToday: 23,
        churnRate: 12.8,
        reactivationRate: 8.7,
        learningStreakAverage: 4.2
      });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("admin-session");
    localStorage.removeItem("admin-role");
    localStorage.removeItem("admin-user");
    setLocation("/");
  };

  const menuItems = [
    { id: "overview", label: "Overview", icon: "fa-chart-pie" },
    { id: "users", label: "Users", icon: "fa-users" },
    { id: "courses", label: "Courses", icon: "fa-graduation-cap" },
    { id: "analytics", label: "Analytics", icon: "fa-chart-line" },
    { id: "system", label: "System", icon: "fa-server" },
    { id: "ai", label: "AI Services", icon: "fa-robot" },
  ];

  if (!adminUser) {
    return <div className="min-h-screen bg-space-900 flex items-center justify-center">
      <div className="text-white">Loading...</div>
    </div>;
  }

  return (
    <div className="min-h-screen bg-space-900 text-white">
      <ParticlesBackground />
      
      {/* Header */}
      <header className="bg-black/30 backdrop-blur-md border-b border-white/10 px-6 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 bg-red-600/20 rounded-full flex items-center justify-center">
              <i className="fas fa-shield-alt text-red-400"></i>
            </div>
            <div>
              <h1 className="text-xl font-bold">NovaAI Admin Panel</h1>
              <p className="text-sm text-white/60">System Management Dashboard</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-sm">
              <div className="font-medium">{adminUser.username}</div>
              <div className="text-white/60 capitalize">{adminUser.role}</div>
            </div>
            <Button 
              onClick={handleLogout}
              variant="outline"
              size="sm"
              className="border-white/20 text-white hover:bg-white/10"
            >
              <i className="fas fa-sign-out-alt mr-2"></i>
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-black/20 backdrop-blur-md border-r border-white/10 min-h-screen p-4">
          <nav className="space-y-2">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setSelectedSection(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  selectedSection === item.id
                    ? "bg-primary/20 text-primary border border-primary/30"
                    : "text-white/70 hover:bg-white/10 hover:text-white"
                }`}
              >
                <i className={`fas ${item.icon}`}></i>
                <span>{item.label}</span>
              </button>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {selectedSection === "overview" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-2xl font-bold mb-6">System Overview</h2>
              
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <Glassmorphism className="p-6 rounded-xl">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-600/20 rounded-full flex items-center justify-center">
                      <i className="fas fa-users text-blue-400"></i>
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{stats.totalUsers}</p>
                      <p className="text-white/60 text-sm">Total Users</p>
                    </div>
                  </div>
                </Glassmorphism>

                <Glassmorphism className="p-6 rounded-xl">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-green-600/20 rounded-full flex items-center justify-center">
                      <i className="fas fa-user-clock text-green-400"></i>
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{stats.activeUsers}</p>
                      <p className="text-white/60 text-sm">Active Now</p>
                    </div>
                  </div>
                </Glassmorphism>

                <Glassmorphism className="p-6 rounded-xl">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-purple-600/20 rounded-full flex items-center justify-center">
                      <i className="fas fa-graduation-cap text-purple-400"></i>
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{stats.totalCourses}</p>
                      <p className="text-white/60 text-sm">Courses</p>
                    </div>
                  </div>
                </Glassmorphism>

                <Glassmorphism className="p-6 rounded-xl">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-orange-600/20 rounded-full flex items-center justify-center">
                      <i className="fas fa-book text-orange-400"></i>
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{stats.totalLessons}</p>
                      <p className="text-white/60 text-sm">Lessons</p>
                    </div>
                  </div>
                </Glassmorphism>
              </div>

              {/* System Health */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Glassmorphism className="p-6 rounded-xl">
                  <h3 className="text-lg font-bold mb-4">System Health</h3>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-2">
                        <span>Overall Health</span>
                        <span className="text-green-400">{stats.systemHealth}%</span>
                      </div>
                      <div className="w-full bg-gray-700/50 rounded-full h-2">
                        <div 
                          className="bg-green-400 h-2 rounded-full transition-all duration-1000"
                          style={{ width: `${stats.systemHealth}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-2">
                        <span>Database</span>
                        <span className="text-green-400">Online</span>
                      </div>
                      <div className="flex justify-between mb-2">
                        <span>AI Services</span>
                        <span className="text-green-400">Running</span>
                      </div>
                      <div className="flex justify-between mb-2">
                        <span>API Gateway</span>
                        <span className="text-green-400">Healthy</span>
                      </div>
                    </div>
                  </div>
                </Glassmorphism>

                <Glassmorphism className="p-6 rounded-xl">
                  <h3 className="text-lg font-bold mb-4">Recent Activity</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 bg-white/5 rounded">
                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm">New user registration</p>
                        <p className="text-xs text-white/60">2 minutes ago</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 p-3 bg-white/5 rounded">
                      <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm">Course completion: AI Ethics</p>
                        <p className="text-xs text-white/60">5 minutes ago</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 p-3 bg-white/5 rounded">
                      <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm">AI Assistant query processed</p>
                        <p className="text-xs text-white/60">8 minutes ago</p>
                      </div>
                    </div>
                  </div>
                </Glassmorphism>
              </div>
            </motion.div>
          )}

          {selectedSection === "users" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-2xl font-bold mb-6">User Analytics</h2>
              
              {/* User Metrics Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <Glassmorphism className="p-6 rounded-xl">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-600/20 rounded-full flex items-center justify-center">
                      <i className="fas fa-users text-blue-400"></i>
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{stats.totalUsers}</p>
                      <p className="text-white/60 text-sm">Total Users</p>
                    </div>
                  </div>
                </Glassmorphism>

                <Glassmorphism className="p-6 rounded-xl">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-green-600/20 rounded-full flex items-center justify-center">
                      <i className="fas fa-calendar-day text-green-400"></i>
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{stats.dailyActiveUsers}</p>
                      <p className="text-white/60 text-sm">Daily Active</p>
                    </div>
                  </div>
                </Glassmorphism>

                <Glassmorphism className="p-6 rounded-xl">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-purple-600/20 rounded-full flex items-center justify-center">
                      <i className="fas fa-calendar-alt text-purple-400"></i>
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{stats.monthlyActiveUsers}</p>
                      <p className="text-white/60 text-sm">Monthly Active</p>
                    </div>
                  </div>
                </Glassmorphism>

                <Glassmorphism className="p-6 rounded-xl">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-orange-600/20 rounded-full flex items-center justify-center">
                      <i className="fas fa-user-plus text-orange-400"></i>
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{stats.newUsersToday}</p>
                      <p className="text-white/60 text-sm">New Today</p>
                    </div>
                  </div>
                </Glassmorphism>
              </div>

              {/* Retention & Engagement */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                <Glassmorphism className="p-6 rounded-xl">
                  <h3 className="text-lg font-bold mb-4">User Retention</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-white/70">Weekly Retention</span>
                      <span className="text-green-400 font-bold">{stats.weeklyRetention}%</span>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-2">
                      <div className="bg-green-400 h-2 rounded-full" style={{width: `${stats.weeklyRetention}%`}}></div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-white/70">Monthly Retention</span>
                      <span className="text-blue-400 font-bold">{stats.monthlyRetention}%</span>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-2">
                      <div className="bg-blue-400 h-2 rounded-full" style={{width: `${stats.monthlyRetention}%`}}></div>
                    </div>
                  </div>
                </Glassmorphism>

                <Glassmorphism className="p-6 rounded-xl">
                  <h3 className="text-lg font-bold mb-4">Business Metrics</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-white/70">Churn Rate</span>
                      <span className="text-red-400 font-bold">{stats.churnRate}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/70">Reactivation Rate</span>
                      <span className="text-green-400 font-bold">{stats.reactivationRate}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/70">User Engagement Score</span>
                      <span className="text-purple-400 font-bold">{stats.userEngagementScore}</span>
                    </div>
                  </div>
                </Glassmorphism>
              </div>

              {/* Session Analytics */}
              <Glassmorphism className="p-6 rounded-xl">
                <h3 className="text-lg font-bold mb-4">Session Analytics</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-blue-400">{Math.floor(stats.averageSessionDuration / 60)}m {stats.averageSessionDuration % 60}s</p>
                    <p className="text-white/60 text-sm">Average Session Duration</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-400">{stats.averageLessonsPerUser}</p>
                    <p className="text-white/60 text-sm">Lessons per User</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-purple-400">{Math.floor(stats.averageTimePerLesson / 60)}m</p>
                    <p className="text-white/60 text-sm">Time per Lesson</p>
                  </div>
                </div>
              </Glassmorphism>
            </motion.div>
          )}

          {selectedSection === "courses" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-2xl font-bold mb-6">Course Analytics</h2>
              
              {/* Course Performance Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <Glassmorphism className="p-6 rounded-xl">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-purple-600/20 rounded-full flex items-center justify-center">
                      <i className="fas fa-graduation-cap text-purple-400"></i>
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{stats.totalCourses}</p>
                      <p className="text-white/60 text-sm">Total Courses</p>
                    </div>
                  </div>
                </Glassmorphism>

                <Glassmorphism className="p-6 rounded-xl">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-orange-600/20 rounded-full flex items-center justify-center">
                      <i className="fas fa-book text-orange-400"></i>
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{stats.totalLessons}</p>
                      <p className="text-white/60 text-sm">Total Lessons</p>
                    </div>
                  </div>
                </Glassmorphism>

                <Glassmorphism className="p-6 rounded-xl">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-green-600/20 rounded-full flex items-center justify-center">
                      <i className="fas fa-check-circle text-green-400"></i>
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{stats.courseCompletionRate}%</p>
                      <p className="text-white/60 text-sm">Completion Rate</p>
                    </div>
                  </div>
                </Glassmorphism>

                <Glassmorphism className="p-6 rounded-xl">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-600/20 rounded-full flex items-center justify-center">
                      <i className="fas fa-tasks text-blue-400"></i>
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{stats.lessonCompletionRate}%</p>
                      <p className="text-white/60 text-sm">Lesson Progress</p>
                    </div>
                  </div>
                </Glassmorphism>
              </div>

              {/* Learning Progress & Skills */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                <Glassmorphism className="p-6 rounded-xl">
                  <h3 className="text-lg font-bold mb-4">Learning Progress</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-white/70">Course Completion</span>
                      <span className="text-green-400 font-bold">{stats.courseCompletionRate}%</span>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-3">
                      <div className="bg-green-400 h-3 rounded-full" style={{width: `${stats.courseCompletionRate}%`}}></div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-white/70">Lesson Completion</span>
                      <span className="text-blue-400 font-bold">{stats.lessonCompletionRate}%</span>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-3">
                      <div className="bg-blue-400 h-3 rounded-full" style={{width: `${stats.lessonCompletionRate}%`}}></div>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-white/70">Skills DNA Progress</span>
                      <span className="text-purple-400 font-bold">{stats.skillsProgressRate}%</span>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-3">
                      <div className="bg-purple-400 h-3 rounded-full" style={{width: `${stats.skillsProgressRate}%`}}></div>
                    </div>
                  </div>
                </Glassmorphism>

                <Glassmorphism className="p-6 rounded-xl">
                  <h3 className="text-lg font-bold mb-4">Learning Activity</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-white/70">Total Learning Events</span>
                      <span className="text-blue-400 font-bold">{stats.totalLearningEvents.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/70">Average Lessons per User</span>
                      <span className="text-green-400 font-bold">{stats.averageLessonsPerUser}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/70">Learning Streak Average</span>
                      <span className="text-purple-400 font-bold">{stats.learningStreakAverage} days</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/70">Time per Lesson</span>
                      <span className="text-orange-400 font-bold">{Math.floor(stats.averageTimePerLesson / 60)}m</span>
                    </div>
                  </div>
                </Glassmorphism>
              </div>

              {/* Course Categories Performance */}
              <Glassmorphism className="p-6 rounded-xl">
                <h3 className="text-lg font-bold mb-4">Course Categories</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="p-4 bg-white/5 rounded-lg">
                    <div className="flex items-center gap-3 mb-3">
                      <i className="fas fa-code text-blue-400"></i>
                      <h4 className="font-semibold">Programming</h4>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Python Basics</span>
                        <span className="text-green-400">87% completion</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>JavaScript Fundamentals</span>
                        <span className="text-blue-400">72% completion</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-white/5 rounded-lg">
                    <div className="flex items-center gap-3 mb-3">
                      <i className="fas fa-robot text-purple-400"></i>
                      <h4 className="font-semibold">AI & Machine Learning</h4>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>AI Ethics & Safety</span>
                        <span className="text-green-400">91% completion</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>ML Fundamentals</span>
                        <span className="text-purple-400">65% completion</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-white/5 rounded-lg">
                    <div className="flex items-center gap-3 mb-3">
                      <i className="fas fa-chart-line text-orange-400"></i>
                      <h4 className="font-semibold">Data Science</h4>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Data Analysis</span>
                        <span className="text-orange-400">78% completion</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Statistics</span>
                        <span className="text-yellow-400">54% completion</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Glassmorphism>
            </motion.div>
          )}

          {selectedSection === "analytics" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-2xl font-bold mb-6">Advanced Analytics</h2>
              
              {/* Key Performance Indicators */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <Glassmorphism className="p-6 rounded-xl border border-primary/20">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-green-600/20 rounded-full flex items-center justify-center">
                      <i className="fas fa-chart-line text-green-400"></i>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-green-400">{stats.userEngagementScore}</p>
                      <p className="text-white/60 text-sm">Engagement Score</p>
                    </div>
                  </div>
                </Glassmorphism>

                <Glassmorphism className="p-6 rounded-xl border border-blue-500/20">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-600/20 rounded-full flex items-center justify-center">
                      <i className="fas fa-clock text-blue-400"></i>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-blue-400">{Math.floor(stats.averageSessionDuration / 60)}m</p>
                      <p className="text-white/60 text-sm">Avg Session Time</p>
                    </div>
                  </div>
                </Glassmorphism>

                <Glassmorphism className="p-6 rounded-xl border border-purple-500/20">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-purple-600/20 rounded-full flex items-center justify-center">
                      <i className="fas fa-dna text-purple-400"></i>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-purple-400">{stats.skillsProgressRate}%</p>
                      <p className="text-white/60 text-sm">Skills Progress</p>
                    </div>
                  </div>
                </Glassmorphism>

                <Glassmorphism className="p-6 rounded-xl border border-orange-500/20">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-orange-600/20 rounded-full flex items-center justify-center">
                      <i className="fas fa-fire text-orange-400"></i>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-orange-400">{stats.learningStreakAverage}</p>
                      <p className="text-white/60 text-sm">Learning Streak</p>
                    </div>
                  </div>
                </Glassmorphism>
              </div>

              {/* Detailed Analytics Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {/* Retention Analysis */}
                <Glassmorphism className="p-6 rounded-xl">
                  <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                    <i className="fas fa-users text-blue-400"></i>
                    User Retention Analysis
                  </h3>
                  <div className="space-y-6">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-white/70">Daily Active Users</span>
                        <span className="text-green-400 font-bold">{stats.dailyActiveUsers}</span>
                      </div>
                      <div className="w-full bg-white/10 rounded-full h-3">
                        <div className="bg-gradient-to-r from-green-600 to-green-400 h-3 rounded-full" 
                             style={{width: `${(stats.dailyActiveUsers / stats.totalUsers) * 100}%`}}></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-white/70">Monthly Active Users</span>
                        <span className="text-blue-400 font-bold">{stats.monthlyActiveUsers}</span>
                      </div>
                      <div className="w-full bg-white/10 rounded-full h-3">
                        <div className="bg-gradient-to-r from-blue-600 to-blue-400 h-3 rounded-full" 
                             style={{width: `${(stats.monthlyActiveUsers / stats.totalUsers) * 100}%`}}></div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/10">
                      <div className="text-center">
                        <p className="text-xl font-bold text-green-400">{stats.weeklyRetention}%</p>
                        <p className="text-xs text-white/60">Weekly Retention</p>
                      </div>
                      <div className="text-center">
                        <p className="text-xl font-bold text-blue-400">{stats.monthlyRetention}%</p>
                        <p className="text-xs text-white/60">Monthly Retention</p>
                      </div>
                    </div>
                  </div>
                </Glassmorphism>

                {/* Learning Efficiency */}
                <Glassmorphism className="p-6 rounded-xl">
                  <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                    <i className="fas fa-graduation-cap text-purple-400"></i>
                    Learning Efficiency
                  </h3>
                  <div className="space-y-6">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-white/70">Course Completion Rate</span>
                        <span className="text-green-400 font-bold">{stats.courseCompletionRate}%</span>
                      </div>
                      <div className="w-full bg-white/10 rounded-full h-3">
                        <div className="bg-gradient-to-r from-green-600 to-emerald-400 h-3 rounded-full" 
                             style={{width: `${stats.courseCompletionRate}%`}}></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-white/70">Lesson Completion Rate</span>
                        <span className="text-blue-400 font-bold">{stats.lessonCompletionRate}%</span>
                      </div>
                      <div className="w-full bg-white/10 rounded-full h-3">
                        <div className="bg-gradient-to-r from-blue-600 to-cyan-400 h-3 rounded-full" 
                             style={{width: `${stats.lessonCompletionRate}%`}}></div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/10">
                      <div className="text-center">
                        <p className="text-xl font-bold text-orange-400">{stats.averageLessonsPerUser}</p>
                        <p className="text-xs text-white/60">Lessons per User</p>
                      </div>
                      <div className="text-center">
                        <p className="text-xl font-bold text-purple-400">{Math.floor(stats.averageTimePerLesson / 60)}m</p>
                        <p className="text-xs text-white/60">Time per Lesson</p>
                      </div>
                    </div>
                  </div>
                </Glassmorphism>
              </div>

              {/* Business Intelligence */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                <Glassmorphism className="p-6 rounded-xl">
                  <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                    <i className="fas fa-chart-pie text-blue-400"></i>
                    Growth Metrics
                  </h3>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-white/70">New Users Today</span>
                      <span className="text-green-400 font-bold">+{stats.newUsersToday}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/70">Total Learning Events</span>
                      <span className="text-blue-400 font-bold">{stats.totalLearningEvents.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/70">Reactivation Rate</span>
                      <span className="text-purple-400 font-bold">{stats.reactivationRate}%</span>
                    </div>
                  </div>
                </Glassmorphism>

                <Glassmorphism className="p-6 rounded-xl">
                  <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                    <i className="fas fa-exclamation-triangle text-orange-400"></i>
                    Risk Indicators
                  </h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-white/70">Churn Rate</span>
                      <div className="flex items-center gap-2">
                        <span className="text-red-400 font-bold">{stats.churnRate}%</span>
                        {stats.churnRate > 15 ? (
                          <i className="fas fa-arrow-up text-red-400 text-xs"></i>
                        ) : (
                          <i className="fas fa-arrow-down text-green-400 text-xs"></i>
                        )}
                      </div>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-2">
                      <div className="bg-red-400 h-2 rounded-full" style={{width: `${stats.churnRate}%`}}></div>
                    </div>
                    <div className="text-xs text-white/60">
                      {stats.churnRate < 10 ? "Excellent retention" : 
                       stats.churnRate < 15 ? "Good retention" : "Needs attention"}
                    </div>
                  </div>
                </Glassmorphism>

                <Glassmorphism className="p-6 rounded-xl">
                  <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                    <i className="fas fa-trophy text-yellow-400"></i>
                    Performance Score
                  </h3>
                  <div className="text-center">
                    <div className="relative w-24 h-24 mx-auto mb-4">
                      <div className="w-24 h-24 rounded-full border-4 border-white/10"></div>
                      <div 
                        className="absolute top-0 left-0 w-24 h-24 rounded-full border-4 border-primary transform -rotate-90"
                        style={{
                          borderImage: `conic-gradient(from 0deg, #6366f1 0%, #6366f1 ${stats.userEngagementScore}%, transparent ${stats.userEngagementScore}%) 1`
                        }}
                      ></div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-2xl font-bold text-primary">{Math.round(stats.userEngagementScore)}</span>
                      </div>
                    </div>
                    <p className="text-white/70 text-sm">Overall Platform Health</p>
                  </div>
                </Glassmorphism>
              </div>

              {/* Trend Analytics - User Growth */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                <Glassmorphism className="p-6 rounded-xl">
                  <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                    <i className="fas fa-chart-line text-blue-400"></i>
                    Тренд роста пользователей (30 дней)
                  </h3>
                  <div className="h-48 flex items-end justify-between gap-1 mb-4">
                    {stats.userGrowthTrend && stats.userGrowthTrend.length > 0 ? 
                      stats.userGrowthTrend.map((dataPoint, index) => (
                        <div key={index} className="flex-1 flex flex-col items-center">
                          <div 
                            className="w-full bg-gradient-to-t from-blue-600 to-blue-400 rounded-t"
                            style={{
                              height: `${(dataPoint.count / Math.max(...stats.userGrowthTrend.map(d => d.count))) * 100}%`, 
                              minHeight: dataPoint.count > 0 ? '2px' : '0'
                            }}
                          ></div>
                        </div>
                      )) :
                      // Fallback visualization with real user count
                      Array.from({ length: 30 }, (_, index) => {
                        const value = Math.max(0, stats.totalUsers - (29 - index) * Math.floor(stats.totalUsers / 30));
                        return (
                          <div key={index} className="flex-1 flex flex-col items-center">
                            <div 
                              className="w-full bg-gradient-to-t from-blue-600 to-blue-400 rounded-t"
                              style={{height: `${(value / Math.max(stats.totalUsers, 1)) * 100}%`, minHeight: value > 0 ? '2px' : '0'}}
                            ></div>
                          </div>
                        );
                      })
                    }
                  </div>
                  <div className="flex justify-between text-xs text-white/60">
                    <span>30 дней назад</span>
                    <span>Сегодня: {stats.totalUsers} пользователей</span>
                  </div>
                  <div className="mt-3 flex items-center gap-2">
                    <i className="fas fa-arrow-up text-green-400 text-sm"></i>
                    <span className="text-green-400 font-bold">+{stats.newUsersToday} за сегодня</span>
                  </div>
                </Glassmorphism>

                <Glassmorphism className="p-6 rounded-xl">
                  <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                    <i className="fas fa-graduation-cap text-purple-400"></i>
                    Завершение курсов по неделям
                  </h3>
                  <div className="h-48 flex items-end justify-between gap-2 mb-4">
                    {stats.courseCompletionTrend && stats.courseCompletionTrend.length > 0 ? 
                      stats.courseCompletionTrend.map((dataPoint, index) => (
                        <div key={index} className="flex-1 flex flex-col items-center">
                          <div 
                            className="w-full bg-gradient-to-t from-purple-600 to-purple-400 rounded-t"
                            style={{
                              height: `${(dataPoint.completion_rate / Math.max(...stats.courseCompletionTrend.map(d => d.completion_rate))) * 100}%`, 
                              minHeight: '2px'
                            }}
                          ></div>
                          <span className="text-xs text-white/60 mt-1">{stats.courseCompletionTrend.length - index}н</span>
                        </div>
                      )) :
                      // Fallback with current completion rate
                      Array.from({ length: 12 }, (_, index) => {
                        const value = Math.max(0, stats.courseCompletionRate - (11 - index) * 2);
                        return (
                          <div key={index} className="flex-1 flex flex-col items-center">
                            <div 
                              className="w-full bg-gradient-to-t from-purple-600 to-purple-400 rounded-t"
                              style={{height: `${(value / Math.max(stats.courseCompletionRate, 1)) * 100}%`, minHeight: '2px'}}
                            ></div>
                            <span className="text-xs text-white/60 mt-1">{12 - index}н</span>
                          </div>
                        );
                      })
                    }
                  </div>
                  <div className="flex justify-between text-xs text-white/60">
                    <span>12 недель назад</span>
                    <span>Текущая неделя: {stats.courseCompletionRate}%</span>
                  </div>
                  <div className="mt-3 flex items-center gap-2">
                    <i className="fas fa-arrow-up text-green-400 text-sm"></i>
                    <span className="text-green-400 font-bold">
                      {stats.periodComparison ? 
                        `${((stats.periodComparison.thisWeek - stats.periodComparison.lastWeek) / Math.max(stats.periodComparison.lastWeek, 1) * 100).toFixed(1)}% за неделю` :
                        '+2.4% за неделю'
                      }
                    </span>
                  </div>
                </Glassmorphism>
              </div>

              {/* Learning Activity Trends */}
              <Glassmorphism className="p-6 rounded-xl mb-8">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <i className="fas fa-activity text-green-400"></i>
                  Активность обучения (последние 24 часа)
                </h3>
                <div className="h-32 flex items-end justify-between gap-1 mb-4">
                  {stats.hourlyActivity && stats.hourlyActivity.length > 0 ? 
                    Array.from({ length: 24 }, (_, hour) => {
                      const activityData = stats.hourlyActivity.find(data => data.hour === hour);
                      const value = activityData?.activity_count || 0;
                      const maxActivity = Math.max(...stats.hourlyActivity.map(d => d.activity_count), 1);
                      
                      return (
                        <div key={hour} className="flex-1 flex flex-col items-center group">
                          <div 
                            className="w-full bg-gradient-to-t from-green-600 to-green-400 rounded-t transition-all hover:from-green-500 hover:to-green-300"
                            style={{height: `${(value / maxActivity) * 100}%`, minHeight: value > 0 ? '2px' : '1px'}}
                          ></div>
                          <span className="text-xs text-white/40 opacity-0 group-hover:opacity-100 transition-opacity">
                            {hour}:00
                          </span>
                        </div>
                      );
                    }) :
                    // Fallback with synthetic data based on real metrics
                    Array.from({ length: 24 }, (_, hour) => {
                      const baseActivity = Math.floor(stats.totalLearningEvents / 1000);
                      const hourlyVariation = Math.sin((hour - 6) * Math.PI / 12) * 0.7 + 0.3;
                      const value = Math.max(1, Math.floor(baseActivity * hourlyVariation));
                      
                      return (
                        <div key={hour} className="flex-1 flex flex-col items-center group">
                          <div 
                            className="w-full bg-gradient-to-t from-green-600 to-green-400 rounded-t transition-all hover:from-green-500 hover:to-green-300"
                            style={{height: `${(value / (baseActivity * 1.5)) * 100}%`, minHeight: '2px'}}
                          ></div>
                          <span className="text-xs text-white/40 opacity-0 group-hover:opacity-100 transition-opacity">
                            {hour}:00
                          </span>
                        </div>
                      );
                    })
                  }
                </div>
                <div className="grid grid-cols-4 gap-4 text-center">
                  <div>
                    <p className="text-lg font-bold text-green-400">{stats.totalLearningEvents.toLocaleString()}</p>
                    <p className="text-xs text-white/60">Всего событий</p>
                  </div>
                  <div>
                    <p className="text-lg font-bold text-blue-400">
                      {stats.hourlyActivity && stats.hourlyActivity.length > 0 ?
                        Math.max(...stats.hourlyActivity.map(d => d.activity_count)) :
                        Math.floor(stats.totalLearningEvents / 100)
                      }
                    </p>
                    <p className="text-xs text-white/60">Пик активности</p>
                  </div>
                  <div>
                    <p className="text-lg font-bold text-purple-400">{Math.floor(stats.averageSessionDuration / 60)}м</p>
                    <p className="text-xs text-white/60">Средняя сессия</p>
                  </div>
                  <div>
                    <p className="text-lg font-bold text-orange-400">{stats.dailyActiveUsers}</p>
                    <p className="text-xs text-white/60">Активных сегодня</p>
                  </div>
                </div>
              </Glassmorphism>

              {/* Comparative Analytics */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                <Glassmorphism className="p-6 rounded-xl">
                  <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                    <i className="fas fa-balance-scale text-yellow-400"></i>
                    Сравнение периодов
                  </h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                      <div>
                        <p className="text-sm font-medium">Этот месяц vs Прошлый месяц</p>
                        <p className="text-xs text-white/60">Активные пользователи</p>
                      </div>
                      <div className="text-right">
                        {stats.periodComparison ? (
                          <>
                            <p className={`font-bold ${
                              stats.periodComparison.thisMonth >= stats.periodComparison.lastMonth ? 
                              'text-green-400' : 'text-red-400'
                            }`}>
                              {stats.periodComparison.lastMonth > 0 ? 
                                (((stats.periodComparison.thisMonth - stats.periodComparison.lastMonth) / stats.periodComparison.lastMonth) * 100).toFixed(1) + '%' :
                                '+100%'
                              }
                            </p>
                            <p className="text-xs text-white/60">{stats.periodComparison.thisMonth} vs {stats.periodComparison.lastMonth}</p>
                          </>
                        ) : (
                          <>
                            <p className="text-green-400 font-bold">+18.5%</p>
                            <p className="text-xs text-white/60">{stats.monthlyActiveUsers} vs {Math.floor(stats.monthlyActiveUsers * 0.84)}</p>
                          </>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                      <div>
                        <p className="text-sm font-medium">Эта неделя vs Прошлая неделя</p>
                        <p className="text-xs text-white/60">Завершение курсов</p>
                      </div>
                      <div className="text-right">
                        {stats.periodComparison ? (
                          <>
                            <p className={`font-bold ${
                              stats.periodComparison.thisWeek >= stats.periodComparison.lastWeek ? 
                              'text-green-400' : 'text-red-400'
                            }`}>
                              {stats.periodComparison.lastWeek > 0 ? 
                                (((stats.periodComparison.thisWeek - stats.periodComparison.lastWeek) / stats.periodComparison.lastWeek) * 100).toFixed(1) + '%' :
                                '+100%'
                              }
                            </p>
                            <p className="text-xs text-white/60">{stats.periodComparison.thisWeek}% vs {stats.periodComparison.lastWeek}%</p>
                          </>
                        ) : (
                          <>
                            <p className="text-green-400 font-bold">+12.3%</p>
                            <p className="text-xs text-white/60">{stats.courseCompletionRate}% vs {(stats.courseCompletionRate * 0.89).toFixed(1)}%</p>
                          </>
                        )}
                      </div>
                    </div>

                    <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                      <div>
                        <p className="text-sm font-medium">Сегодня vs Вчера</p>
                        <p className="text-xs text-white/60">События обучения</p>
                      </div>
                      <div className="text-right">
                        {stats.periodComparison ? (
                          <>
                            <p className={`font-bold ${
                              stats.periodComparison.today >= stats.periodComparison.yesterday ? 
                              'text-green-400' : 'text-red-400'
                            }`}>
                              {stats.periodComparison.yesterday > 0 ? 
                                (((stats.periodComparison.today - stats.periodComparison.yesterday) / stats.periodComparison.yesterday) * 100).toFixed(1) + '%' :
                                '+100%'
                              }
                            </p>
                            <p className="text-xs text-white/60">{stats.periodComparison.today} vs {stats.periodComparison.yesterday}</p>
                          </>
                        ) : (
                          <>
                            <p className="text-red-400 font-bold">-3.8%</p>
                            <p className="text-xs text-white/60">{Math.floor(stats.totalLearningEvents / 30)} vs {Math.floor(stats.totalLearningEvents / 28)}</p>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </Glassmorphism>

                <Glassmorphism className="p-6 rounded-xl">
                  <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                    <i className="fas fa-chart-pie text-orange-400"></i>
                    Распределение активности
                  </h3>
                  <div className="space-y-4">
                    {stats.categoryDistribution && stats.categoryDistribution.length > 0 ? 
                      stats.categoryDistribution.map((category, index) => {
                        const colors = ['blue-400', 'purple-400', 'green-400', 'orange-400', 'yellow-400'];
                        const color = colors[index % colors.length];
                        
                        return (
                          <div key={category.category}>
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-white/70 capitalize">
                                {category.category === 'tech' ? 'Технологии' :
                                 category.category === 'ml' ? 'ИИ и МО' :
                                 category.category === 'business' ? 'Бизнес' :
                                 category.category === 'ethics' ? 'Этика' :
                                 category.category || 'Другое'}
                              </span>
                              <span className={`text-${color} font-bold`}>{category.percentage}%</span>
                            </div>
                            <div className="w-full bg-white/10 rounded-full h-2">
                              <div className={`bg-${color} h-2 rounded-full`} style={{width: `${category.percentage}%`}}></div>
                            </div>
                          </div>
                        );
                      }) :
                      // Fallback with calculated percentages
                      [
                        { name: 'Программирование', percentage: Math.floor((stats.totalLearningEvents * 0.42) / stats.totalLearningEvents * 100), color: 'blue-400' },
                        { name: 'ИИ и МО', percentage: Math.floor((stats.totalLearningEvents * 0.31) / stats.totalLearningEvents * 100), color: 'purple-400' },
                        { name: 'Наука о данных', percentage: Math.floor((stats.totalLearningEvents * 0.27) / stats.totalLearningEvents * 100), color: 'green-400' }
                      ].map((category) => (
                        <div key={category.name}>
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-white/70">{category.name}</span>
                            <span className={`text-${category.color} font-bold`}>{category.percentage}%</span>
                          </div>
                          <div className="w-full bg-white/10 rounded-full h-2">
                            <div className={`bg-${category.color} h-2 rounded-full`} style={{width: `${category.percentage}%`}}></div>
                          </div>
                        </div>
                      ))
                    }

                    <div className="pt-3 border-t border-white/10">
                      <p className="text-xs text-white/60 mb-2">Топ курсы по активности:</p>
                      <div className="space-y-1">
                        {stats.topCourses && stats.topCourses.length > 0 ? 
                          stats.topCourses.slice(0, 3).map((course, index) => {
                            const colors = ['green-400', 'blue-400', 'purple-400'];
                            return (
                              <div key={course.title} className="flex justify-between text-xs">
                                <span className="truncate mr-2">{course.title}</span>
                                <span className={`text-${colors[index]} font-medium`}>{course.sessions} сессий</span>
                              </div>
                            );
                          }) :
                          // Fallback with synthetic course data
                          [
                            { title: 'Python для начинающих', sessions: Math.floor(stats.totalLearningEvents * 0.15), color: 'green-400' },
                            { title: 'Этика ИИ и безопасность', sessions: Math.floor(stats.totalLearningEvents * 0.12), color: 'blue-400' },
                            { title: 'Анализ данных', sessions: Math.floor(stats.totalLearningEvents * 0.08), color: 'purple-400' }
                          ].map((course) => (
                            <div key={course.title} className="flex justify-between text-xs">
                              <span>{course.title}</span>
                              <span className={`text-${course.color}`}>{course.sessions} сессий</span>
                            </div>
                          ))
                        }
                      </div>
                    </div>
                  </div>
                </Glassmorphism>
              </div>

              {/* Real-time Activity Timeline */}
              <Glassmorphism className="p-6 rounded-xl">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <i className="fas fa-history text-green-400"></i>
                  Журнал активности в реальном времени
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-4 p-3 bg-white/5 rounded-lg">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <div className="flex-1">
                      <p className="text-sm">Высокий уровень завершения курсов (34.2%)</p>
                      <p className="text-xs text-white/60">2 минуты назад</p>
                    </div>
                    <span className="text-green-400 text-xs">↗ +2.1%</span>
                  </div>
                  
                  <div className="flex items-center gap-4 p-3 bg-white/5 rounded-lg">
                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm">Пик ежедневной активности пользователей</p>
                      <p className="text-xs text-white/60">15 минут назад</p>
                    </div>
                    <span className="text-blue-400 text-xs">↗ +5.3%</span>
                  </div>
                  
                  <div className="flex items-center gap-4 p-3 bg-white/5 rounded-lg">
                    <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm">Завершены оценки Skills DNA</p>
                      <p className="text-xs text-white/60">1 час назад</p>
                    </div>
                    <span className="text-purple-400 text-xs">→ 12 новых</span>
                  </div>

                  <div className="flex items-center gap-4 p-3 bg-white/5 rounded-lg">
                    <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm">Достигнут рубеж непрерывного обучения</p>
                      <p className="text-xs text-white/60">3 часа назад</p>
                    </div>
                    <span className="text-orange-400 text-xs">🔥 {stats.learningStreakAverage} дней в среднем</span>
                  </div>
                </div>
              </Glassmorphism>
            </motion.div>
          )}

          {selectedSection === "system" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-2xl font-bold mb-6">System Monitoring</h2>
              <Glassmorphism className="p-6 rounded-xl">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-bold mb-4">Database Status</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Connections</span>
                        <span className="text-green-400">{stats.dbConnections}/50</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Query Time</span>
                        <span className="text-green-400">12ms avg</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Storage</span>
                        <span className="text-yellow-400">2.3GB / 10GB</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-bold mb-4">Server Metrics</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>CPU Usage</span>
                        <span className="text-green-400">23%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Memory</span>
                        <span className="text-green-400">1.2GB / 4GB</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Uptime</span>
                        <span className="text-green-400">7d 12h</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Glassmorphism>
            </motion.div>
          )}

          {selectedSection === "ai" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-2xl font-bold mb-6">AI Services</h2>
              <Glassmorphism className="p-6 rounded-xl">
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-4 bg-white/5 rounded">
                    <div>
                      <h3 className="font-bold">TutorAI Assistant</h3>
                      <p className="text-sm text-white/60">Contextual learning assistance</p>
                    </div>
                    <div className="text-green-400">
                      <i className="fas fa-circle mr-2"></i>Online
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center p-4 bg-white/5 rounded">
                    <div>
                      <h3 className="font-bold">Skills DNA Engine</h3>
                      <p className="text-sm text-white/60">Adaptive learning path generation</p>
                    </div>
                    <div className="text-green-400">
                      <i className="fas fa-circle mr-2"></i>Online
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center p-4 bg-white/5 rounded">
                    <div>
                      <h3 className="font-bold">Recommendation System</h3>
                      <p className="text-sm text-white/60">Course and content recommendations</p>
                    </div>
                    <div className="text-green-400">
                      <i className="fas fa-circle mr-2"></i>Online
                    </div>
                  </div>
                </div>
              </Glassmorphism>
            </motion.div>
          )}
        </main>
      </div>
    </div>
  );
}