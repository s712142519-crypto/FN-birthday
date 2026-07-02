import React, { useEffect, useRef } from "react";
import { BIRTHDAY_CONFIG } from "../config";

interface Particle {
  x: number;
  y: number;
  size: number;
  speedY: number;
  speedX: number;
  opacity: number;
}

export default function AestheticLayer() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let snowflakes: Particle[] = [];

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    // Initialize snowflakes
    const initSnowflakes = () => {
      snowflakes = [];
      const count = Math.min(80, Math.floor(window.innerWidth / 15));
      for (let i = 0; i < count; i++) {
        snowflakes.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 3.5 + 1.5, // Slightly larger snowflakes
          speedY: Math.random() * 0.9 + 0.5,
          speedX: Math.random() * 0.6 - 0.3,
          opacity: Math.random() * 0.65 + 0.35, // Brighter snow
        });
      }
    };

    initSnowflakes();

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // 1. Draw and update snow with glow subtle aura
      ctx.save();
      ctx.shadowColor = "rgba(255, 255, 255, 0.7)";
      ctx.shadowBlur = 6;
      for (const snow of snowflakes) {
        ctx.beginPath();
        ctx.arc(snow.x, snow.y, snow.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${snow.opacity})`;
        ctx.fill();

        snow.y += snow.speedY;
        snow.x += snow.speedX;

        // Reset if goes off-screen
        if (snow.y > canvas.height) {
          snow.y = -10;
          snow.x = Math.random() * canvas.width;
        }
        if (snow.x > canvas.width) snow.x = 0;
        if (snow.x < 0) snow.x = canvas.width;
      }
      ctx.restore();

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      id="aesthetic-interactive-canvas"
      className="fixed inset-0 pointer-events-none z-[9999] w-full h-full"
    />
  );
}
