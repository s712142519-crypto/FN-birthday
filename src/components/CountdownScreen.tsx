import React, { useState, useEffect } from "react";
import { BIRTHDAY_CONFIG } from "../config";
import { Lock, Unlock, Clock, KeyRound, Sparkles, Heart, Edit2, Calendar } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface CountdownScreenProps {
  onUnlock: () => void;
}

export default function CountdownScreen({ onUnlock }: CountdownScreenProps) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isOver: false,
  });
  
  const [passwordInput, setPasswordInput] = useState("");
  const [passwordError, setPasswordError] = useState(false);
  const [showPasswordBox, setShowPasswordBox] = useState(true);
  const [isCrafting, setIsCrafting] = useState(false);
  const [craftingSeconds, setCraftingSeconds] = useState(5);

  // Custom date selection state
  const [birthdayDateStr, setBirthdayDateStr] = useState(() => {
    const saved = localStorage.getItem("custom_birthday_date");
    if (saved) return saved;
    return BIRTHDAY_CONFIG.birthdayDate;
  });

  const [isEditingDate, setIsEditingDate] = useState(false);
  const [editMonth, setEditMonth] = useState(6);
  const [editDay, setEditDay] = useState(25);
  const [editYear, setEditYear] = useState(2026);

  // Sync edit states when birthdayDateStr is loaded or modified
  useEffect(() => {
    const d = new Date(birthdayDateStr);
    if (!isNaN(d.getTime())) {
      setEditMonth(d.getMonth() + 1);
      setEditDay(d.getDate());
      setEditYear(d.getFullYear());
    }
  }, [birthdayDateStr]);

  const handleSaveCustomDate = (month: number, day: number, year: number) => {
    const formattedMonth = String(month).padStart(2, "0");
    const formattedDay = String(day).padStart(2, "0");
    // Ensure it triggers at exactly 12:00 AM Midnight
    const dateStr = `${year}-${formattedMonth}-${formattedDay}T00:00:00`;
    setBirthdayDateStr(dateStr);
    localStorage.setItem("custom_birthday_date", dateStr);
    setIsEditingDate(false);
  };

  const triggerCraftingSequence = () => {
    setIsCrafting(true);
    setCraftingSeconds(5);
    
    let currentCount = 5;
    const interval = setInterval(() => {
      currentCount -= 1;
      if (currentCount <= 0) {
        clearInterval(interval);
        onUnlock();
      } else {
        setCraftingSeconds(currentCount);
      }
    }, 1200);
  };

  // 1. Live Countdown Loop
  useEffect(() => {
    const targetDate = new Date(birthdayDateStr).getTime();

    const updateTimer = () => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference <= 0) {
        setTimeLeft((prev) => {
          if (prev.isOver) return prev;
          return { days: 0, hours: 0, minutes: 0, seconds: 0, isOver: true };
        });
        setShowPasswordBox((prev) => {
          if (prev) return prev;
          return true;
        });
        return true;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft((prev) => {
        if (
          prev.days === days &&
          prev.hours === hours &&
          prev.minutes === minutes &&
          prev.seconds === seconds &&
          !prev.isOver
        ) {
          return prev;
        }
        return { days, hours, minutes, seconds, isOver: false };
      });
      return false;
    };

    // Initial check
    const isAlreadyAtMidnight = updateTimer();
    if (isAlreadyAtMidnight) return;

    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [birthdayDateStr]);

  // 2. Password Check Handler
  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput.toLowerCase().trim() === BIRTHDAY_CONFIG.password.toLowerCase().trim()) {
      setPasswordError(false);
      triggerCraftingSequence();
    } else {
      setPasswordError(true);
      setPasswordInput("");
      // Flash error for 1.5 seconds
      setTimeout(() => setPasswordError(false), 1500);
    }
  };

  return (
    <div
      id="countdown-container"
      className="relative min-h-screen w-screen flex flex-col items-center justify-center py-10 px-4 sm:px-6 select-none overflow-x-hidden"
      style={{ width: "100vw", minHeight: "100vh" }}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-neutral-950 via-[#0e051c] to-[#05010d] z-0 animate-fade-in" />

      {/* Decorative Floating Golden Stars */}
      <div className="absolute top-1/4 left-10 text-purple-400 opacity-60 animate-pulse">✨</div>
      <div className="absolute bottom-1/4 right-12 text-fuchsia-400 opacity-60 animate-pulse delay-500">✨</div>
      <div className="absolute top-1/3 right-1/4 text-rose-400 opacity-40 animate-bounce delay-1000">💖</div>

      <div className="relative z-10 w-full max-w-[900px] mx-auto text-center flex flex-col items-center px-2 sm:px-4">
        {/* Pulsing Lock Header */}
        <motion.div
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ repeat: Infinity, duration: 3 }}
          className="w-[60px] h-[60px] sm:w-20 sm:h-20 bg-purple-950/40 backdrop-blur-md border border-purple-500/30 shadow-[0_0_20px_rgba(168,85,247,0.25)] rounded-full flex items-center justify-center mb-8"
        >
          {showPasswordBox ? (
            <KeyRound className="w-6 h-6 sm:w-8 sm:h-8 text-fuchsia-400" />
          ) : (
            <Lock className="w-6 h-6 sm:w-8 sm:h-8 text-fuchsia-400 animate-pulse" />
          )}
        </motion.div>

        {/* Title */}
        <h1 
          className="font-serif text-purple-50 font-semibold mb-2 tracking-tight text-center"
          style={{ fontSize: "clamp(1.6rem, 5vw, 2.25rem)" }}
        >
          A Beautiful Surprise Awaits
        </h1>
        <p 
          className="font-sans text-purple-200/80 mb-6 max-w-sm leading-relaxed px-4 text-center animate-pulse"
          style={{ fontSize: "clamp(0.85rem, 3.5vw, 0.875rem)" }}
        >
          Something extremely magical is prepared for <span className="font-bold text-fuchsia-400">{BIRTHDAY_CONFIG.recipientName}</span>. Enter the passcode below to unlock...
        </p>

        {/* Action Controls Toggle - Passcode gate is directly rendered */}
        <AnimatePresence mode="wait">
          {showPasswordBox && (
            <motion.div
              key="password-gate-new"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-2xl bg-[#110521]/95 backdrop-blur-xl border border-purple-500/40 rounded-3xl shadow-[0_15px_45px_rgba(0,0,0,0.8)] overflow-hidden"
            >
              <div className="grid grid-cols-1 md:grid-cols-2">
                
                {/* Left Side: Gorgeous Cakes/Roses Cover with realistic candles */}
                <div className="relative bg-gradient-to-br from-purple-950/80 to-purple-900/50 p-6 flex flex-col justify-center items-center text-center border-b md:border-b-0 md:border-r border-purple-500/20">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(217,70,239,0.12)_0%,transparent_70%)] pointer-events-none" />
                  
                  {/* Polaroid Frame of Cake */}
                  <div className="bg-white p-3 pb-8 rounded-lg shadow-2xl rotate-[-2deg] max-w-[190px] mb-4 transform hover:rotate-[1deg] transition-all duration-500">
                    <div className="w-40 h-40 overflow-hidden rounded bg-purple-50 relative group">
                      <img 
                        src={BIRTHDAY_CONFIG.lockScreenPhoto} 
                        alt="Sweet Birthday"
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/25 to-transparent" />
                    </div>
                    <p className="font-serif text-[11px] text-neutral-800 font-bold mt-2.5">
                      "My Sweetest Devotion"
                    </p>
                  </div>

                  <p className="font-serif text-[13px] text-purple-100 max-w-[220px] leading-relaxed italic">
                    Every sweet candle lit represents a beautiful story we've lived. Input the lock code to read my memories...
                  </p>
                  <p className="font-mono text-[9px] text-fuchsia-400 mt-2 font-bold tracking-wider uppercase">
                    {BIRTHDAY_CONFIG.passwordHint}
                  </p>
                </div>

                {/* Right Side: Love PIN entry screen (1 to 9 heart buttons) */}
                <div className="p-6 flex flex-col items-center justify-between">
                  <div className="w-full text-center">
                    <span className="font-sans text-[10px] font-bold text-fuchsia-400 tracking-widest uppercase mb-1.5 block">
                      Secret Love Gate
                    </span>
                    <h3 className="font-serif text-base font-bold text-purple-50 mb-4">
                      Tap the Heart Keys
                    </h3>

                    {/* Masked Passcode visual screen */}
                    <div className="w-full h-11 bg-purple-950/40 rounded-xl border border-purple-500/25 flex items-center justify-center gap-1.5 px-4 mb-4">
                      {passwordInput.length === 0 ? (
                        <span className="text-purple-300/40 font-mono text-xs">Enter PIN...</span>
                      ) : (
                        Array.from(passwordInput).map((_, i) => (
                          <motion.span
                            key={i}
                            initial={{ scale: 0.3 }}
                            animate={{ scale: [1, 1.3, 1] }}
                            className="text-fuchsia-400 text-lg leading-none"
                          >
                            💖
                          </motion.span>
                        ))
                      )}
                    </div>

                    {/* Number error warning */}
                    {passwordError && (
                      <p className="text-[11px] text-rose-400 font-semibold mb-2 animate-pulse">
                        Incorrect Key. Try PIN "143"!
                      </p>
                    )}

                    {/* Keypad Grid (Numbers 1 to 9 inside Heart shapes!) */}
                    <div className="grid grid-cols-3 gap-y-3.5 gap-x-4 max-w-[210px] mx-auto mb-5">
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                        <button
                          key={num}
                          type="button"
                          onClick={() => {
                            if (passwordInput.length < 6) {
                              setPasswordInput((prev) => prev + num);
                            }
                          }}
                          className="relative w-14 h-14 flex items-center justify-center cursor-pointer group hover:scale-105 active:scale-95 transition-transform"
                        >
                          {/* Beautiful glowing background heart SVG */}
                          <svg
                            className="absolute inset-0 w-full h-full text-rose-500/80 fill-rose-500/80 drop-shadow-[0_2.5px_6px_rgba(244,63,94,0.4)] group-hover:text-fuchsia-500/90 group-hover:fill-fuchsia-500/90 transition-colors"
                            viewBox="0 0 24 24"
                          >
                            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                          </svg>

                          {/* Centered number overlying on top of the heart */}
                          <span className="relative z-10 font-bold text-purple-50 text-base font-serif filter drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]">
                            {num}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Keyboard actions: Backspace, Unlock */}
                  <div className="w-full flex gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        if (passwordInput.length > 0) {
                          setPasswordInput((prev) => prev.slice(0, -1));
                        }
                      }}
                      className="flex-1 py-2 text-purple-300 hover:text-white border border-purple-500/25 rounded-xl text-xs font-semibold hover:bg-purple-950/30 cursor-pointer transition-colors"
                    >
                      Backspace
                    </button>

                     <button
                      type="button"
                      onClick={() => {
                        // Check passcode
                        const cleanInput = passwordInput.trim();
                        if (cleanInput === "143" || cleanInput.toLowerCase() === BIRTHDAY_CONFIG.password.toLowerCase()) {
                          setPasswordError(false);
                          triggerCraftingSequence();
                        } else {
                          setPasswordError(true);
                          setPasswordInput("");
                          // Clear error message after 1.8 seconds
                          setTimeout(() => setPasswordError(false), 1800);
                        }
                      }}
                      className="flex-1 py-1.5 bg-gradient-to-r from-red-500 via-rose-500 to-fuchsia-600 hover:from-red-400 hover:to-fuchsia-500 text-white rounded-xl text-[11px] font-bold shadow-lg shadow-rose-950/50 flex items-center justify-center gap-1 hover:brightness-110 cursor-pointer transition-all active:scale-95"
                    >
                      Unlock Heart
                      <Unlock className="w-3 h-3" />
                    </button>
                  </div>
                </div>

              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mt-12 text-[11px] font-medium tracking-wider text-purple-400/80 uppercase flex items-center gap-1">
          <Heart className="w-3 h-3 fill-rose-500 text-rose-500 animate-pulse" />
          Prepared for a wonderful occasion
        </div>
      </div>

      {/* BEAUTIFUL FULLSCREEN GLASSMORPHIC SURPRISE CRAFTING OVERLAY */}
      <AnimatePresence>
        {isCrafting && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-neutral-950/95 backdrop-blur-2xl z-[999999] flex flex-col items-center justify-center p-6 text-center select-none"
          >
            {/* Swirling glow circles in background */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-fuchsia-500/10 rounded-full blur-[120px] pointer-events-none z-0" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200px] h-[200px] bg-rose-500/15 rounded-full blur-[80px] pointer-events-none z-0" />

            <div className="relative z-10 max-w-md w-full flex flex-col items-center justify-center space-y-6">
              
              {/* Elegant floating sparkle icon */}
              <motion.div
                animate={{ scale: [1, 1.15, 1], rotate: [0, 10, -10, 0] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="w-16 h-16 bg-rose-500/10 border border-rose-500/30 rounded-full flex items-center justify-center text-rose-500 shadow-[0_0_20px_rgba(244,63,94,0.2)]"
              >
                <Sparkles className="w-8 h-8 text-fuchsia-400 animate-pulse" />
              </motion.div>

              {/* Heart Warming Headline */}
              <div className="space-y-2">
                <h1 className="font-serif text-2xl md:text-3xl text-purple-100 font-extrabold tracking-tight leading-tight">
                  Wait, something special crafting for you...
                </h1>
                <p className="font-sans text-xs text-purple-300/80 max-w-xs mx-auto">
                  Assembling magical memories, lovely tunes, and warm whispers.
                </p>
              </div>

              {/* Huge dynamic 3D scaling timer */}
              <div className="relative w-28 h-28 flex items-center justify-center mt-4">
                {/* Rotating decorative glowing halo */}
                <div className="absolute inset-0 rounded-full border-2 border-dashed border-fuchsia-500/40 animate-spin" style={{ animationDuration: "12s" }} />
                
                <AnimatePresence mode="wait">
                  <motion.span
                    key={craftingSeconds}
                    initial={{ scale: 0.3, opacity: 0, rotate: -20 }}
                    animate={{ scale: 1, opacity: 1, rotate: 0 }}
                    exit={{ scale: 1.6, opacity: 0, rotate: 20 }}
                    transition={{ type: "spring", stiffness: 200, damping: 15 }}
                    className="font-sans font-black text-6xl md:text-7xl text-white drop-shadow-[0_0_35px_rgba(236,72,153,0.85)]"
                  >
                    {craftingSeconds}
                  </motion.span>
                </AnimatePresence>
              </div>

              {/* Loving message at the bottom */}
              <p className="font-mono text-[9px] uppercase tracking-[0.25em] text-fuchsia-400 font-bold animate-pulse">
                Surprise loading. Ready for takeoff...
              </p>

            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* BEAUTIFUL MODAL: CUSTOMIZE TARGET BIRTHDAY */}
      <AnimatePresence>
        {isEditingDate && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-neutral-950/80 backdrop-blur-md z-[999999] flex items-center justify-center p-4 select-none"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="bg-[#120522]/95 border-2 border-purple-500/30 rounded-3xl p-6 w-full max-w-sm shadow-[0_15px_45px_rgba(0,0,0,0.8)] relative"
            >
              <h3 className="font-serif text-lg font-bold text-fuchsia-300 mb-2 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-fuchsia-400" />
                Customize Birthday
              </h3>
              <p className="font-sans text-xs text-purple-350 leading-relaxed mb-4">
                Set the month, day, and year of the celebration. The surprise will automatically unlock exactly at <span className="text-fuchsia-300 font-bold">12:00 AM (midnight)</span> on this date!
              </p>

              <div className="space-y-4 text-left">
                {/* Month Selector */}
                <div>
                  <label className="block text-[10px] font-mono font-bold uppercase tracking-wider text-purple-400 mb-1.5">
                    Select Month
                  </label>
                  <select
                    value={editMonth}
                    onChange={(e) => setEditMonth(Number(e.target.value))}
                    className="w-full bg-purple-950/60 border border-purple-500/30 rounded-xl px-3 py-2 text-sm text-purple-100 outline-none focus:border-fuchsia-500 cursor-pointer"
                  >
                    {[
                      "January", "February", "March", "April", "May", "June",
                      "July", "August", "September", "October", "November", "December"
                    ].map((m, idx) => (
                      <option key={m} value={idx + 1} className="bg-[#120522]">
                        {m}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Day & Year Input */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-mono font-bold uppercase tracking-wider text-purple-400 mb-1.5">
                      Select Day
                    </label>
                    <select
                      value={editDay}
                      onChange={(e) => setEditDay(Number(e.target.value))}
                      className="w-full bg-purple-950/60 border border-purple-500/30 rounded-xl px-3 py-2 text-sm text-purple-100 outline-none focus:border-fuchsia-500 cursor-pointer"
                    >
                      {Array.from({ length: 31 }, (_, i) => i + 1).map((d) => (
                        <option key={d} value={d} className="bg-[#120522]">
                          {d}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono font-bold uppercase tracking-wider text-purple-400 mb-1.5">
                      Select Year
                    </label>
                    <input
                      type="number"
                      value={editYear}
                      onChange={(e) => setEditYear(Number(e.target.value))}
                      min={2026}
                      max={2035}
                      className="w-full bg-purple-950/60 border border-purple-500/30 rounded-xl px-3 py-2 text-sm text-purple-100 outline-none focus:border-fuchsia-500 font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2.5 mt-6">
                <button
                  onClick={() => setIsEditingDate(false)}
                  className="flex-1 py-2 rounded-xl border border-purple-500/25 text-purple-300 hover:text-white text-xs font-bold hover:bg-purple-950/30 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    handleSaveCustomDate(editMonth, editDay, editYear);
                  }}
                  className="flex-1 py-2 bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-500 hover:to-fuchsia-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-fuchsia-950/50 cursor-pointer"
                >
                  Set Target 💖
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
