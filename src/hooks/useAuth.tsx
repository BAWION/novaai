// Re-export useAuth from context/auth-context.tsx for backward compatibility
export { useAuth } from '../context/auth-context';

// Also export types if they exist in the auth context
export type { User } from '../context/auth-context';