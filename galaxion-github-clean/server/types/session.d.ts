// server/types/session.d.ts
import 'express-session';

declare module 'express-session' {
  interface SessionData {
    user?: {
      id: number;
      username: string;
      displayName?: string;
    };
    authenticated?: boolean;
    loginTime?: string;
    loginMethod?: string;
    lastActivity?: string;
    authError?: string;
  }
}