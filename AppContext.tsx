import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ViewState, User } from './types';

interface AppContextType {
  view: ViewState;
  setView: (view: ViewState) => void;
  isDark: boolean;
  toggleTheme: () => void;
  currentUser: User | null;
  login: (email: string, name: string) => void;
  logout: () => void;
  selectedCourseId: string | null;
  setSelectedCourseId: (id: string | null) => void;
  selectedSpecId: string | null;
  setSelectedSpecId: (id: string | null) => void;
  selectedSoftSkillId: string | null;
  setSelectedSoftSkillId: (id: string | null) => void;
  savedJobs: Set<string>;
  toggleSaveJob: (id: string) => void;
  userSkills: Set<string>;
  toggleUserSkill: (skill: string) => void;
  roadmapProgress: Record<string, number>;
  updateRoadmapProgress: (specId: string, level: number) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  jobFilter: string;
  setJobFilter: (filter: string) => void;
  locationFilter: string;
  setLocationFilter: (filter: string) => void;
  lastQuizScore: number | null;
  setLastQuizScore: (score: number) => void;
  navigate: (view: ViewState, params?: any) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [view, setView] = useState<ViewState>('home');
  const [isDark, setIsDark] = useState(true);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const [selectedSpecId, setSelectedSpecId] = useState<string | null>(null);
  const [selectedSoftSkillId, setSelectedSoftSkillId] = useState<string | null>(null);

  const [savedJobs, setSavedJobs] = useState<Set<string>>(new Set());
  const [userSkills, setUserSkills] = useState<Set<string>>(new Set());
  const [roadmapProgress, setRoadmapProgress] = useState<Record<string, number>>({});

  const [searchTerm, setSearchTerm] = useState('');
  const [jobFilter, setJobFilter] = useState('All');
  const [locationFilter, setLocationFilter] = useState('All');
  const [lastQuizScore, setLastQuizScore] = useState<number | null>(null);

  useEffect(() => {
    const html = document.documentElement;
    if (isDark) html.classList.add('dark');
    else html.classList.remove('dark');
  }, [isDark]);

  // Load User Session
  useEffect(() => {
    const storedUser = localStorage.getItem('aspiring_user');
    if (storedUser) {
        try {
            const user = JSON.parse(storedUser);
            setCurrentUser(user);
            loadUserData(user.email);
        } catch (e) {
            console.error("Failed to restore session");
        }
    } else {
        // Load Guest Data
        loadUserData('guest');
    }
  }, []);

  const loadUserData = (userKey: string) => {
      const jobsKey = `aspiring_${userKey}_savedJobs`;
      const progressKey = `aspiring_${userKey}_progress`;

      const loadedJobs = localStorage.getItem(jobsKey);
      if (loadedJobs) {
          try {
              setSavedJobs(new Set(JSON.parse(loadedJobs)));
          } catch(e) { setSavedJobs(new Set()); }
      } else {
          setSavedJobs(new Set());
      }

      const loadedProgress = localStorage.getItem(progressKey);
      if (loadedProgress) {
          try {
              setRoadmapProgress(JSON.parse(loadedProgress));
          } catch(e) { setRoadmapProgress({}); }
      } else {
          setRoadmapProgress({});
      }
  };

  const login = (email: string, name: string) => {
      const user: User = { email, name, isAuthenticated: true };
      setCurrentUser(user);
      localStorage.setItem('aspiring_user', JSON.stringify(user));
      loadUserData(email);
  };

  const logout = () => {
      setCurrentUser(null);
      localStorage.removeItem('aspiring_user');
      loadUserData('guest'); // Reset to guest data or empty
      setView('home');
  };

  const toggleTheme = () => setIsDark(!isDark);

  const toggleSaveJob = (id: string) => {
    const newSet = new Set(savedJobs);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    setSavedJobs(newSet);

    const userKey = currentUser ? currentUser.email : 'guest';
    localStorage.setItem(`aspiring_${userKey}_savedJobs`, JSON.stringify(Array.from(newSet)));
  };

  const toggleUserSkill = (skill: string) => {
    const newSet = new Set(userSkills);
    if (newSet.has(skill)) newSet.delete(skill);
    else newSet.add(skill);
    setUserSkills(newSet);
  };

  const updateRoadmapProgress = (specId: string, level: number) => {
      const newProgress = {...roadmapProgress, [specId]: level};
      setRoadmapProgress(newProgress);

      const userKey = currentUser ? currentUser.email : 'guest';
      localStorage.setItem(`aspiring_${userKey}_progress`, JSON.stringify(newProgress));
  };

  const navigate = (newView: ViewState, params: any = {}) => {
      if (view === 'jobs' && newView !== 'jobs' && newView !== 'detail') {
          setSearchTerm('');
          setJobFilter('All');
          setLocationFilter('All');
          setUserSkills(new Set());
      }

      setView(newView);
      window.scrollTo({ top: 0, behavior: 'smooth' });

      if (params.courseId) setSelectedCourseId(params.courseId);
      if (params.specId) setSelectedSpecId(params.specId);
      if (params.softSkillId) setSelectedSoftSkillId(params.softSkillId);

      if (newView === 'home') {
          setSelectedCourseId(null);
          setSelectedSpecId(null);
          setSelectedSoftSkillId(null);
      }
  };

  return (
    <AppContext.Provider value={{
      view, setView,
      isDark, toggleTheme,
      currentUser, login, logout,
      selectedCourseId, setSelectedCourseId,
      selectedSpecId, setSelectedSpecId,
      selectedSoftSkillId, setSelectedSoftSkillId,
      savedJobs, toggleSaveJob,
      userSkills, toggleUserSkill,
      roadmapProgress, updateRoadmapProgress,
      searchTerm, setSearchTerm,
      jobFilter, setJobFilter,
      locationFilter, setLocationFilter,
      lastQuizScore, setLastQuizScore,
      navigate
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used within AppProvider");
  return context;
};