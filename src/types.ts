export type Moment = 'move' | 'calm' | 'connect' | 'slowdown';

export interface Activity {
  id: string;
  title: string;
  description: string;
  duration: string;
  moment: Moment | 'screen-free';
  isScreenFree: boolean;
  steps: string[];
  materials?: string[];
}

export interface UserState {
  favorites: string[];
  completedCount: number;
  lastActivityDate?: string;
  lastFeedback?: string;
  familyName?: string;
}
