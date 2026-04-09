import React from 'react';
import { motion } from 'motion/react';
import { Heart, Bookmark, Home, Smartphone } from 'lucide-react';
import { cn } from '../lib/utils';

interface LayoutProps {
  children: React.ReactNode;
  showNav?: boolean;
  onNavHome?: () => void;
  onNavFavorites?: () => void;
  onNavScreenFree?: () => void;
  activeTab?: 'home' | 'favorites' | 'screen-free';
}

export const Layout: React.FC<LayoutProps> = ({ 
  children, 
  showNav = true, 
  onNavHome, 
  onNavFavorites,
  onNavScreenFree,
  activeTab = 'home'
}) => {
  return (
    <div className="min-h-screen bg-background flex flex-col max-w-md mx-auto relative shadow-2xl overflow-hidden font-sans border-x border-border-custom">
      <header className="px-6 pt-8 pb-4 flex justify-center items-center bg-background/90 backdrop-blur-md sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 bg-brand-primary rounded-2xl flex items-center justify-center shadow-soft transform -rotate-3">
            <span className="text-2xl">😊</span>
          </div>
          <h1 className="text-2xl font-black tracking-tight text-text-primary">HappIA</h1>
        </div>
      </header>

      <main className="flex-1 px-6 py-4 overflow-y-auto">
        {children}
      </main>

      {showNav && (
        <nav className="bg-surface/95 backdrop-blur-md border-t border-border-custom px-6 py-4 flex justify-around items-center sticky bottom-0 z-10 rounded-t-[32px] shadow-[0_-8px_24px_rgba(31,41,55,0.04)]">
          <button 
            onClick={onNavHome}
            className={cn(
              "flex flex-col items-center gap-1.5 transition-all active:scale-90",
              activeTab === 'home' ? "text-brand-primary" : "text-text-secondary hover:text-brand-primary"
            )}
          >
            <div className={cn("p-2 rounded-xl transition-colors", activeTab === 'home' && "bg-brand-primary-soft")}>
              <Home className="w-6 h-6" strokeWidth={activeTab === 'home' ? 3 : 2} />
            </div>
            <span className="text-[10px] font-extrabold uppercase tracking-widest">Inicio</span>
          </button>
          <button 
            onClick={onNavScreenFree}
            className={cn(
              "flex flex-col items-center gap-1.5 transition-all active:scale-90",
              activeTab === 'screen-free' ? "text-secondary-mint" : "text-text-secondary hover:text-secondary-mint"
            )}
          >
            <div className={cn("p-2 rounded-xl transition-colors", activeTab === 'screen-free' && "bg-secondary-mint/10")}>
              <Smartphone className="w-6 h-6" strokeWidth={activeTab === 'screen-free' ? 3 : 2} />
            </div>
            <span className="text-[10px] font-extrabold uppercase tracking-widest">Sin Pantalla</span>
          </button>
          <button 
            onClick={onNavFavorites}
            className={cn(
              "flex flex-col items-center gap-1.5 transition-all active:scale-90",
              activeTab === 'favorites' ? "text-secondary-coral" : "text-text-secondary hover:text-secondary-coral"
            )}
          >
            <div className={cn("p-2 rounded-xl transition-colors", activeTab === 'favorites' && "bg-secondary-coral/10")}>
              <Bookmark className="w-6 h-6" strokeWidth={activeTab === 'favorites' ? 3 : 2} />
            </div>
            <span className="text-[10px] font-extrabold uppercase tracking-widest">Guardados</span>
          </button>
        </nav>
      )}
    </div>
  );
};
