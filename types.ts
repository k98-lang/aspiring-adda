
export interface Course {
  id: string;
  name: string;
  full: string;
  icon: string;
  desc: string;
  theme: string;
  gradient: string;
  bgLight: string;
  bgDark: string;
  border: string;
}

export interface Specialization {
  id: string;
  courseId: string;
  name: string;
  growth: string;
  salary: string;
  tags: string[];
}

export interface Resource {
  name: string;
  url: string;
}

export interface QuizQuestion {
  q: string;
  o: string[];
  a: number;
}

export interface RoadmapStep {
  title: string;
  desc: string;
  color: string;
  resources?: Resource[];
  quiz?: QuizQuestion[];
}

export interface RoutineItem {
  time: string;
  title: string;
  desc: string;
}

export interface DeepDiveData {
  role: string;
  tagline: string;
  summary: string;
  dayInLife: RoutineItem[];
  stats: { label: string; value: string }[];
  stack: string[];
  roadmap: RoadmapStep[];
}

export interface SoftSkill {
  id: string;
  title: string;
  icon: string;
  color: string;
  desc: string;
  assessment: string[];
  tips: string[];
  resources: Resource[];
  scenarios: string[];
}

export interface Job {
  id: string;
  title: string;
  company: string;
  loc: string;
  sal: string;
  experience: string;
  tags: string[];
  bg: string;
  logoUrl: string;
  url: string;
  studyResources?: Resource[];
}

export interface User {
  email: string;
  name: string;
  isAuthenticated: boolean;
}

export type ViewState = 'home' | 'explore' | 'paths' | 'detail' | 'jobs' | 'saved' | 'quiz' | 'team' | 'soft-skills' | 'login' | 'arcade';
