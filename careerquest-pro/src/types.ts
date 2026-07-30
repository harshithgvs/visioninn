export interface SkillCategory {
  id: string;
  category: string;
  items: string[];
}

export interface WorkExperience {
  id: string;
  company: string;
  role: string;
  location: string;
  startDate: string;
  endDate: string;
  highlights: string[];
}

export interface ProjectItem {
  id: string;
  title: string;
  techStack: string[];
  description: string;
  link?: string;
}

export interface EducationItem {
  id: string;
  institution: string;
  degree: string;
  year: string;
  gpa?: string;
}

export interface ResumeData {
  id: string;
  templateId: 'modern-clean' | 'tech-vibrant' | 'executive-serif' | 'minimal-compact';
  title: string;
  updatedAt: string;
  fullName: string;
  targetRole: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  github: string;
  summary: string;
  skills: SkillCategory[];
  experience: WorkExperience[];
  projects: ProjectItem[];
  education: EducationItem[];
  certifications: string[];
}

export interface TopicItem {
  topicTitle: string;
  summary: string;
  keyTakeaways: string[];
  resourceType?: string;
  completed?: boolean;
}

export interface RoadmapPhase {
  phaseNumber: number;
  phaseTitle: string;
  description: string;
  estimatedHours: number;
  topics: TopicItem[];
  projectIdea?: string;
}

export interface CourseRoadmap {
  id: string;
  title: string;
  category: 'web-dev' | 'ai-ml' | 'cyber-security' | 'cloud-devops' | 'ui-ux' | 'custom';
  description: string;
  estimatedWeeks: number;
  iconName: string;
  colorTheme: string; // e.g. 'indigo', 'emerald', 'amber', 'rose', 'cyan'
  prerequisites: string[];
  phases: RoadmapPhase[];
  isCustom?: boolean;
}

export interface QuizQuestion {
  id: number;
  questionText: string;
  options: string[];
  correctOptionIndex: number;
  explanation: string;
  conceptCategory?: string;
}

export interface QuizData {
  id: string;
  quizTitle: string;
  topic: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  timeLimitMinutes?: number;
  questions: QuizQuestion[];
}

export interface QuizAttemptResult {
  id: string;
  quizId: string;
  quizTitle: string;
  topic: string;
  scorePercentage: number;
  correctCount: number;
  totalQuestions: number;
  completedAt: string;
  timeSpentSeconds: number;
  userAnswers: Record<number, number>; // questionId -> selectedOptionIndex
}

export interface UserProfile {
  fullName: string;
  displayName: string;
  college: string;
  degree: string;
  year: string;
  bio: string;
  email: string;
  phone: string;
  location: string;
}

export type ActiveTab = 'resume' | 'roadmaps' | 'quizzes' | 'dashboard' | 'profile';
