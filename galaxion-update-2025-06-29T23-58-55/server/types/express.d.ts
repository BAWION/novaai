import { User } from '@shared/schema';

declare global {
  namespace Express {
    interface User extends User {} // Использует тип User из нашей схемы
    
    interface Request {
      isAuthenticated(): boolean;
      user?: User;
      login(user: User, callback: (err: any) => void): void;
      logout(callback: (err: any) => void): void;
      session: any;
    }
  }
}