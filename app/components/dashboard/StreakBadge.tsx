"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface StreakData {
  currentStreak: number;
  lastActiveDate: string;
  level: string;
  nextLevelDays: number;
  progress: number;
  color: string;
  bgColor: string;
  textColor: string;
  icon: string;
}

const getStreakLevel = (days: number): { level: string; nextLevelDays: number; progress: number } => {
  const levels = [
    { threshold: 0, name: "Niveau Bronze", color: "from-amber-500 to-amber-600", bgColor: "bg-amber-50", textColor: "text-amber-700", icon: "🥉" },
    { threshold: 25, name: "Niveau Argent", color: "from-gray-400 to-gray-500", bgColor: "bg-gray-50", textColor: "text-gray-700", icon: "🥈" },
    { threshold: 50, name: "Niveau Or", color: "from-yellow-400 to-yellow-500", bgColor: "bg-yellow-50", textColor: "text-yellow-700", icon: "🥇" },
    { threshold: 90, name: "Niveau Platine", color: "from-gray-300 to-gray-400", bgColor: "bg-gray-100", textColor: "text-gray-600", icon: "💎" },
    { threshold: 150, name: "Niveau Diamant", color: "from-blue-400 to-blue-500", bgColor: "bg-blue-50", textColor: "text-blue-700", icon: "💠" },
    { threshold: 300, name: "Niveau Élite", color: "from-purple-500 to-purple-600", bgColor: "bg-purple-50", textColor: "text-purple-700", icon: "👑" },
    { threshold: 500, name: "Niveau Maître", color: "from-indigo-500 to-indigo-600", bgColor: "bg-indigo-50", textColor: "text-indigo-700", icon: "🔥" },
    { threshold: 1000, name: "Niveau Légende", color: "from-red-500 to-red-600", bgColor: "bg-red-50", textColor: "text-red-700", icon: "⚡" }
  ];

  let currentLevel = levels[0];
  let nextLevel = levels[1];

  for (let i = levels.length - 1; i >= 0; i--) {
    if (days >= levels[i].threshold) {
      currentLevel = levels[i];
      nextLevel = i < levels.length - 1 ? levels[i + 1] : null;
      break;
    }
  }

  const progress = nextLevel ? ((days - currentLevel.threshold) / (nextLevel.threshold - currentLevel.threshold)) * 100 : 100;
  const nextLevelDays = nextLevel ? nextLevel.threshold - days : 0;

  return {
    level: currentLevel.name,
    nextLevelDays,
    progress: Math.min(progress, 100),
    ...currentLevel
  };
};

export default function StreakBadge() {
  const [streakData, setStreakData] = useState<StreakData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Récupérer les données de streak depuis le localStorage
    const savedStreak = localStorage.getItem("ekicare-streak");
    const today = new Date().toDateString();
    
    if (savedStreak) {
      const data = JSON.parse(savedStreak);
      const lastActiveDate = new Date(data.lastActiveDate).toDateString();
      
      if (lastActiveDate === today) {
        // L'utilisateur s'est déjà connecté aujourd'hui - recalculer le niveau
        const levelData = getStreakLevel(data.currentStreak);
        const updatedData: StreakData = {
          currentStreak: data.currentStreak,
          lastActiveDate: data.lastActiveDate,
          ...levelData
        };
        setStreakData(updatedData);
        localStorage.setItem("ekicare-streak", JSON.stringify(updatedData));
      } else if (lastActiveDate === new Date(Date.now() - 24 * 60 * 60 * 1000).toDateString()) {
        // L'utilisateur s'est connecté hier, continuer le streak
        const newStreak = data.currentStreak + 1;
        const levelData = getStreakLevel(newStreak);
        const updatedData: StreakData = {
          currentStreak: newStreak,
          lastActiveDate: today,
          ...levelData
        };
        
        localStorage.setItem("ekicare-streak", JSON.stringify(updatedData));
        setStreakData(updatedData);
      } else {
        // Streak brisé, recommencer
        const levelData = getStreakLevel(1);
        const newData: StreakData = {
          currentStreak: 1,
          lastActiveDate: today,
          ...levelData
        };
        
        localStorage.setItem("ekicare-streak", JSON.stringify(newData));
        setStreakData(newData);
      }
    } else {
      // Premier jour
      const levelData = getStreakLevel(1);
      const newData: StreakData = {
        currentStreak: 1,
        lastActiveDate: today,
        ...levelData
      };
      
      localStorage.setItem("ekicare-streak", JSON.stringify(newData));
      setStreakData(newData);
    }
    
    setIsLoading(false);
  }, []);

  if (isLoading || !streakData) {
    return (
      <div className="p-3 bg-gray-50 rounded-lg animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="space-y-2 mt-4 px-3"
    >
      {/* Badge hexagonal avec dégradé */}
      <div className="flex items-center gap-2">
        <div className={`relative w-8 h-8 rounded-md bg-gradient-to-br ${streakData.color} shadow-md flex items-center justify-center`}>
          <span className="text-white text-sm font-bold">{streakData.currentStreak}</span>
        </div>
        
        <div className="flex-1">
          <div className={`text-xs font-bold ${streakData.textColor} mb-0.5`}>
            {streakData.level}
          </div>
          <div className="text-xs text-gray-600">
            {streakData.currentStreak} jour{streakData.currentStreak > 1 ? 's' : ''} actif{streakData.currentStreak > 1 ? 's' : ''}
          </div>
        </div>
      </div>
      
      {/* Barre de progression */}
      {streakData.nextLevelDays > 0 && (
        <div className="space-y-1">
          <div className="flex justify-between text-xs">
            <span className={streakData.textColor}>Prochain niveau</span>
            <span className="font-medium">{streakData.nextLevelDays} jour{streakData.nextLevelDays > 1 ? 's' : ''}</span>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-1.5">
            <motion.div
              className={`h-1.5 rounded-full bg-gradient-to-r ${streakData.color} shadow-sm`}
              initial={{ width: 0 }}
              animate={{ width: `${streakData.progress}%` }}
              transition={{ duration: 1, delay: 0.5 }}
            />
          </div>
        </div>
      )}
      
      {streakData.nextLevelDays === 0 && (
        <div className="text-center">
          <div className={`text-xs font-bold ${streakData.textColor}`}>
            🏆 Niveau maximum atteint !
          </div>
        </div>
      )}
    </motion.div>
  );
}
