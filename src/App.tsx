import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Zap, Moon, Heart, Wind, ChevronRight, Clock, Sparkles, Star, Info, ArrowLeft } from 'lucide-react';
import { Layout } from './components/Layout';
import { Button } from './components/Button';
import { Card } from './components/Card';
import { MOMENTS, ACTIVITIES } from './constants';
import { Moment, Activity, UserState } from './types';
import { cn } from './lib/utils';
import { generateCraft, Craft as AICraft, isApiKeyConfigured } from './services/geminiService';

type AppState = 'welcome' | 'moment' | 'activity' | 'done' | 'crafts' | 'error';

interface Toast {
  message: string;
  type: 'success' | 'info' | 'error';
}

export default function App() {
  const [appState, setAppState] = useState<AppState>('welcome');
  const [errorHeader, setErrorHeader] = useState<string>('');
  const [errorDetail, setErrorDetail] = useState<string>('');
  const [selectedMoment, setSelectedMoment] = useState<Moment | null>(null);
  const [currentActivity, setCurrentActivity] = useState<Activity | null>(null);
  const [history, setHistory] = useState<string[]>([]);
  const [toast, setToast] = useState<Toast | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [aiCraft, setAiCraft] = useState<AICraft | null>(null);
  const [craftTopic, setCraftTopic] = useState('');
  const [userState, setUserState] = useState<UserState>({
    favorites: [],
    completedCount: 0,
  });

  // Global check for API key on mount to prevent hidden failures
  useEffect(() => {
    if (!isApiKeyConfigured()) {
      console.warn("VITE_GEMINI_API_KEY no detectada. Las manualidades con IA no funcionarán.");
    }
  }, []);

  // Load user state from localStorage (only for completed count if needed, but we can keep it simple)
  useEffect(() => {
    const savedState = localStorage.getItem('happy_user_state');
    if (savedState) {
      try {
        setUserState(JSON.parse(savedState));
      } catch (e) {
        console.error("Error parsing user state", e);
      }
    }
  }, []);
