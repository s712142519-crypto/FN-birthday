import React, { useState, useRef, useEffect } from "react";
import { BIRTHDAY_CONFIG } from "../config";
import { ArrowLeft, Play, Pause, Disc, Volume2, Sparkles, HeartCrack, Smile, Flame, Radio } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface Song {
  id: string;
  title: string;
  artist: string;
  filePath: string;
  fallbackUrl: string;
}

interface MusicSectionProps {
  onBack: () => void;
}

interface LyricLine {
  time: number; // in seconds
  text: string;
}

// Gorgeous romantic hand-curated lofi timestamped lyrics for all 8 custom songs!
const SONG_LYRICS: Record<string, LyricLine[]> = {
  h1: [
    { time: 0, text: "🎵 (Warm, vintage lo-fi vinyl beats start rolling...) 🎵" },
    { time: 4, text: "Walking down the avenue, thinking of your gorgeous smile..." },
    { time: 10, text: "Every single mile is sweeter, when we chat a little while." },
    { time: 16, text: "I'm lovin' this life so much with you right by my side," },
    { time: 22, text: "No more secrets to keep, no more reasons to hide." },
    { time: 28, text: "✨ You are the sweet coffee to my morning sunrise ✨" },
    { time: 35, text: "Happy birthday, my angel, my endless summer skies!" },
    { time: 42, text: "🎷 (Relaxing jazzy saxophone solo humming softly...) 🎷" },
    { time: 50, text: "Holding your warm hand, watching the world float away..." },
    { time: 58, text: "I hope this little birthday melody brightens your day!" },
    { time: 66, text: "🎵 (Lofi drums fading back into cozy sweet rhythm) 🎵" }
  ],
  h2: [
    { time: 0, text: "🎸 (Gentle acoustic guitar strings strumming in...) 🎸" },
    { time: 5, text: "Golden sunbeams dancing on the wooden kitchen floor..." },
    { time: 11, text: "I never knew my heart could ever ask for anything more." },
    { time: 18, text: "You bring the warmth of summer to the coldest winter night," },
    { time: 25, text: "Everything is golden, everything is perfectly bright." },
    { time: 31, text: "☀️ You're my warm sunshine, glowing from high above ☀️" },
    { time: 38, text: "Filling up my entire universe with everlasting pure love." },
    { time: 45, text: "🎵 (Sweet acoustic strings sliding and glowing...) 🎵" }
  ],
  h3: [
    { time: 0, text: "🎶 (Bubbly, light ukulele chords plucking along...) 🎶" },
    { time: 4, text: "My heart goes bubble-pop whenever you walk near," },
    { time: 9, text: "All the silly little worries simply float away and disappear!" },
    { time: 14, text: "Like a happy little tune ringing out in the morning breeze," },
    { time: 19, text: "You make me glide as light as the gold autumn leaves." },
    { time: 24, text: "💖 Bubbly hearts and laughing eyes of solid gold 💖" },
    { time: 30, text: "You are the sweetest, safest hand I will ever hold!" },
    { time: 36, text: "🎵 (Cheerful whistling lofi rhythm fading out...) 🎵" }
  ],
  s1: [
    { time: 0, text: "🎹 (Rain background sound with slow, gentle piano keys...) 🎹" },
    { time: 6, text: "Raindrops tapping softly on our foggy window pane," },
    { time: 12, text: "But inside my cozy heart, there's no trace of storm or rain." },
    { time: 19, text: "Sipping sweet tea together under wool blankets, cozy and warm," },
    { time: 26, text: "Holding you so closely, shielded from the heavy storm." },
    { time: 33, text: "🌧️ Even on a rainy afternoon, you make my spirit bloom 🌧️" },
    { time: 41, text: "Your lovely smile is a candle, chasing out all the gloom." }
  ],
  s2: [
    { time: 0, text: "🎸 (Mellow, deeply reflective solitary guitar plucking...) 🎸" },
    { time: 6, text: "Thousands of miles may lie between us, shadows on the wall," },
    { time: 12, text: "But our love is stronger than any distance, after all." },
    { time: 19, text: "I close my eyes and feel you here, breathing in the quiet dark," },
    { time: 26, text: "Across the empty space, you left an everlasting, glowing spark." },
    { time: 34, text: "🌌 Distance is just a number, you are forever in my soul 🌌" },
    { time: 42, text: "Thinking of your warm embrace, making my broken heart whole." }
  ],
  s3: [
    { time: 0, text: "🎵 (Dreamy, nostalgic retro lofi synth pads echoing...) 🎵" },
    { time: 5, text: "Faded pictures of us on the beach, laughing in the sea breeze..." },
    { time: 11, text: "Tracing all our sweet memories under the quiet green trees." },
    { time: 18, text: "Every little vintage Polaroid is painted with your lovely grace," },
    { time: 25, text: "Time can never fade the beauty of your sweet, gentle face." },
    { time: 32, text: "💫 Dreamy loops of yesterday repeating in my head 💫" },
    { time: 39, text: "Forever keeping every single promise that we ever said." }
  ],
  a1: [
    { time: 0, text: "🌊 (Heavy ocean thunder and soft rain lofi beat rolling in...) 🌊" },
    { time: 5, text: "Stormy seas and crashing waves, cold winds begin to blow," },
    { time: 11, text: "But you are my safe harbor, the strong anchor down below." },
    { time: 18, text: "When the loud thunder rolls and dark clouds gather up on high," },
    { time: 24, text: "You are the lightning-bug guiding me through the dark night sky." },
    { time: 31, text: "⚡ We can brave the wild seas, we will never drift apart ⚡" },
    { time: 38, text: "Your steady, loving heartbeat is the captain of my heart." }
  ],
  a2: [
    { time: 0, text: "🥁 (Intense, heavy lofi electronic bass rumble drumming...) 🥁" },
    { time: 5, text: "Rumble of the heavy city noise, concrete roads all around," },
    { time: 11, text: "But in your quiet, gentle eyes, the sweetest peace is found." },
    { time: 18, text: "Let the entire world be loud, let the mountains shake and shake," },
    { time: 24, text: "You are the single best decision I would ever make." },
    { time: 31, text: "🔥 Burning bright like starlight through the hazy, dusty street 🔥" },
    { time: 38, text: "Every single pulse of mine skipping when our glances meet." }
  ]
};

export default function MusicSection({ onBack }: MusicSectionProps) {
  const allSongs = BIRTHDAY_CONFIG.songs || [];

  const [currentSong, setCurrentSong] = useState<Song>(allSongs[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [isStreamingFallback, setIsStreamingFallback] = useState(false);
  const [showTracklist, setShowTracklist] = useState(true);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Play another track
  const handleSongSelect = (song: Song) => {
    setCurrentSong(song);
    setIsStreamingFallback(false);
    setIsPlaying(true);

    // Tiny delay to allow source to rebind before firing play
    setTimeout(() => {
      if (audioRef.current) {
        audioRef.current.load();
        audioRef.current.play()
          .then(() => setIsPlaying(true))
          .catch((err: any) => console.log("Play interrupted or waiting for user interaction:", err));
      }
    }, 50);
  };

  // Toggle Play State
  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play()
        .then(() => setIsPlaying(true))
        .catch(() => {
          // If local fails immediately, toggle fallback
          setIsStreamingFallback(true);
          if (audioRef.current) {
            audioRef.current.src = currentSong.fallbackUrl;
            audioRef.current.load();
            audioRef.current.play().then(() => setIsPlaying(true));
          }
        });
    }
  };

  // Skip Tracks in Playlist
  const handleSkip = (direction: "forward" | "backward") => {
    const list = allSongs;
    const currentIndex = list.findIndex((s) => s.id === currentSong.id);
    let nextIndex = currentIndex;

    if (direction === "forward") {
      nextIndex = (currentIndex + 1) % list.length;
    } else {
      nextIndex = (currentIndex - 1 + list.length) % list.length;
    }
    handleSongSelect(list[nextIndex]);
  };

  // Audio Event Bindings
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => {
      setCurrentTime(audio.currentTime);
    };

    const updateDuration = () => {
      setDuration(audio.duration || 0);
    };

    const handleEnded = () => {
      // Auto skip to next song on completion!
      handleSkip("forward");
    };

    const handleError = () => {
      // If error occurs (e.g. file is missing locally), load the backup stream link
      if (!isStreamingFallback) {
        console.warn("Local path not fully responsive. Loading fallback premium stream...", currentSong.filePath);
        setIsStreamingFallback(true);
        audio.src = currentSong.fallbackUrl;
        audio.load();
        if (isPlaying) {
          audio.play().catch((e: any) => console.log("Fallback stream started silently:", e));
        }
      }
    };

    audio.addEventListener("timeupdate", updateTime);
    audio.addEventListener("durationchange", updateDuration);
    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("error", handleError);

    // Sync volume multiplier
    audio.volume = volume;

    return () => {
      audio.removeEventListener("timeupdate", updateTime);
      audio.removeEventListener("durationchange", updateDuration);
      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener("error", handleError);
    };
  }, [currentSong, isPlaying, isStreamingFallback, allSongs, volume]);

  // Sync volume slider updates
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (audioRef.current) {
      audioRef.current.volume = val;
    }
  };

  // Format digital timers
  const formatTime = (secs: number) => {
    if (isNaN(secs)) return "0:00";
    const minutes = Math.floor(secs / 60);
    const seconds = Math.floor(secs % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  // Set the correct source path (use local path normally, fallback URL if toggled)
  const currentMediaSource = isStreamingFallback ? currentSong.fallbackUrl : currentSong.filePath;

  // Jump audio directly to a clicked lyric line's timestamp
  const handleLyricLineClick = (time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
      if (!isPlaying) {
        audioRef.current.play()
          .then(() => setIsPlaying(true))
          .catch(() => {});
      }
    }
  };

  return (
    <div
      id="music-section-container"
      className="relative min-h-screen w-full flex flex-col justify-between py-8 px-4 md:px-8 select-none"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-neutral-950 via-[#0a0214] to-[#040108] z-0 animate-fade-in" />

      {/* Audio Engine */}
      <audio ref={audioRef} src={currentMediaSource} preload="auto" />

      {/* Upper Navigation Header */}
      <header className="relative z-10 w-full max-w-6xl mx-auto flex items-center justify-between pointer-events-auto">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-4 py-2 bg-purple-900/30 hover:bg-purple-900/60 text-purple-200 rounded-full text-xs font-bold border border-purple-500/20 shadow-md cursor-pointer hover:scale-105 active:scale-95 transition-all"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Hub
        </button>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowTracklist(!showTracklist)}
            className="flex items-center gap-2 px-4 py-2 bg-fuchsia-950/40 hover:bg-fuchsia-900/60 text-fuchsia-300 rounded-full text-xs font-bold border border-fuchsia-500/25 shadow-md cursor-pointer hover:scale-105 active:scale-95 transition-all"
          >
            <Disc className={`w-3.5 h-3.5 ${isPlaying ? "animate-spin" : ""}`} />
            {showTracklist ? "Hide Tracklist" : "Show Tracklist"}
          </button>
          <span className="hidden sm:flex font-mono text-[10px] bg-purple-950/70 border border-purple-500/20 text-purple-300 font-bold px-3 py-1 rounded-full items-center gap-1">
            <Sparkles className="w-3" />
            Vintage Lofi Deck
          </span>
        </div>
      </header>

      {/* Main Music Layout Container */}
      <div
        id="vintage-music-row"
        className="relative z-10 w-full max-w-5xl mx-auto grid grid-cols-1 landscape:grid-cols-12 md:grid-cols-12 gap-6 landscape:gap-4 md:gap-8 my-auto items-center py-4 landscape:py-2"
      >
        {/* Retro Tape Player - Left side */}
        <div className={showTracklist ? "col-span-1 landscape:col-span-5 md:col-span-5 flex flex-col items-center w-full" : "col-span-12 flex flex-col items-center w-full max-w-sm mx-auto"}>
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`w-full max-w-sm bg-gradient-to-b from-[#1b0a2c] to-[#120520] text-purple-100 rounded-3xl p-6 shadow-2xl border-4 border-purple-950/80 shadow-purple-950/30 ${!showTracklist ? "md:scale-110 md:my-6 transition-transform duration-300" : ""}`}
          >
            {/* Cassette Title Rim */}
            <div className="flex justify-between items-center mb-6">
              <span className="font-mono text-[9px] text-[#c084fc] uppercase tracking-widest font-bold">
                Tape Side-A
              </span>
              <div className="flex items-center gap-1.5 bg-purple-950/90 px-2.5 py-0.5 rounded-md border border-purple-500/20">
                <span className={`w-1.5 h-1.5 rounded-full ${isPlaying ? "bg-red-500 animate-ping" : "bg-neutral-600"}`} />
                <span className="font-mono text-[9px] text-purple-300 font-semibold">
                  {isPlaying ? "PLAY" : "PAUSED"}
                </span>
              </div>
            </div>

            {/* Vintage Cassette Tape Model */}
            <div className="bg-gradient-to-r from-purple-900 via-purple-700 to-purple-900 rounded-2xl p-4 shadow-inner border border-purple-500/35 mb-6 relative overflow-hidden">
              <div className="absolute top-0 inset-x-0 h-1.5 bg-fuchsia-500/20" />

              {/* Tape Center Bracket */}
              <div className="bg-[#120521] rounded-xl p-3 border-2 border-[#090212] shadow-md">
                <div className="flex justify-between items-center px-4 relative">
                  {/* Left Sprocket Cogwheel */}
                  <div className="relative">
                    <div className="w-10 h-10 rounded-full bg-purple-950 border-4 border-purple-800 flex items-center justify-center relative shadow-inner">
                      <div className={`w-6 h-6 rounded-full border-2 border-dashed border-purple-300 absolute ${isPlaying ? "spin-tape-left" : ""}`} />
                      <div className="w-2.5 h-2.5 rounded-full bg-neutral-950 absolute" />
                    </div>
                  </div>

                  {/* Clear Transparent Window displaying actual tape roll */}
                  <div className="flex-1 h-8 mx-2 bg-neutral-950 rounded border border-purple-950 flex items-center justify-center overflow-hidden relative">
                    <div className="absolute inset-y-0 left-1 bg-purple-500/10 w-1/3 blur-xs" />
                    {/* Simulated remaining tape mesh */}
                    <div className="w-12 h-6 rounded-full bg-purple-800/20 border border-purple-500/10 animate-pulse" />
                  </div>

                  {/* Right Sprocket Cogwheel */}
                  <div className="relative">
                    <div className="w-10 h-10 rounded-full bg-purple-950 border-4 border-purple-800 flex items-center justify-center relative shadow-inner">
                      <div className={`w-6 h-6 rounded-full border-2 border-dashed border-purple-300 absolute ${isPlaying ? "spin-tape-right" : ""}`} />
                      <div className="w-2.5 h-2.5 rounded-full bg-neutral-950 absolute" />
                    </div>
                  </div>
                </div>

                {/* Cassette Label Plate */}
                <div className="mt-3 text-center">
                  <div className="font-serif text-[11px] font-semibold text-fuchsia-300 truncate tracking-wide bg-[#21103b]/80 py-0.5 px-2 rounded border border-purple-500/10">
                    {currentSong.title}
                  </div>
                  <div className="font-mono text-[9px] text-purple-300/80 truncate mt-0.5">
                    {currentSong.artist}
                  </div>
                </div>

                {/* Vintage Tape Indicator */}
                <div className="mt-2.5 bg-black/60 py-1.5 px-2 rounded border border-purple-500/15 h-8 flex items-center justify-center overflow-hidden">
                  <p className="font-sans text-[8.5px] text-fuchsia-300 italic font-medium truncate text-center px-1 animate-pulse">
                    Playing sweet lofi melodies with love... 💜
                  </p>
                </div>
              </div>
            </div>

            {/* LCD Progress Screen */}
            <div className="bg-neutral-950 border border-purple-500/15 rounded-2xl p-4 font-mono text-purple-200 shadow-inner mb-6">
              <div className="flex justify-between text-[11px] mb-2.5 text-fuchsia-400 font-bold">
                <span className="flex items-center gap-1">
                  <Disc className={`w-3.5 h-3.5 ${isPlaying ? "animate-spin" : ""}`} />
                  TRACK INDEX
                </span>
                <span className="flex items-center gap-1">
                  {isStreamingFallback ? (
                    <span className="inline-flex items-center gap-1 text-[9px] bg-amber-500/20 text-amber-300 px-1.5 py-0.2 rounded border border-amber-500/30 font-bold">
                      <Radio className="w-3 h-3 animate-pulse text-amber-400" />
                      STREAM CUE
                    </span>
                  ) : (
                    <span className="text-[10px] text-fuchsia-400 font-bold">LOCAL MP3</span>
                  )}
                </span>
              </div>

              {/* Progress Slider */}
              <input
                type="range"
                min="0"
                max={duration || 100}
                value={currentTime}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  const val = parseFloat(e.target.value);
                  setCurrentTime(val);
                  if (audioRef.current) {
                    audioRef.current.currentTime = val;
                  }
                }}
                className="w-full accent-fuchsia-500 h-1 bg-purple-950 rounded-lg cursor-pointer appearance-none outline-none mb-1.5"
              />

              <div className="flex justify-between text-[10px] text-purple-300">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>

            {/* Controller Buttons Panel */}
            <div className="grid grid-cols-3 gap-2.5 mb-6">
              <button
                onClick={() => handleSkip("backward")}
                className="py-2.5 bg-[#25153b] hover:bg-[#341d52] text-purple-200 rounded-xl font-bold flex flex-col items-center justify-center transition-all cursor-pointer active:scale-95 border border-purple-500/10"
              >
                <span className="text-xs tracking-wider">PREV</span>
              </button>
              
              <button
                onClick={togglePlay}
                className="py-2.5 bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-500 hover:to-fuchsia-500 text-white rounded-xl font-bold flex items-center justify-center transition-all cursor-pointer shadow-md hover:shadow-lg active:scale-95"
              >
                {isPlaying ? <Pause className="w-5 h-5 animate-pulse" /> : <Play className="w-5 h-5 fill-white ml-0.5" />}
              </button>

              <button
                onClick={() => handleSkip("forward")}
                className="py-2.5 bg-[#25153b] hover:bg-[#341d52] text-purple-200 rounded-xl font-bold flex flex-col items-center justify-center transition-all cursor-pointer active:scale-95 border border-purple-500/10"
              >
                <span className="text-xs tracking-wider">NEXT</span>
              </button>
            </div>

            {/* Volume controller */}
            <div className="flex items-center gap-3 bg-neutral-950 p-2.5 rounded-xl border border-purple-500/10">
              <Volume2 className="w-4 h-4 text-purple-400 shrink-0" />
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={volume}
                onChange={handleVolumeChange}
                className="w-full accent-fuchsia-500 h-1 bg-purple-950 rounded-lg appearance-none outline-none cursor-pointer"
              />
              <span className="font-mono text-[9px] text-purple-300 w-6 text-right font-bold">
                {Math.round(volume * 100)}%
              </span>
            </div>
          </motion.div>
        </div>

        {/* Categories and Playlist browser / Synced Lyrics - Right side (Span 7) */}
        <AnimatePresence>
          {showTracklist && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="md:col-span-7 landscape:col-span-7 w-full"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-purple-950/20 backdrop-blur-md rounded-3xl p-6 md:p-8 shadow-2xl border border-purple-500/10 flex flex-col h-[460px]"
              >
                {/* SURPRISE TRACKLIST CONTENT */}
                <div className="flex-1 flex flex-col justify-between overflow-hidden">
                  <div className="flex items-center gap-2 mb-4 bg-[#110522]/60 border border-purple-500/10 p-3 rounded-xl">
                    <Radio className="w-4 h-4 text-fuchsia-400 animate-pulse shrink-0" />
                    <div className="text-left">
                      <h3 className="font-serif text-xs font-bold text-fuchsia-300">Surprise Tracklist</h3>
                      <p className="font-sans text-[9px] text-purple-300/80">Continuous sweet soundtrack &bull; 8 Handpicked Melodies</p>
                    </div>
                  </div>

                  <div className="space-y-2.5 overflow-y-auto pr-1 flex-1 scrollbar-thin">
                    <AnimatePresence mode="wait">
                      {allSongs.map((song, i) => {
                        const isCurrent = currentSong.id === song.id;
                        return (
                          <motion.div
                            key={song.id}
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.04 }}
                            onClick={() => handleSongSelect(song)}
                            className={`group flex items-center justify-between p-3 rounded-xl cursor-pointer border transition-all ${
                              isCurrent
                                ? "bg-purple-900/30 border-purple-400 shadow-md shadow-purple-950/40"
                                : "bg-[#160b29]/30 border-purple-500/10 hover:bg-purple-950/20 hover:border-purple-500/20"
                            }`}
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              {/* Circle Play Cover indicator */}
                              <div className={`w-8 h-8 rounded-full shrink-0 flex items-center justify-center ${isCurrent ? "bg-[#c084fc] text-purple-950" : "bg-purple-950/50 text-purple-300 group-hover:bg-[#a855f7]/30"}`}>
                                {isCurrent && isPlaying ? (
                                  <div className="flex items-center gap-0.5 justify-center h-4">
                                    <span className="w-0.5 bg-purple-950 h-2 animate-pulse" />
                                    <span className="w-0.5 bg-purple-950 h-3 animate-pulse delay-75" />
                                    <span className="w-0.5 bg-purple-950 h-1.5 animate-pulse delay-150" />
                                  </div>
                                ) : (
                                  <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                                )}
                              </div>

                              <div className="min-w-0">
                                <p className={`font-serif text-xs font-bold truncate ${isCurrent ? "text-purple-50" : "text-purple-200"}`}>
                                  {song.title}
                                </p>
                                <p className="font-sans text-[9px] text-purple-400/95 mt-0.5">
                                  {song.artist}
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center gap-2">
                              <span className="font-mono text-[8px] text-purple-400">
                                {isCurrent && isStreamingFallback ? "Streaming" : "Lofi Track"}
                              </span>
                            </div>
                          </motion.div>
                        );
                      })}
                    </AnimatePresence>
                  </div>

                  {/* Retro Instruction label */}
                  <div className="mt-4 pt-3 border-t border-purple-500/10 text-center">
                    <p className="font-sans text-[10px] text-purple-300/80 leading-relaxed max-w-sm mx-auto">
                      ⭐ <span className="font-semibold text-fuchsia-300 font-mono">Tip</span>: Tap any track from the collection to play it automatically.
                    </p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Decorative Padding spacer */}
      <div className="h-4" />
    </div>
  );
}
