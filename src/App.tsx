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

  // Check on mount if we've already reached midnight of the birthday date to unlock automatically
  useEffect(() => {
    const sessionUnlocked = safeSessionStorage.getItem("romantic_app_session_unlocked");
    const targetTime = new Date(BIRTHDAY_CONFIG.birthdayDate).getTime();
    const dateReached = Date.now() >= targetTime;

    if (sessionUnlocked === "true" || dateReached) {
      safeSessionStorage.setItem("romantic_app_session_unlocked", "true");
      setHasUnlocked(true);
      // Already unlocked (from before, or date passed) -> go straight to the hub,
      // don't get stuck on the countdown screen and don't replay the intro video.
      setView((currentView) => (currentView === "countdown" ? "hub" : currentView));
      return; // no need for the timer once unlocked
    }

    // Not yet unlocked - keep checking every 10s in case the date rolls over live
    const interval = setInterval(() => {
      if (Date.now() >= targetTime) {
        safeSessionStorage.setItem("romantic_app_session_unlocked", "true");
        setHasUnlocked(true);
        setView((v) => (v === "countdown" ? "hub" : v));
        clearInterval(interval);
      }
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const handleUnlock = () => {
    safeSessionStorage.setItem("romantic_app_session_unlocked", "true");
    setHasUnlocked(true);
    setView("intro-video");
  };

  const handleResetLock = () => {
    safeSessionStorage.removeItem("romantic_app_session_unlocked");
    setHasUnlocked(false);
    setView("countdown");
  };

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
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
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
