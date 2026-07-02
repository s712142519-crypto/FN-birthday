import React, { useRef, useState, useEffect } from "react";
import { BIRTHDAY_CONFIG } from "../config";
import { Sparkles, Play, Volume2, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface IntroVideoScreenProps {
  onFinished: () => void;
}

export default function IntroVideoScreen({ onFinished }: IntroVideoScreenProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const [isBuffering, setIsBuffering] = useState(true);
  const [videoSrc, setVideoSrc] = useState<string>(BIRTHDAY_CONFIG.video.filePath);

  useEffect(() => {
    // Add video-active state to body to clear snow overlay
    document.body.classList.add("video-active");

    return () => {
      document.body.classList.remove("video-active");
    };
  }, []);

  // When video source changes, reload and play
  useEffect(() => {
    if (!videoSrc) return;

    // Attempt autoplay immediately
    const playVideo = async () => {
      if (videoRef.current) {
        try {
          // Explicitly call load to apply the source change immediately
          videoRef.current.load();
          videoRef.current.muted = false;
          await videoRef.current.play();
          setIsPlaying(true);
          setIsBuffering(false);
        } catch (err) {
          console.log("Autoplay unmuted blocked, attempting muted...", err);
          if (videoRef.current) {
            try {
              videoRef.current.muted = true;
              await videoRef.current.play();
              setIsPlaying(true);
              setIsBuffering(false);
            } catch (muteErr) {
              console.warn("Muted autoplay blocked (expected in non-interactive/headless runtimes):", muteErr);
              setIsBuffering(false);
            }
          }
        }
      }
    };

    // Small timeout to allow element to load
    const timer = setTimeout(() => {
      playVideo();
    }, 150);

    return () => {
      clearTimeout(timer);
    };
  }, [videoSrc]);

  const handleManualPlay = () => {
    if (videoRef.current) {
      videoRef.current.muted = false;
      videoRef.current.play()
        .then(() => {
          setIsPlaying(true);
          setIsBuffering(false);
        })
        .catch((err) => {
          console.warn("Manual play failed:", err);
          setVideoError(true);
        });
    }
  };

  return (
    <div
      id="intro-video-container"
      className="fixed inset-0 w-full h-full bg-black z-[999999] flex flex-col items-center justify-center select-none overflow-hidden"
    >
      <div className="relative w-full h-full flex items-center justify-center">
        {/* The Cinema video player */}
        {videoSrc && (
          <video
            ref={videoRef}
            className="w-full h-full object-contain bg-black"
            autoPlay
            playsInline
            src={videoSrc}
            onPlay={() => {
              setIsPlaying(true);
              setIsBuffering(false);
            }}
            onPlaying={() => {
              setIsPlaying(true);
              setIsBuffering(false);
            }}
            onWaiting={() => setIsBuffering(true)}
            onCanPlay={() => setIsBuffering(false)}
            onEnded={onFinished}
            onError={() => {
              if (videoSrc !== BIRTHDAY_CONFIG.video.fallbackUrl) {
                setVideoSrc(BIRTHDAY_CONFIG.video.fallbackUrl);
              } else {
                setVideoError(true);
                setIsBuffering(false);
              }
            }}
          />
        )}

        {/* Elegant loading spinner overlay or touch-to-play fallback if autoplay was blocked */}
        <AnimatePresence>
          {(!isPlaying || isBuffering) && (
            <motion.div
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="absolute inset-0 bg-black/90 backdrop-blur-sm z-50 flex flex-col items-center justify-center text-center p-6 space-y-6"
            >
              {isBuffering && !videoError ? (
                <div className="flex flex-col items-center space-y-4">
                  <div className="relative w-14 h-14 flex items-center justify-center">
                    <span className="absolute inset-0 rounded-full border-2 border-fuchsia-500/15 border-t-fuchsia-500 animate-spin" />
                    <Sparkles className="w-5 h-5 text-fuchsia-400 animate-pulse" />
                  </div>
                  <span className="font-mono text-[10px] text-fuchsia-400 font-bold uppercase tracking-[0.25em] animate-pulse">
                    Preparing Memory Cinema...
                  </span>
                </div>
              ) : (
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="flex flex-col items-center space-y-5 max-w-sm"
                >
                  <motion.button
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleManualPlay}
                    className="w-16 h-16 rounded-full bg-gradient-to-tr from-fuchsia-500 to-rose-500 flex items-center justify-center text-white shadow-[0_0_30px_rgba(236,72,153,0.5)] cursor-pointer"
                  >
                    <Play className="w-7 h-7 fill-white translate-x-0.5" />
                  </motion.button>
                  <h3 className="font-serif text-lg text-neutral-100 font-bold">
                    Tap to Play Your Birthday Surprise
                  </h3>
                  <p className="font-sans text-xs text-neutral-400 max-w-xs leading-relaxed">
                    Unmute your volume to experience the romantic memory reel created for you.
                  </p>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Quick Helper hint on bottom when playing */}
        {isPlaying && (
          <p className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 font-sans text-[10px] text-neutral-400/80 tracking-wider flex items-center gap-1.5 backdrop-blur-md bg-black/40 px-3.5 py-1.5 rounded-full">
            <Volume2 className="w-3.5 h-3.5 text-fuchsia-400 animate-pulse" />
            Playing unmuted surprise cinema.
          </p>
        )}

        {/* Skip Intro upper-right corner absolute anchor */}
        <button
          onClick={onFinished}
          className="absolute top-6 right-6 z-[1000000] px-4.5 py-2.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-extrabold cursor-pointer transition-all flex items-center gap-1.5 backdrop-blur-md hover:scale-105 active:scale-95"
        >
          Skip Intro
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
