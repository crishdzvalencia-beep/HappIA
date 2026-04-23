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

  // Save user state to localStorage
  useEffect(() => {
    localStorage.setItem('happy_user_state', JSON.stringify(userState));
  }, [userState]);

  // Toast auto-hide
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const showToast = (message: string, type: 'success' | 'info' = 'success') => {
    setToast({ message, type });
  };

  const getRandomActivity = useCallback((moment: Moment, excludeIds: string[] = []) => {
    const filtered = ACTIVITIES.filter(a => a.moment === moment && !excludeIds.includes(a.id));
    if (filtered.length === 0) {
      const allForMoment = ACTIVITIES.filter(a => a.moment === moment);
      return allForMoment.length > 0 ? allForMoment[0] : null;
    }
    return filtered[Math.floor(Math.random() * filtered.length)];
  }, []);

  const handleMomentSelect = (moment: Moment) => {
    setIsLoading(true);
    setSelectedMoment(moment);
    
    // Simulate a small loading for "AI" feel
    setTimeout(() => {
      const activity = getRandomActivity(moment);
      if (activity) {
        setCurrentActivity(activity);
        setHistory([activity.id]);
        setAppState('activity');
      } else {
        showToast("No hemos encontrado ideas para este momento", "info");
      }
      setIsLoading(false);
    }, 600);
  };

  const handleAnotherIdea = () => {
    if (appState === 'crafts') {
      handleGenerateCraft();
      return;
    }
    if (!selectedMoment) return;
    setIsLoading(true);
    setTimeout(() => {
      const activity = getRandomActivity(selectedMoment, history);
      if (activity) {
        setCurrentActivity(activity);
        setHistory(prev => [...prev, activity.id]);
      } else {
        showToast("No hay más ideas por ahora", "info");
      }
      setIsLoading(false);
    }, 400);
  };

  const toggleFavorite = (id: string) => {
    setUserState(prev => {
      const isFav = prev.favorites.includes(id);
      if (!isFav) {
        showToast("¡Guardado! 💛");
      } else {
        showToast("Quitado de favoritos", "info");
      }
      return {
        ...prev,
        favorites: isFav ? prev.favorites.filter(fid => fid !== id) : [...prev.favorites, id],
      };
    });
  };

  const handleDone = () => {
    setUserState(prev => ({
      ...prev,
      completedCount: prev.completedCount + 1,
      lastActivityDate: new Date().toISOString(),
    }));
    setAppState('done');
  };

  const handleGenerateCraft = async () => {
    if (!isApiKeyConfigured()) {
      setErrorHeader("Falta configurar la API key");
      setErrorDetail("Añade VITE_GEMINI_API_KEY en las variables de entorno de Vercel para activar las manualidades.");
      setAppState('error');
      return;
    }

    setIsLoading(true);
    try {
      const result = await generateCraft(craftTopic || "general");
      if (result) {
        setAiCraft(result);
        setAppState('crafts');
      } else {
        showToast("No hemos podido generar la manualidad", "info");
      }
    } catch (error: any) {
      if (error.message === "MISSING_API_KEY") {
        setErrorHeader("Falta configurar la API key");
        setErrorDetail("Configura VITE_GEMINI_API_KEY en Vercel.");
      } else {
        setErrorHeader("Gemini ha fallado");
        setErrorDetail("Ha ocurrido un error inesperado al intentar generar contenido.");
      }
      setAppState('error');
    } finally {
      setIsLoading(false);
    }
  };

  const renderBackButton = () => (
    <motion.button
      whileHover={{ x: -4, scale: 1.02 }}
      whileTap={{ scale: 0.95 }}
      onClick={resetFlow}
      className="group flex items-center gap-2 px-5 py-2.5 text-sm font-black text-brand-primary bg-brand-primary-soft rounded-2xl cursor-pointer shadow-sm hover:shadow-soft hover:bg-brand-primary hover:text-white transition-all mb-8 border-b-4 border-black/5"
    >
      <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
      <span>Atrás</span>
    </motion.button>
  );

  const renderCrafts = () => (
    <motion.div
      key="crafts"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="pt-6 pb-8"
    >
      {renderBackButton()}
      <div className="mb-6 flex items-center justify-between">
        <div className="text-right ml-auto">
          <p className="text-brand-primary font-black uppercase tracking-widest text-sm mb-1">Manualidades con IA</p>
          <div className="h-1 w-12 bg-brand-primary rounded-full ml-auto" />
        </div>
      </div>

      {!aiCraft || isLoading ? (
        <Card className="p-8 text-center bg-surface-alt border-dashed border-2 border-brand-primary/20">
          <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center shadow-soft mx-auto mb-6">
            <Sparkles className={cn("w-10 h-10 text-brand-primary", isLoading && "animate-spin")} />
          </div>
          <h3 className="text-xl font-black mb-4">¿Qué materiales tienes?</h3>
          <p className="text-text-secondary mb-8 font-medium">O simplemente deja que la IA te sorprenda.</p>
          <input 
            type="text" 
            placeholder="Ej: cartón, tapones, pintura..."
            value={craftTopic}
            onChange={(e) => setCraftTopic(e.target.value)}
            className="w-full p-4 rounded-2xl border-2 border-border-custom focus:border-brand-primary outline-none mb-6 text-center"
          />
          <Button fullWidth onClick={handleGenerateCraft} disabled={isLoading}>
            {isLoading ? "Creando magia..." : "Generar Manualidad"}
          </Button>
        </Card>
      ) : (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="mb-8 overflow-hidden border-none shadow-soft relative p-8">
            <div className="absolute top-0 left-0 w-full h-2 bg-brand-primary opacity-20" />
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <div className="px-4 py-2 bg-background-soft rounded-xl text-sm font-black text-text-secondary flex items-center gap-2">
                <Clock className="w-4 h-4" />
                {aiCraft.duration}
              </div>
              <div className="px-4 py-2 bg-brand-primary-soft rounded-xl text-sm font-black text-brand-primary flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                {aiCraft.materials.join(', ')}
              </div>
            </div>
            <h2 className="text-3xl font-black mb-6 text-text-primary leading-tight">{aiCraft.title}</h2>
            <div className="space-y-8 mb-4">
              {aiCraft.steps.map((step, idx) => (
                <div key={idx} className="flex gap-5">
                  <div className="flex-shrink-0 w-10 h-10 rounded-2xl bg-brand-primary text-text-primary flex items-center justify-center font-black text-lg shadow-sm">
                    {idx + 1}
                  </div>
                  <p className="text-text-primary text-lg font-bold leading-snug pt-1">{step}</p>
                </div>
              ))}
            </div>
          </Card>
          
          <div className="space-y-4">
            <Button fullWidth size="xl" onClick={() => setAppState('done')}>
              ¡Hecho! ✅
            </Button>
            <Button variant="secondary" fullWidth size="lg" onClick={() => setAiCraft(null)}>
              Probar otro tema
            </Button>
            <button onClick={resetFlow} className="w-full py-4 text-text-secondary font-black uppercase tracking-widest text-xs">
              Volver al inicio
            </button>
          </div>
        </motion.div>
      )}
    </motion.div>
  );

  const resetFlow = () => {
    setSelectedMoment(null);
    setCurrentActivity(null);
    setHistory([]);
    setAiCraft(null);
    setCraftTopic('');
    setAppState('welcome');
  };

  const renderWelcome = () => (
    <motion.div
      key="welcome"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="flex flex-col items-center text-center pt-12 pb-8"
    >
      <div className="relative mb-10">
        <motion.div 
          animate={{ rotate: [0, 5, -5, 0], scale: [1, 1.05, 0.95, 1] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="w-40 h-40 bg-brand-primary-soft rounded-full flex items-center justify-center relative z-10"
        >
          <span className="text-7xl">😊</span>
        </motion.div>
        <div className="absolute -top-4 -right-4 w-12 h-12 bg-secondary-coral/20 rounded-full blur-xl" />
        <div className="absolute -bottom-6 -left-6 w-16 h-16 bg-secondary-blue/20 rounded-full blur-xl" />
      </div>
      
      <h2 className="text-3xl font-black mb-4 px-4 text-text-primary leading-tight">
        ¿Cómo está hoy tu peque?
      </h2>
      <p className="text-text-secondary text-lg mb-12 px-6 font-medium leading-relaxed">
        Te damos una idea clara en segundos.
      </p>
      
      <Button 
        size="xl" 
        fullWidth 
        onClick={() => setAppState('moment')}
        className="text-xl py-6"
      >
        Empezar
      </Button>

      <Button 
        variant="secondary"
        size="lg" 
        fullWidth 
        onClick={() => setAppState('crafts')}
        className="mt-4 text-lg py-5 border-2 border-border-custom bg-surface-alt"
      >
        Manualidades Creativas ✨
      </Button>
    </motion.div>
  );

  const renderMomentSelection = () => (
    <motion.div
      key="moment"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="pt-6 pb-8"
    >
      {renderBackButton()}
      <h2 className="text-3xl font-black mb-2 text-text-primary">¿Cómo está hoy tu peque?</h2>
      <p className="text-text-secondary text-lg mb-8 font-medium">Elige la señal que mejor encaje ahora mismo.</p>
      
      <div className="grid grid-cols-1 gap-6">
        {MOMENTS.map((m) => (
          <button
            key={m.id}
            onClick={() => handleMomentSelect(m.id)}
            disabled={isLoading}
            className={cn(
              "group relative flex items-center gap-6 p-8 rounded-[32px] border-2 transition-all active:scale-[0.98] text-left",
              "bg-surface border-border-custom hover:border-brand-primary hover:shadow-soft",
              isLoading && "opacity-50 pointer-events-none"
            )}
          >
            <div className={cn(
              "w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shadow-sm transition-transform group-hover:scale-110",
              m.color,
              "bg-opacity-20 text-text-primary"
            )}>
              {m.id === 'move' && <Zap className="w-8 h-8 text-secondary-blue" />}
              {m.id === 'calm' && <Moon className="w-8 h-8 text-secondary-mint" />}
              {m.id === 'connect' && <Heart className="w-8 h-8 text-secondary-coral" />}
              {m.id === 'slowdown' && <Wind className="w-8 h-8 text-accent-lilac" />}
            </div>
            <div className="flex-1">
              <span className="block text-xl font-black text-text-primary">{m.label}</span>
            </div>
            <div className="w-10 h-10 rounded-full bg-background-soft flex items-center justify-center text-text-secondary group-hover:bg-brand-primary group-hover:text-text-primary transition-colors">
              <ChevronRight className="w-6 h-6" />
            </div>
          </button>
        ))}
      </div>

      {isLoading && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex flex-col items-center justify-center p-8 text-center"
        >
          <div className="w-20 h-20 bg-brand-primary rounded-3xl flex items-center justify-center shadow-soft mb-6 animate-bounce">
            <span className="text-4xl">💡</span>
          </div>
          <h3 className="text-xl font-black mb-2">Buscando la mejor idea...</h3>
          <p className="text-text-secondary font-medium">Preparando algo especial para vosotros.</p>
        </motion.div>
      )}
    </motion.div>
  );

  const renderActivity = () => {
    if (!currentActivity) return null;
    const momentInfo = MOMENTS.find(m => m.id === currentActivity.moment);

    return (
      <motion.div
        key="activity"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        className="pt-4 pb-8"
      >
      {renderBackButton()}
      <div className="mb-6">
          <p className="text-brand-primary font-black uppercase tracking-widest text-sm mb-1">Para este momento, prueba esto</p>
          <div className="h-1 w-12 bg-brand-primary rounded-full" />
        </div>

        <Card className="mb-8 overflow-hidden border-none shadow-soft relative p-8">
          <div className="absolute top-0 left-0 w-full h-2 bg-brand-primary opacity-20" />
          
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <div className="px-4 py-2 bg-background-soft rounded-xl text-sm font-black text-text-secondary flex items-center gap-2">
              <Clock className="w-4 h-4" />
              {currentActivity.duration}
            </div>
            {currentActivity.materials && currentActivity.materials.length > 0 && (
              <div className="px-4 py-2 bg-brand-primary-soft rounded-xl text-sm font-black text-brand-primary flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                {currentActivity.materials.join(', ')}
              </div>
            )}
          </div>
          
          <h2 className="text-3xl font-black mb-6 text-text-primary leading-tight">{currentActivity.title}</h2>
          
          <div className="space-y-8 mb-4">
            {currentActivity.steps.map((step, idx) => (
              <div key={idx} className="flex gap-5 group">
                <div className="flex-shrink-0 w-10 h-10 rounded-2xl bg-brand-primary text-text-primary flex items-center justify-center font-black text-lg shadow-sm">
                  {idx + 1}
                </div>
                <p className="text-text-primary text-lg font-bold leading-snug pt-1">{step}</p>
              </div>
            ))}
          </div>
        </Card>

        <div className="space-y-4">
          <Button 
            fullWidth 
            size="xl" 
            onClick={handleDone}
            className="text-xl py-6 shadow-soft"
          >
            Ya lo hemos hecho ✅
          </Button>
          <Button 
            fullWidth 
            variant="secondary" 
            size="lg" 
            onClick={handleAnotherIdea}
            disabled={isLoading}
            className="text-lg py-5 border-2 border-border-custom"
          >
            {isLoading ? 'Buscando...' : 'Otra idea'}
          </Button>
          <button 
            onClick={resetFlow}
            className="w-full py-4 text-text-secondary font-black uppercase tracking-widest text-xs hover:text-brand-primary transition-colors"
          >
            Empezar de nuevo
          </button>
        </div>
      </motion.div>
    );
  };

  const renderDone = () => (
    <motion.div
      key="done"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center text-center pt-20 pb-8"
    >
      <div className="w-32 h-32 bg-brand-primary-soft rounded-full flex items-center justify-center mb-8">
        <span className="text-6xl">💛</span>
      </div>
      
      <h2 className="text-4xl font-black mb-4 text-text-primary">¡Bien hecho!</h2>
      <p className="text-text-secondary text-xl mb-12 px-4 font-medium leading-relaxed">
        Lo importante es este ratito juntos.
      </p>
      <div className="w-full space-y-4">
        <Button size="xl" fullWidth onClick={() => setAppState('welcome')}>
          Volver mañana
        </Button>
        <button 
          onClick={resetFlow}
          className="w-full py-4 text-text-secondary font-black uppercase tracking-widest text-xs hover:text-brand-primary transition-colors"
        >
          Empezar de nuevo
        </button>
      </div>
    </motion.div>
  );

  const renderError = () => (
    <motion.div
      key="error"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center text-center pt-20 pb-8"
    >
      <div className="w-32 h-32 bg-secondary-coral/20 rounded-full flex items-center justify-center mb-8">
        <span className="text-6xl text-secondary-coral">⚠️</span>
      </div>
      <h2 className="text-2xl font-black mb-4 text-text-primary">{errorHeader || "Algo ha salido mal"}</h2>
      <p className="text-text-secondary text-lg mb-12 px-6 font-medium leading-relaxed">
        {errorDetail || "Ha ocurrido un error al conectar con Gemini."}
      </p>
      <Button size="xl" fullWidth onClick={resetFlow}>
        Volver al inicio
      </Button>
    </motion.div>
  );

  return (
    <Layout 
      showNav={false}
    >
      <AnimatePresence mode="wait">
        {appState === 'welcome' && renderWelcome()}
        {appState === 'moment' && renderMomentSelection()}
        {appState === 'crafts' && renderCrafts()}
        {appState === 'activity' && renderActivity()}
        {appState === 'done' && renderDone()}
        {appState === 'error' && renderError()}
      </AnimatePresence>

      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 w-full max-w-[280px]"
          >
            <div className={cn(
              "px-6 py-4 rounded-3xl shadow-soft flex items-center gap-3 text-text-primary font-black text-center justify-center border border-border-custom",
              toast.type === 'success' ? "bg-brand-primary-soft" : "bg-background-soft"
            )}>
              {toast.type === 'success' ? <Star className="w-5 h-5 text-brand-primary fill-brand-primary" /> : <Info className="w-5 h-5 text-text-secondary" />}
              {toast.message}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Layout>
  );
}
