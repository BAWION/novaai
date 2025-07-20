import React, { createContext, useState, useContext, useEffect } from "react";
import { apiRequest } from "@/lib/queryClient";
import { 
  CourseTrack,
  UserRole,
  SkillLevel,
  AIExperience,
  UserInterest,
  UserGoal
} from "@/lib/constants";
import { useAuth } from "@/context/auth-context";

interface UserProfileData {
  role: UserRole;
  pythonLevel: SkillLevel;
  experience: AIExperience;
  interest: UserInterest;
  goal: UserGoal;
  recommendedTrack: CourseTrack;
  displayName?: string;
  streakDays: number;
  completedOnboarding: boolean;
  hasCompletedDiagnostics?: boolean; // Флаг, указывающий что пользователь прошел диагностику
  userId?: number;
  metadata?: any; // Добавляем поле metadata для дополнительных данных диагностики
}

interface UserProfileContextType {
  userProfile: UserProfileData | null;
  updateUserProfile: (data: Partial<UserProfileData>) => void;
}

const UserProfileContext = createContext<UserProfileContextType>({
  userProfile: null,
  updateUserProfile: () => {},
});

export function UserProfileProvider({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated } = useAuth();
  const [userProfile, setUserProfile] = useState<UserProfileData | null>(null);

  useEffect(() => {
    // If user is authenticated, fetch their profile
    if (isAuthenticated && user) {
      fetchUserProfile();
    } else {
      setUserProfile(null);
    }
  }, [isAuthenticated, user]);

  const fetchUserProfile = async () => {
    try {
      const url = user?.id ? `/api/profile?userId=${user.id}` : "/api/profile";
      const response = await apiRequest("GET", url);
      
      // Check if profile not found (404) - this is expected for new users
      if (response.status === 404) {
        console.log(`[Profile] Создание базового профиля для нового пользователя ${user?.id}`);
        // Create default profile for new users
        if (user) {
          setUserProfile({
            role: "student",
            pythonLevel: 1,
            experience: "beginner",
            interest: "machine-learning",
            goal: "find-internship",
            recommendedTrack: "zero-to-hero",
            displayName: user.displayName || user.firstName || "Пользователь",
            streakDays: 1, // New user starts with 1 day streak
            completedOnboarding: false,
            userId: user.id
          });
        }
        return;
      }

      const profileData = await response.json();
      setUserProfile(profileData);
    } catch (error: any) {
      // Only log as error if it's not a 404 (profile not found)
      if (error?.response?.status === 404) {
        console.log(`[Profile] Профиль не найден для пользователя ${user?.id}, создаем базовый`);
      } else {
        console.error("Failed to fetch user profile", error);
      }
      
      // Create default profile for new users
      if (user) {
        setUserProfile({
          role: "student",
          pythonLevel: 1,
          experience: "beginner",
          interest: "machine-learning",
          goal: "find-internship",
          recommendedTrack: "zero-to-hero",
          displayName: user.displayName || user.firstName || "Пользователь",
          streakDays: 1, // New user starts with 1 day streak
          completedOnboarding: false,
          userId: user.id
        });
      }
    }
  };

  const updateUserProfile = async (data: Partial<UserProfileData>) => {
    if (!isAuthenticated) {
      console.error("Cannot update profile when not authenticated");
      return;
    }

    try {
      // Update locally first for immediate UI update
      setUserProfile((prevProfile) => {
        if (!prevProfile) {
          return {
            role: data.role || "student",
            pythonLevel: data.pythonLevel || 1,
            experience: data.experience || "beginner",
            interest: data.interest || "machine-learning",
            goal: data.goal || "find-internship",
            recommendedTrack: data.recommendedTrack || "zero-to-hero",
            displayName: user?.displayName || "Анна",
            streakDays: data.streakDays || Math.floor(Math.random() * 7) + 1,
            completedOnboarding: data.completedOnboarding || false,
            userId: user?.id,
            metadata: data.metadata || {}
          };
        }
        return { ...prevProfile, ...data };
      });

      // Then sync with the server with userId for session recovery
      const profileData = { ...data, userId: user?.id };
      await apiRequest("PATCH", "/api/profile", profileData);
    } catch (error) {
      console.error("Failed to update user profile", error);
    }
  };

  return (
    <UserProfileContext.Provider
      value={{
        userProfile,
        updateUserProfile,
      }}
    >
      {children}
    </UserProfileContext.Provider>
  );
}

export function useUserProfile() {
  return useContext(UserProfileContext);
}
