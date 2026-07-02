import React, { useRef, useEffect, useState } from "react";
import { Heart, RotateCcw } from "lucide-react";

interface ScratchCardProps {
  id: string;
  message: string;
  title: string;
  index: number;
  onFlipBack: () => void;
}

export const ScratchCard: React.FC<ScratchCardProps> = ({
  id,
  message,
  title,
  index,
  onFlipBack
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isScratched, setIsScratched] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resizeCanvas = () => {
      const rect = canvas.parentElement?.getBoundingClientRect();
      if (rect) {
        canvas.width = rect.width;
        canvas.height = rect.height;

        // Draw the lovely scratchable gradient
        const grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
        grad.addColorStop(0, "#f472b6"); // pink-400
        grad.addColorStop(0.5, "#db2777"); // pink-600
        grad.addColorStop(1, "#86198f"); // fuchsia-800
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Add magical shimmering stars on the scratch surface
        ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
        for (let i = 0; i < 45; i++) {
          const x = Math.random() * canvas.width;
          const y = Math.random() * canvas.height;
          ctx.beginPath();
          ctx.arc(x, y, 1 + Math.random() * 2, 0, Math.PI * 2);
          ctx.fill();
        }

        // Draw romantic central text
        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 13px serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("SCRATCH ME 💖", canvas.width / 2, canvas.height / 2 - 12);

        ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
        ctx.font = "8px monospace";
        ctx.fillText("Swipe to reveal memory!", canvas.width / 2, canvas.height / 2 + 12);
      }
    };

    // Delay slightly to ensure browser has completed layout sizing
    const timer = setTimeout(resizeCanvas, 150);
    return () => clearTimeout(timer);
  }, [id]);

  const handleStart = (clientX: number, clientY: number, e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();
    setIsDrawing(true);
    scratch(clientX, clientY);
  };

  const handleMove = (clientX: number, clientY: number, e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return;
    e.stopPropagation();
    scratch(clientX, clientY);
  };

  const handleEnd = (e: React.MouseEvent | React.TouchEvent | any) => {
    if (isDrawing) {
      e.stopPropagation();
      setIsDrawing(false);
      checkScratchPercentage();
    }
  };

  const scratch = (clientX: number, clientY: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    ctx.globalCompositeOperation = "destination-out";
    ctx.beginPath();
    ctx.arc(x, y, 22, 0, Math.PI * 2); // Perfectly sized scratch cursor
    ctx.fill();
  };

  const checkScratchPercentage = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    try {
      const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const pixels = imgData.data;
      let transparentCount = 0;

      // Sample every 20th pixel for rapid performance
      for (let i = 0; i < pixels.length; i += 80) {
        if (pixels[i + 3] === 0) {
          transparentCount++;
        }
      }

      const totalSamples = pixels.length / 80;
      const percent = transparentCount / totalSamples;

      if (percent > 0.40) {
        setIsScratched(true);
      }
    } catch (e) {
      console.warn("Could not calculate scratch ratio, falling back", e);
    }
  };

  return (
    <div
      className="absolute inset-0 w-full h-full bg-white text-neutral-900 rounded-xl overflow-hidden shadow-2xl flex flex-col justify-between p-3.5 border-2 border-pink-200 select-none z-10"
      onClick={(e) => e.stopPropagation()} // Stop propagation so clicking back components doesn't trigger card flips
    >
      {/* Light pink elegant watermark background */}
      <div className="absolute inset-0 flex items-center justify-center opacity-[0.06] pointer-events-none z-0">
        <Heart className="w-40 h-40 text-pink-500 fill-pink-400" />
      </div>

      <div className="relative z-10 flex flex-col h-full justify-between">
        {/* Header - Only contains the Close (Flip Back) button as requested */}
        <div className="flex justify-end items-center border-b border-pink-100 pb-2">
          <button
            type="button"
            onClick={onFlipBack}
            className="w-6 h-6 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-600 hover:text-neutral-900 flex items-center justify-center transition-all cursor-pointer font-bold text-xs"
            title="Flip Back"
          >
            ✕
          </button>
        </div>

        {/* Content - Medium sized elegant black text as requested */}
        <div className="flex-1 overflow-y-auto my-3 flex items-center justify-center pr-1 select-text scrollbar-thin">
          <p className="font-serif text-[12px] sm:text-[13px] md:text-[14px] leading-relaxed text-neutral-800 font-medium italic text-center w-full">
            "{message}"
          </p>
        </div>
      </div>

      {/* Canvas Layer */}
      {!isScratched && (
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full z-20 cursor-crosshair touch-none"
          title="Scratch here to reveal the secret message!"
          onDoubleClick={() => setIsScratched(true)} // Double-click as a convenient helper to reveal
          onMouseDown={(e) => handleStart(e.clientX, e.clientY, e)}
          onMouseMove={(e) => handleMove(e.clientX, e.clientY, e)}
          onMouseUp={(e) => handleEnd(e)}
          onMouseLeave={(e) => handleEnd(e)}
          onTouchStart={(e) => {
            if (e.touches[0]) handleStart(e.touches[0].clientX, e.touches[0].clientY, e);
          }}
          onTouchMove={(e) => {
            if (e.touches[0]) handleMove(e.touches[0].clientX, e.touches[0].clientY, e);
          }}
          onTouchEnd={(e) => handleEnd(e)}
        />
      )}
    </div>
  );
};
