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
      const response = await apiRequest("GET", "/api/profile");
      const profileData = await response.json();
      setUserProfile(profileData);
    } catch (error) {
      console.error("Failed to fetch user profile", error);
      
      // For demo purposes, create a default profile
      if (user) {
        setUserProfile({
          role: "student",
          pythonLevel: 1,
          experience: "beginner",
          interest: "machine-learning",
          goal: "find-internship",
          recommendedTrack: "zero-to-hero",
          displayName: user.displayName || "Анна"
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
            displayName: user?.displayName || "Анна"
          };
        }
        return { ...prevProfile, ...data };
      });

      // Then sync with the server
      await apiRequest("PATCH", "/api/profile", data);
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
