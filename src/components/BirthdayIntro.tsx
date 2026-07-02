import React, { useEffect, useRef } from "react";
import { BIRTHDAY_CONFIG } from "../config";
import { Sparkles, Heart, ArrowRight } from "lucide-react";
import { motion } from "motion/react";

interface BirthdayIntroProps {
  onNext: () => void;
}

// Particle shape definitions for fireworks
interface FireworkParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  alpha: number;
  decay: number;
  size: number;
  gravity: number;
  friction: number;
  isHeart: boolean;
}

interface Rocket {
  x: number;
  y: number;
  tx: number;
  ty: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
}

export default function BirthdayIntro({ onNext }: BirthdayIntroProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animFrame: number;
    let particles: FireworkParticle[] = [];
    let rockets: Rocket[] = [];

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);
    handleResize();

    const colors = [
      "#ff0054", // Rose Red
      "#ff5400", // Soft Orange
      "#ff007f", // Deep Pink
      "#ffb703", // Gold Yellow
      "#e0aaff", // Lavender Orchid
      "#9b5de5", // Electric Purple
      "#ff85a1", // Pastel Rose
    ];

    const createExplosion = (x: number, y: number, color: string) => {
      const particleCount = 100;
      // Combine normal circles and heart orbits
      for (let i = 0; i < particleCount; i++) {
        const isHeart = Math.random() > 0.6;
        let vx = 0;
        let vy = 0;

        if (isHeart) {
          // Heart-shaped parametric velocities
          const t = Math.random() * Math.PI * 2;
          // Scale multiplier for the heart width/height
          const speed = Math.random() * 2 + 1.5;
          vx = speed * 16 * Math.pow(Math.sin(t), 3) * 0.15;
          vy = -speed * (13 * Math.cos(t) - 5 * Math.cos(2*t) - 2 * Math.cos(3*t) - Math.cos(4*t)) * 0.15;
        } else {
          // Standard radial velocities
          const angle = Math.random() * Math.PI * 2;
          const speed = Math.random() * 5 + 1;
          vx = Math.cos(angle) * speed;
          vy = Math.sin(angle) * speed;
        }

        particles.push({
          x,
          y,
          vx,
          vy,
          color,
          alpha: 1,
          decay: Math.random() * 0.015 + 0.012,
          size: Math.random() * 3 + 1.5,
          gravity: 0.05,
          friction: 0.96,
          isHeart,
        });
      }
    };

    const launchRocket = () => {
      const startX = Math.random() * canvas.width * 0.8 + canvas.width * 0.1;
      const startY = canvas.height;
      const targetX = Math.random() * canvas.width * 0.8 + canvas.width * 0.1;
      const targetY = Math.random() * canvas.height * 0.4 + canvas.height * 0.15;
      
      const angle = Math.atan2(targetY - startY, targetX - startX);
      const speed = Math.random() * 4 + 10;

      rockets.push({
        x: startX,
        y: startY,
        tx: targetX,
        ty: targetY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: Math.random() * 2 + 2,
      });
    };

    // Auto-launch initial burst
    setTimeout(() => {
      createExplosion(canvas.width / 2, canvas.height * 0.35, "#ff007f");
      createExplosion(canvas.width / 2 - 120, canvas.height * 0.45, "#ffb703");
      createExplosion(canvas.width / 2 + 120, canvas.height * 0.45, "#e0aaff");
    }, 100);

    // Rocket generator timer
    const rocketInterval = setInterval(() => {
      if (rockets.length < 5) {
        launchRocket();
      }
    }, 850);

    const updateAndDraw = () => {
      // Semi-transparent overlay to create beautiful dark night neon motion trails
      ctx.fillStyle = "rgba(10, 3, 22, 0.25)"; 
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Update Rockets
      for (let i = rockets.length - 1; i >= 0; i--) {
        const r = rockets[i];
        ctx.beginPath();
        ctx.arc(r.x, r.y, r.size, 0, Math.PI * 2);
        ctx.fillStyle = r.color;
        // Sparkle shadow
        ctx.shadowBlur = 10;
        ctx.shadowColor = r.color;
        ctx.fill();
        ctx.shadowBlur = 0; // Reset

        r.x += r.vx;
        r.y += r.vy;

        // Check if rocket arrived or is slowing down
        if (r.vy >= 0 || r.y <= r.ty) {
          createExplosion(r.x, r.y, r.color);
          rockets.splice(i, 1);
        }
      }

      // Update Explosion Particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.vx *= p.friction;
        p.vy *= p.friction;
        p.vy += p.gravity;
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= p.decay;

        if (p.alpha <= 0) {
          particles.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color;

        ctx.beginPath();
        if (p.isHeart) {
          // Draw tiny heart point
          const size = p.size;
          ctx.translate(p.x, p.y);
          ctx.moveTo(0, size / 4);
          ctx.bezierCurveTo(-size / 2, -size / 2, -size, size / 3, 0, size);
          ctx.bezierCurveTo(size, size / 3, size / 2, -size / 2, 0, size / 4);
          ctx.fill();
        } else {
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      }

      animFrame = requestAnimationFrame(updateAndDraw);
    };

    updateAndDraw();

    return () => {
      window.removeEventListener("resize", handleResize);
      clearInterval(rocketInterval);
      cancelAnimationFrame(animFrame);
    };
  }, []);

  return (
    <div
      id="birthday-intro-container"
      className="relative min-h-screen w-full flex flex-col items-center justify-center p-4 overflow-hidden select-none animate-fade-in"
    >
      {/* Background layer */}
      <div className="absolute inset-0 bg-gradient-to-b from-neutral-950 via-[#0e051c] to-[#05010d]" />

      {/* Sparks Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 z-0 pointer-events-none"
      />

      <div className="relative z-10 text-center flex flex-col items-center max-w-2xl px-4">
        {/* Cute banner seal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, type: "spring" }}
          className="w-16 h-16 bg-[#1a0c2e]/60 border border-purple-500/20 shadow-[0_0_15px_rgba(168,85,247,0.3)] rounded-full flex items-center justify-center mb-6 text-fuchsia-400 hover:scale-110 transition-transform cursor-pointer"
        >
          <Heart className="w-8 h-8 fill-fuchsia-500 text-fuchsia-500 animate-pulse" />
        </motion.div>

        {/* Elegant typography plate */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="font-mono text-xs md:text-sm font-semibold tracking-widest text-fuchsia-400 uppercase flex items-center gap-2 mb-2"
        >
          <Sparkles className="w-4 h-4 text-fuchsia-400 rotate-12" />
          The Clock Struck Midnight!
          <Sparkles className="w-4 h-4 text-fuchsia-400 -rotate-12" />
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="font-cursive text-6xl md:text-9xl text-fuchsia-405 drop-shadow-[0_0_15px_rgba(240,70,160,0.5)] mb-4 leading-none"
        >
          Happy Birthday
        </motion.h1>

        <motion.h2
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="font-serif text-3xl md:text-5xl font-bold tracking-tight text-purple-100 mb-6 drop-shadow-xs"
        >
          {BIRTHDAY_CONFIG.recipientName}
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.3 }}
          className="font-sans text-sm md:text-base text-purple-200/85 leading-relaxed max-w-md mb-10"
        >
          "Today, the universe celebrates your beautiful soul, and so does my heart.
          I've created this special secret place filled with our memories and music just for you."
        </motion.p>

        {/* Next Button */}
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.8 }}
          onClick={onNext}
          className="group cursor-pointer px-8 py-4 bg-gradient-to-r from-purple-600 via-fuchsia-600 to-rose-600 hover:from-purple-500 hover:to-rose-500 text-white font-bold text-base rounded-full shadow-lg hover:shadow-2xl flex items-center gap-2.5 transition-all duration-300 hover:scale-105 active:scale-95"
        >
          Open Your Surprise Hub
          <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1.5" />
        </motion.button>
      </div>
    </div>
  );
}
