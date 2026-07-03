/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { BIRTHDAY_CONFIG } from "./config";
import AestheticLayer from "./components/AestheticLayer";
import CountdownScreen from "./components/CountdownScreen";
import BirthdayIntro from "./components/BirthdayIntro";
import MainHub from "./components/MainHub";
import MusicSection from "./components/MusicSection";
import MessageSection from "./components/MessageSection";
import PhotosSection from "./components/PhotosSection";
import IntroVideoScreen from "./components/IntroVideoScreen";
import { motion, AnimatePresence } from "motion/react";

type ViewState = "countdown" | "intro-video" | "intro" | "hub" | "music" | "message" | "photos";

// Safe localStorage fallback to prevent security crashes in sandboxed iframes
const safeLocalStorageStore: Record<string, string> = {};

const safeLocalStorage = {
  getItem: (key: string): string | null => {
    try {
      return localStorage.getItem(key);
    } catch {
      return safeLocalStorageStore[key] || null;
    }
  },
  setItem: (key: string, value: string): void => {
    try {
      localStorage.setItem(key, value);
    } catch {
      safeLocalStorageStore[key] = value;
    }
  },
  removeItem: (key: string): void => {
    try {
      localStorage.removeItem(key);
    } catch {
      delete safeLocalStorageStore[key];
    }
  }
};

// Safe sessionStorage fallback to prevent security crashes in sandboxed iframes
const safeSessionStorageStore: Record<string, string> = {};

const safeSessionStorage = {
  getItem: (key: string): string | null => {
    try {
      return sessionStorage.getItem(key);
    } catch {
      return safeSessionStorageStore[key] || null;
    }
  },
  setItem: (key: string, value: string): void => {
    try {
      sessionStorage.setItem(key, value);
    } catch {
      safeSessionStorageStore[key] = value;
    }
  },
  removeItem: (key: string): void => {
    try {
      sessionStorage.removeItem(key);
    } catch {
      delete safeSessionStorageStore[key];
    }
  }
};

export default function App() {
  const [view, setView] = useState<ViewState>("countdown");
  const [hasUnlocked, setHasUnlocked] = useState(false);

  // Check on mount if the session is already unlocked
  useEffect(() => {
    const checkSessionStatus = () => {
      const sessionUnlocked = safeSessionStorage.getItem("romantic_app_passcode_unlocked_v4");
      if (sessionUnlocked === "true") {
        setHasUnlocked(true);
        setView((currentView) => {
          if (currentView === "countdown") {
            const savedView = safeSessionStorage.getItem("romantic_app_current_view");
            if (savedView && savedView !== "countdown") {
              return savedView as ViewState;
            }
            return "hub";
          }
          return currentView;
        });
      } else {
        setView("countdown");
      }
    };

    checkSessionStatus();
  }, []);

  // Keep the current view updated in sessionStorage so page refreshes don't lose the user's progress
  useEffect(() => {
    if (view !== "countdown") {
      safeSessionStorage.setItem("romantic_app_current_view", view);
    }
  }, [view]);

  const handleUnlock = () => {
    safeSessionStorage.setItem("romantic_app_passcode_unlocked_v4", "true");
    setHasUnlocked(true);
    setView("intro-video");
  };

  const handleResetLock = () => {
    safeSessionStorage.removeItem("romantic_app_passcode_unlocked_v4");
    safeSessionStorage.removeItem("romantic_app_current_view");
    setHasUnlocked(false);
    setView("countdown");
  };

  // Visibility and focus lock: If the user leaves the tab for more than 15 seconds, auto-lock the app
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        // Record timestamp of when they left the website
        safeSessionStorage.setItem("romantic_app_last_left_time", Date.now().toString());
      } else if (document.visibilityState === "visible") {
        // Check if they've been gone for more than 15 seconds
        const lastLeftStr = safeSessionStorage.getItem("romantic_app_last_left_time");
        if (lastLeftStr) {
          const lastLeft = parseInt(lastLeftStr, 10);
          if (!isNaN(lastLeft) && Date.now() - lastLeft > 15000) {
            handleResetLock();
          }
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  return (
    <div className={`min-h-screen relative w-full overflow-x-hidden ${BIRTHDAY_CONFIG.aesthetic.backgroundColorClass}`}>
      {/* Global Aesthetics: Falling Snow and Drifting Hearts over all pages */}
      <AestheticLayer />

      <main className="relative z-20 min-h-screen w-full flex flex-col justify-between">
        <AnimatePresence mode="wait">
          {view === "countdown" && (
            <motion.div
              key="countdown-view"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="w-full"
            >
              <CountdownScreen onUnlock={handleUnlock} />
            </motion.div>
          )}

          {view === "intro-video" && (
            <motion.div
              key="intro-video-view"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="w-full"
            >
              <IntroVideoScreen onFinished={() => setView("intro")} />
            </motion.div>
          )}

          {view === "intro" && (
            <motion.div
              key="intro-view"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="w-full"
            >
              <BirthdayIntro onNext={() => setView("hub")} />
            </motion.div>
          )}

          {view === "hub" && (
            <motion.div
              key="hub-view"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.4 }}
              className="w-full"
            >
              <MainHub onNavigate={(v) => setView(v)} onReset={handleResetLock} />
            </motion.div>
          )}

          {view === "music" && (
            <motion.div
              key="music-view"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.35 }}
              className="w-full"
            >
              <MusicSection onBack={() => setView("hub")} />
            </motion.div>
          )}

          {view === "message" && (
            <motion.div
              key="message-view"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.35 }}
              className="w-full"
            >
              <MessageSection 
                onBack={() => setView("hub")} 
                onNavigateToPhotos={() => setView("photos")}
              />
            </motion.div>
          )}

          {view === "photos" && (
            <motion.div
              key="photos-view"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35 }}
              className="w-full"
            >
              <PhotosSection onBack={() => setView("hub")} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
