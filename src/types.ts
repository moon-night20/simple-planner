export interface IslamicData {
  prayers: Record<string, boolean>; // { "2024-03-20-fajr": true, ... }
  quranPages: Record<string, number>; // { "2024-03-20": 5, ... }
  zikr: Record<string, boolean>; // { "2024-03-20": true, ... }
}

export interface StudySession {
  id: string;
  subject: string;
  duration: number; // minutes
  date: string; // ISO date
}

export interface StudyChapter {
  id: string;
  subjectId: string;
  title: string;
  completed: boolean;
}

export interface StudySubject {
  id: string;
  name: string;
  color: string;
}

export interface EducationData {
  subjects: StudySubject[];
  chapters: StudyChapter[];
  sessions: StudySession[];
}

export interface HealthMetric {
  water: number; // liters or glasses
  sleep: number; // hours
  exercise: boolean;
  selfCare: boolean;
}

export interface Meal {
  type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  content: string;
  healthy: boolean;
}

export interface Spending {
  amount: number;
  category: string;
  description: string;
}

export interface TimeUsage {
  productive: number; // hours
  unproductive: number; // hours
}

export interface DailyReflection {
  date: string;
  reflection: string;
  health: HealthMetric;
  meals: Meal[];
  spending: Spending[];
  timeUsage: TimeUsage;
}

export interface PersonalityData {
  reflections: Record<string, DailyReflection>;
}
