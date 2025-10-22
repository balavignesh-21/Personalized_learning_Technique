export interface LearningStyle {
  visual: number;
  auditory: number;
  readingWriting: number;
  kinesthetic: number;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  learningStyle: LearningStyle;
  dominantStyle: string;
  preferences: string[];
  createdAt: Date;
}

export interface QuizResult {
  id: string;
  userId: string;
  score: number;
  topic: string;
  timeSpent: number;
  attempts: number;
  completedAt: Date;
}

export interface StudyTechnique {
  id: string;
  name: string;
  description: string;
  type: 'visual' | 'auditory' | 'reading' | 'kinesthetic' | 'mixed';
  effectiveness: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime: number;
  tags: string[];
}

export interface Recommendation {
  id: string;
  technique: StudyTechnique;
  confidence: number;
  reasoning: string;
  personalizedTips: string[];
}

export interface LearningSession {
  id: string;
  userId: string;
  techniqueId: string;
  duration: number;
  rating: number;
  notes: string;
  completedAt: Date;
}