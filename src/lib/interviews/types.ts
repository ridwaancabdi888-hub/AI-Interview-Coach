export type InterviewType = 'technical' | 'behavioral' | 'general';
export type InterviewMode = 'written' | 'voice';
export type ExperienceLevel = 'student' | 'entry' | 'mid' | 'senior';

export interface InterviewConfig {
  type: InterviewType;
  mode: InterviewMode;
  jobRole: string;
  experienceLevel: ExperienceLevel;
  questionCount: number;
  difficulty: 'easy' | 'balanced' | 'challenging';
  focusAreas: string[];
}

export interface AnswerFeedback {
  score: number;
  summary: string;
  strengths: string[];
  improvements: string[];
  improvedAnswer: string;
  followUpQuestion?: string;
}
