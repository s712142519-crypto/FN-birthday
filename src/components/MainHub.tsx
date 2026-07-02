import React from "react";
import { BIRTHDAY_CONFIG } from "../config";
import { Music, MailOpen, Camera, Sparkles, Heart, Quote } from "lucide-react";
import { motion } from "motion/react";

interface MainHubProps {
  onNavigate: (view: "music" | "message" | "photos") => void;
  onReset: () => void;
}

export default function MainHub({ onNavigate, onReset }: MainHubProps) {
  // A collection of sweet romantic reminders
  const romanticQuotes = [
    "To the world you might be one person, but to me you are the world.",
    "My favorite place in all the universe is standing right besides you.",
    "By your side is where my heart sings the happiest, sweetest songs.",
    "You are my today, my tomorrow, and all of my remaining forevers."
  ];

  // Pick a quote based on the current calendar day or random
  const todayIndex = new Date().getDate() % romanticQuotes.length;
  const selectedQuote = romanticQuotes[todayIndex];

  const sections = [
    {
      id: "music" as const,
      title: "Our Playlist",
      subtitle: "Retro Cassette & Vinyl Player",
      description: "Listen to the custom soundtrack of our smiles. Categorized into Happy, Sad, and Angry records just for your every mood.",
      iconBg: "bg-purple-900/30 border-purple-500/20",
      iconColor: "text-purple-400",
      icon: Music,
      accentClass: "hover:border-purple-400/60 group-hover:bg-purple-900/40",
      shadowClass: "hover:shadow-[0_0_15px_rgba(168,85,247,0.2)]",
      bannerText: "LOFI STATION"
    },
    {
      id: "message" as const,
      title: "Love Message",
      subtitle: "Sealed Surprise envelope",
      description: "Inspect the romantic envelope and break the sweet heart wax stamp to unfold my personal handwritten scroll letter.",
      iconBg: "bg-fuchsia-900/30 border-fuchsia-500/20",
      iconColor: "text-fuchsia-400",
      icon: MailOpen,
      accentClass: "hover:border-fuchsia-400/60 group-hover:bg-fuchsia-900/40",
      shadowClass: "hover:shadow-[0_0_15px_rgba(217,70,239,0.2)]",
      bannerText: "SWEET MESSAGE"
    },
    {
      id: "photos" as const,
      title: "Photo Studio",
      subtitle: "Memory Walk & Cinema",
      description: "Slide along our memory polaroids. Leave comments, read hidden romantic notes behind frames, and screen our little custom movie.",
      iconBg: "bg-rose-900/30 border-rose-500/20",
      iconColor: "text-rose-400",
      icon: Camera,
      accentClass: "hover:border-rose-400/60 group-hover:bg-rose-900/40",
      shadowClass: "hover:shadow-[0_0_15px_rgba(244,63,94,0.2)]",
      bannerText: "POLAROID MEMORIES"
    }
  ];

  return (
    <div
      id="main-hub-container"
      className="relative min-h-screen w-screen flex flex-col items-center justify-between py-12 px-4 md:px-8 select-none overflow-x-hidden mx-auto"
      style={{ width: "100vw", minHeight: "100vh" }}
    >
      {/* Background Plate */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0d0014] via-[#09000e] to-[#040007] z-0" />

      {/* Header Info Section */}
      <div className="relative z-10 text-center max-w-xl w-full pt-4 animate-fade-in mx-auto">
        {/* Tiny sparkling crown */}
        <span className="font-mono text-[10px] tracking-widest font-bold text-fuchsia-400 uppercase bg-purple-950/40 border border-purple-500/20 px-3 py-1 rounded-full inline-flex items-center gap-1 mb-3">
          <Sparkles className="w-3 h-3 text-fuchsia-400 animate-spin" />
          Celebrate {BIRTHDAY_CONFIG.recipientName}'s Day
        </span>

        <h1 className="font-serif text-3xl md:text-5xl font-bold text-purple-50 mb-1 tracking-tight drop-shadow-md">
          Surprise Memory Hub
        </h1>
        <p className="font-sans text-xs md:text-sm text-purple-200/80 max-w-md mx-auto leading-relaxed">
          Welcome to your sweet custom digital lounge. Tap on any memory gateway below to begin exploring your birthday gifts.
        </p>
      </div>

      {/* Portal Bento Grid - Replaced with Minimal Phone Home Screen Icon Grid */}
      <div
        id="portal-cards-grid"
        className="relative z-10 flex flex-row items-center justify-center gap-6 sm:gap-8 md:gap-10 max-w-[900px] w-full my-12 select-none mx-auto"
      >
        {sections.map((section, idx) => {
          const IconComponent = section.icon;
          
          let defaultGlow = "";
          let hoverGlow = "";
          let iconColor = "";
          let labelText = "";

          if (section.id === "music") {
            defaultGlow = "border-purple-500/30 bg-purple-950/20 shadow-[0_0_15px_rgba(168,85,247,0.15)]";
            hoverGlow = "group-hover:border-purple-400 group-hover:shadow-[0_0_30px_rgba(168,85,247,0.7)] bg-purple-900/30";
            iconColor = "text-purple-400 group-hover:text-purple-300";
            labelText = "Music";
          } else if (section.id === "message") {
            defaultGlow = "border-pink-500/30 bg-pink-950/20 shadow-[0_0_15px_rgba(236,72,153,0.15)]";
            hoverGlow = "group-hover:border-pink-400 group-hover:shadow-[0_0_30px_rgba(236,72,153,0.7)] bg-pink-900/30";
            iconColor = "text-pink-400 group-hover:text-pink-300";
            labelText = "Message";
          } else {
            defaultGlow = "border-rose-500/30 bg-rose-950/20 shadow-[0_0_15px_rgba(244,63,94,0.15)]";
            hoverGlow = "group-hover:border-rose-400 group-hover:shadow-[0_0_30px_rgba(244,63,94,0.7)] bg-rose-900/30";
            iconColor = "text-rose-400 group-hover:text-rose-300";
            labelText = "Photos";
          }

          return (
            <motion.div
              key={section.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1, duration: 0.5 }}
              onClick={() => onNavigate(section.id)}
              className="flex flex-col items-center gap-2 cursor-pointer group"
            >
              {/* Icon Container with border-radius: 18px and glowing neon */}
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className={`w-14 h-14 sm:w-16 sm:h-16 md:w-[72px] md:h-[72px] rounded-2xl md:rounded-[18px] border flex items-center justify-center transition-all duration-300 ${defaultGlow} ${hoverGlow}`}
              >
                <IconComponent 
                  className={`transition-colors duration-300 ${iconColor} w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9`}
                />
              </motion.div>

              {/* Label below the app icon (tiny 11px white text) */}
              <span className="font-sans text-[11px] font-medium text-neutral-300/90 group-hover:text-white tracking-wide transition-colors duration-300 select-none">
                {labelText}
              </span>
            </motion.div>
          );
        })}
      </div>

      {/* Footer Quote or Sweet reminder */}
      <div className="relative z-10 w-full max-w-lg text-center flex flex-col items-center">
        {/* Quote Plate */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="bg-purple-950/30 backdrop-blur-xs border border-purple-500/20 p-4 rounded-2xl flex items-center gap-3 max-w-md mx-auto"
        >
          <Quote className="w-5 h-5 text-fuchsia-400 shrink-0" />
          <p className="font-sans text-xs italic text-purple-200 leading-normal">
            "{selectedQuote}"
          </p>
        </motion.div>

        <button
          onClick={onReset}
          className="mt-6 text-[10px] font-bold text-purple-400 hover:text-fuchsia-300 underline cursor-pointer uppercase tracking-widest transition-colors mb-4"
        >
          View Lock Screen
        </button>
      </div>
    </div>
  );
}
