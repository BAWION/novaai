// Export types and re-export useAuth from auth-context for compatibility
export type { User } from "@/context/auth-context";
export { useAuth, AuthProvider } from "@/context/auth-context";