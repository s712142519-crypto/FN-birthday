import React, { useState, useEffect } from "react";
import { BIRTHDAY_CONFIG } from "../config";
import { ArrowLeft, Sparkles, Mail, Heart, BookOpen, RotateCcw } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface MessageSectionProps {
  onBack: () => void;
  onNavigateToPhotos: () => void;
}

export default function MessageSection({ onBack, onNavigateToPhotos }: MessageSectionProps) {
  const [isSealedEnvelope, setIsSealedEnvelope] = useState(true);
  const [redirectCountdown, setRedirectCountdown] = useState<number | null>(null);

  useEffect(() => {
    if (!isSealedEnvelope) {
      try {
        localStorage.setItem("message_seen", "true");
      } catch (e) {
        console.error(e);
      }
    }
  }, [isSealedEnvelope]);

  // Countdown timer effect
  useEffect(() => {
    if (redirectCountdown === null) return;
    
    if (redirectCountdown === 0) {
      sessionStorage.setItem("auto_video_triggered", "true");
      onNavigateToPhotos();
      return;
    }
    
    const timer = setTimeout(() => {
      setRedirectCountdown(prev => (prev !== null ? prev - 1 : null));
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [redirectCountdown, onNavigateToPhotos]);

  // Web Audio Synth for satisfying premium wax seal "breaking" or "pop" sound effect when breaking the seal
  const playPopSound = () => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = "sine";
      osc.frequency.setValueAtTime(450, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(80, ctx.currentTime + 0.15);
      
      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.start();
      osc.stop(ctx.currentTime + 0.18);
    } catch (e) {
      // Browser prevents unauthorized audio initialization. Failing gracefully is fine.
    }
  };

  const handleBreakSeal = () => {
    playPopSound();
    setIsSealedEnvelope(false);
  };

  return (
    <div
      id="message-section"
      className="relative min-h-screen w-full flex flex-col justify-between py-8 px-4 md:px-8 select-none overflow-y-auto"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-neutral-950 via-[#0a0214] to-[#040108] z-0 animate-fade-in" />

      {/* Header Controller */}
      <header className="relative z-10 w-full max-w-5xl mx-auto flex items-center justify-between pointer-events-auto">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-4 py-2 bg-purple-900/30 hover:bg-purple-900/60 text-purple-200 rounded-full text-xs font-bold border border-purple-500/20 shadow-lg cursor-pointer hover:scale-105 active:scale-95 transition-all"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Hub
        </button>
        <span className="font-mono text-[10px] bg-purple-950/70 border border-purple-500/20 text-purple-300 font-bold px-3 py-1 rounded-full flex items-center gap-1">
          <BookOpen className="w-3.5 h-3.5 text-fuchsia-400" />
          Interactive Letter Seal
        </span>
      </header>

      {/* Primary Dynamic State Card */}
      <div className="relative z-10 w-full max-w-3xl mx-auto flex-1 flex items-center justify-center py-6">
        <AnimatePresence mode="wait">
          {isSealedEnvelope ? (
            /* WAX ENVELOPE SEAL SCREEN */
            <motion.div
              key="sealed-envelope"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="w-full max-w-lg bg-purple-950/30 backdrop-blur-md border border-purple-500/20 p-6 md:p-8 rounded-3xl shadow-2xl flex flex-col items-center text-center"
            >
              <div className="mb-6 md:mb-8">
                <span className="font-mono text-[9px] tracking-widest text-[#d946ef] font-bold bg-purple-900/40 border border-purple-505/20 px-3 py-0.5 rounded-full inline-flex items-center gap-1.5 uppercase">
                  <Sparkles className="w-3.5 h-3.5 text-fuchsia-400" />
                  Your Surprise Letter
                </span>
                <h2 className="font-serif text-2xl md:text-3xl font-bold text-purple-100 mt-2">
                  Unseal My Confession
                </h2>
                <p className="font-sans text-xs text-purple-200/70 mt-1.5 max-w-sm mx-auto">
                  Click on the hand-poured heart wax seal to break open the custom romantic envelope.
                </p>
              </div>

              {/* Envelope Paper Model */}
              <div
                onClick={handleBreakSeal}
                className="group relative bg-[#130722]/80 border-2 border-purple-500/20 shadow-xl hover:shadow-[0_0_25px_rgba(168,85,247,0.3)] w-full max-w-sm h-64 p-6 rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-all duration-300 hover:scale-103 hover:-rotate-1"
              >
                {/* Envelope fold overlays */}
                <div className="absolute top-0 inset-x-0 h-4 bg-purple-500/5 border-b border-purple-500/10 rounded-t-2xl pointer-events-none" />

                <div className="text-center z-10 flex flex-col items-center select-none">
                  <Mail className="w-12 h-12 text-fuchsia-400 mb-4 group-hover:scale-115 transition-transform duration-350" />
                  <p className="font-serif text-xs italic text-purple-300 font-semibold mb-1">
                    Specifically hand stamped for
                  </p>
                  <p className="font-sans text-lg font-bold text-purple-50 tracking-wide mb-6">
                    {BIRTHDAY_CONFIG.recipientName}
                  </p>

                  {/* Pulsing customizable wax stamp button */}
                  <motion.div
                    animate={{ scale: [1, 1.08, 1] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="w-14 h-14 bg-rose-600 rounded-full flex items-center justify-center border-3 border-[#fbcfe8] shadow-lg group-hover:rotate-12 transition-transform relative"
                  >
                    <Heart className="w-6 h-6 fill-white text-white" />
                    {/* Pulsing glow ring */}
                    <span className="absolute -inset-1 border border-rose-500/45 rounded-full pointer-events-none animate-ping" />
                  </motion.div>
                </div>
              </div>
            </motion.div>
          ) : (
            /* LOVE LETTER CARD SCREEN */
            <motion.div
              key="love-letter"
              initial={{ opacity: 0, y: 40, rotate: 0.5 }}
              animate={{ opacity: 1, y: 0, rotate: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ type: "spring", stiffness: 95 }}
              className="w-full max-w-2xl bg-[#140b24]/90 border-2 border-purple-500/30 shadow-2xl rounded-3xl p-6 md:p-10 relative leading-relaxed text-purple-100 max-h-[75vh] overflow-y-auto"
            >
              {/* Scroll Ribbon Header */}
              <div className="border-b border-purple-500/20 pb-5 mb-5">
                <h1 className="font-cursive text-3.5xl md:text-5xl text-fuchsia-300 drop-shadow-[0_0_8px_rgba(217,70,239,0.4)]">
                  {BIRTHDAY_CONFIG.loveLetter.title}
                </h1>
                <p className="font-mono text-[9px] text-purple-400 uppercase tracking-widest mt-1">
                  Sent with endless warmth &bull; {new Date().toLocaleDateString(undefined, {month: 'long', day: 'numeric', year: 'numeric'})}
                </p>
              </div>

              {/* Romantic Main letter lines */}
              <div className="space-y-4 md:space-y-5 font-serif text-sm md:text-[15px] text-purple-100/90 leading-relaxed md:leading-loose text-justify indent-4">
                {BIRTHDAY_CONFIG.loveLetter.paragraphs.map((paragraph, idx) => (
                  <p key={idx} className="hover:text-fuchsia-300 transition-colors duration-250">
                    {paragraph}
                  </p>
                ))}
              </div>

              {/* Tender Love Sign-off */}
              <div className="mt-8 pt-6 border-t border-purple-500/20 flex flex-col items-end">
                <p className="font-sans text-[10px] font-semibold text-fuchsia-400 tracking-wider uppercase mb-1">
                  Yours Forever,
                </p>
                <p className="font-cursive text-3xl text-rose-400 font-bold drop-shadow-[0_0_5px_rgba(244,63,94,0.3)]">
                  {BIRTHDAY_CONFIG.loveLetter.signature}
                </p>
              </div>

              {/* Navigation links */}
              <div className="mt-8 pt-4 flex justify-center">
                <button
                  onClick={onBack}
                  className="px-8 py-3.5 rounded-full bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-500 hover:to-fuchsia-500 text-white shadow-xl cursor-pointer text-xs font-bold transition-all hover:scale-102 active:scale-95 text-center min-w-[180px]"
                >
                  Return to Hub
                </button>
              </div>

              {/* Countdown Overlay for Redirecting to Cinema */}
              <AnimatePresence>
                {redirectCountdown !== null && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-[#070110]/95 flex flex-col items-center justify-center p-6 text-center z-50 rounded-3xl backdrop-blur-md"
                  >
                    <motion.div
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ repeat: Infinity, duration: 1.5 }}
                      className="w-16 h-16 bg-fuchsia-500/10 border border-fuchsia-500/30 rounded-full flex items-center justify-center mb-6 text-fuchsia-400 shadow-lg"
                    >
                      <Sparkles className="w-8 h-8 text-fuchsia-400 animate-pulse" />
                    </motion.div>
                    
                    <h3 className="font-serif text-xl md:text-2xl text-fuchsia-300 font-extrabold mb-2 tracking-wide">
                      Something Magical is Beginning... ✨
                    </h3>
                    <p className="font-sans text-xs text-purple-200/80 max-w-xs mx-auto mb-6">
                      You have unlocked all our precious birthday chapters! Starting your special cinematic surprise in...
                    </p>
                    
                    <div className="w-20 h-20 rounded-full border-4 border-rose-500 flex items-center justify-center bg-rose-500/5 shadow-[0_0_20px_rgba(244,63,94,0.3)]">
                      <span className="font-sans font-black text-4xl text-rose-300">
                        {redirectCountdown}
                      </span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Decorative Spacer */}
      <div className="h-4" />
    </div>
  );
}
