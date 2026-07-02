import React, { useState, useEffect, useRef } from "react";
import { BIRTHDAY_CONFIG } from "../config";
import {
  ArrowLeft,
  Sparkles,
  Heart,
  MessageCircle,
  Film,
  X,
  Bookmark,
  Camera,
  Music,
  Send,
  Play,
  Volume2,
  Maximize2,
  ChevronLeft,
  ChevronRight,
  Smartphone,
  RotateCw,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { ScratchCard } from "./ScratchCard";

interface Photo {
  id: string;
  title: string;
  filePath: string;
  fallbackUrl: string;
  hiddenMessage: string;
}

interface LikesState {
  [photoId: string]: {
    count: number;
    userLiked: boolean;
  };
}

interface PhotosSectionProps {
  onBack: () => void;
}

// 40 Beautiful Romantic Photo Card details with Titles, Captions, and custom love whispers
const TITLES_CAPTONS_WHISPERS = [
  {
    title: "Holding Hands under Starlight",
    caption:
      "The night we walked home counting stars and wrapping ourselves in warm cozy whispers.",
    message:
      "Remember this night? The air was freezing, but holding your hand felt like wrapping myself in sunshine. I realized right then that I never wanted to let go.",
  },
  {
    title: "Our Quiet Bubble of Love",
    caption:
      "Just you, me, and the soft ambient music playing in our favorite local coffee corner.",
    message:
      "You give the absolute best hugs in the universe. It's like all the noise in my head stops completely and starts singing a sweet, happy lullaby.",
  },
  {
    title: "Under the Soft Lights",
    caption:
      "Standing under those festive magical fairy lights with your eyes glowing intensely.",
    message:
      "Standing next to you under those fairy lights made me believe in magic. The real kind of magic that exists in quiet, comforting whispers.",
  },
  {
    title: "Chasing Sunsets Together",
    caption:
      "Watching the sun dissolve into gold, thinking about how lucky I am to have you near.",
    message:
      "No matter how beautiful the sky glows, it pales in comparison to the warm sparkle in your eyes. I'd chase a thousand sunrises and sunsets just with you.",
  },
  {
    title: "Silly Shared Moments",
    caption:
      "Laughing at nothing, making weird faces, and being absolutely ourselves.",
    message:
      "Sharing random jokes, being absolutely ridiculous, and laughing until our stomachs hurt. That is my true happy place, because you are there breathing life into it.",
  },
  {
    title: "The First Spark of Us",
    caption:
      "That fleeting second where our eyes locked and my whole universe shifted.",
    message:
      "My heart raced so fast that day! I couldn't find the right words to say, but I knew you were the one I had been looking for all my life.",
  },
  {
    title: "Shared Umbrellas in Rain",
    caption:
      "Getting half-drenched but laughing through the entire cold thunderstorm.",
    message:
      "We only had one tiny umbrella, but squeezing close felt like our own secret cozy shelter. Rain has never felt so warm and happy since.",
  },
  {
    title: "Late Night Deep Conversations",
    caption:
      "Talking about stars, dreams, fears, and everything until the dawn birds chirped.",
    message:
      "Your voice at 3:00 AM is my favorite acoustic song. Thank you for listening to my chaotic thoughts and keeping my heart perfectly safe.",
  },
  {
    title: "Sweet Cozy Morning Coffee",
    caption:
      "Sharing freshly brewed black coffee, exchanging smiles over warm steam.",
    message:
      "Starting the day with you makes even the most boring Monday feel like a magical holiday. You are my favorite cup of warm sunshine.",
  },
  {
    title: "The Pure Melody of Your Laugh",
    caption:
      "That spontaneous, ringing giggle that immediately deletes all my bad days.",
    message:
      "When you laugh, the entire world gets instantly brighter. I promise to spend my life finding reasons to make you smile just like this.",
  },
  {
    title: "Warm Winter Hugs",
    caption:
      "Squeezing close in thick jackets, feeling your sweet soft heartbeat near mine.",
    message:
      "No amount of wool or fire can match the radiant warmth of your embrace. It's the ultimate home I always want to return to.",
  },
  {
    title: "Spontaneous Road Trip Smiles",
    caption:
      "Singing terribly along to lofi radio playlist, windows rolled all the way down.",
    message:
      "The destination didn't even matter - just seeing your profile illuminated by the passing highway lamps was the most beautiful view.",
  },
  {
    title: "Picnics on the Sunny Hill",
    caption:
      "Basking under the blue sky, eating berries, and pointing at funny-shaped clouds.",
    message:
      "That day felt like a scene out of a beautiful classic movie. I wish I could press pause on time whenever we are lying on the clover grass together.",
  },
  {
    title: "Comfort in Your Warm Embrace",
    caption: "When the weight of the day melts away beneath your gentle touch.",
    message:
      "Your hug is like a magical shield against everything. Thank you for always being my soft place to land when things get overwhelming.",
  },
  {
    title: "Dancing in the Living Room",
    caption:
      "Barefoot on the wood tiles, moving slowly to a song only our hearts could hear.",
    message:
      "We don't need fancy dance halls or golden spotlights. Holding you close in our quiet room is the grandest ballroom I will ever need.",
  },
  {
    title: "The Day You First Smiled at Me",
    caption:
      "A polaroid stored in my mind of your sweet, beautiful face turning towards me.",
    message:
      "I felt my whole soul light up like a thousand candles. That single smile became the anchor for my happier days and sweetest dreams.",
  },
  {
    title: "Watching the Glow of the Moon",
    caption:
      "Counting stars and sharing silent wishes in the middle of a cool night breeze.",
    message:
      "Even the moon looks a little envious of how brilliantly you shine. Sharing these quiet hours with you is my ultimate comfort.",
  },
  {
    title: "Sweet Hand-Written Scribbles",
    caption: "Little sticky pad doodles and love hearts stuck on mirrors.",
    message:
      "Reading your tiny handwriting makes my heart soar instantly. Every letter and heart you draw is a literal treasure I keep locked in my mind.",
  },
  {
    title: "Shared Ice Cream & Brainfreeze",
    caption:
      "Struggling to eat melting chocolate cones before it drops on our sneakers.",
    message:
      "You had a little smear of ice cream on your nose, and it was the cutest thing I've ever seen. Every silly moment is a gold medal memory.",
  },
  {
    title: "Safe Harbors in Your Heart",
    caption:
      "Whenever I look at you, I feel an incredible, deep sense of belonging.",
    message:
      "My home isn't an address on a map. My home is the gentle space right beside you. Thank you for always keeping your golden doors open.",
  },
  {
    title: "A Thousand Whispers of Devotion",
    caption:
      "Gently brushing your soft hair aside, whispering secrets in your ear.",
    message:
      "I could whisper 'I love you' a million times a day and it would still feel like I haven't said it enough. You are my absolute forever.",
  },
  {
    title: "Our Little Cozy Coffee Corner",
    caption: "Stealing quiet sweet glances under the ambient cafe lamps.",
    message:
      "The coffee was sweet, but nothing holds sweetness like the smile you direct my way when you catch me staring at you.",
  },
  {
    title: "Holding Your Cute Winter Hands",
    caption:
      "Squeezing fingers inside coat pockets to share natural body warmth.",
    message:
      "Even on the frostiest winter afternoons, holding your hands makes my fingers glow with real heart-warming magic.",
  },
  {
    title: "In Love with Every Tiny Detail",
    caption:
      "Tracing the curves of your hands, marveling at how perfectly we fit.",
    message:
      "Every freckle, every blink, and every word you say is a beautiful poem. I am completely, head-over-heels in love with your true self.",
  },
  {
    title: "Stealing Soft Midnight Kisses",
    caption:
      "A quiet, gentle brush of lips behind the shadow of a street lamp.",
    message:
      "It felt like a sweet movie kiss — soft, warm, and filled with a thousand quiet words of unconditional love.",
  },
  {
    title: "A Universe of Endless Smiles",
    caption: "Capturing your sparkling joyous laugh inside my mind forever.",
    message:
      "If my heart had a canvas, it would be covered in paints of your laughter. You make every dark corner of my world bloom with roses.",
  },
  {
    title: "Shared Bluetooth Headphone Tracks",
    caption:
      "Leaning heads close together, listening to our favorite lofi song loop.",
    message:
      "Sharing my music with you is like sharing my soul. Leaning against your shoulder made the acoustic beats feel completely divine.",
  },
  {
    title: "Your Heartbeats Next to Mine",
    caption:
      "Lying down side-by-side, matching our breathing to the quiet evening.",
    message:
      "Your heartbeat is my favorite rhythm. Hearing it keep pace with mine is the most comforting, sleep-inducing reassurance in the world.",
  },
  {
    title: "Foreshadows of Our Beautiful Future",
    caption: "Discussing our someday-house, someday-dogs, and forever-walks.",
    message:
      "Growing old with you is my grandest, most exciting adventure. I cannot wait to write fifty more chapters of this beautiful love story.",
  },
  {
    title: "Gleams of Cozy Christmas Lights",
    caption:
      "Sipping hot sweet cocoa wrapped in a single, massive wool blanket.",
    message:
      "The room was lit by neon green and crimson, but nothing glowed warmer than your beautiful face in the soft candlelight.",
  },
  {
    title: "Two Hearts, One Single Beat",
    caption:
      "Sharing a language of small private inside jokes and secret glances.",
    message:
      "We don't need to speak full paragraphs to understand each other. A single micro-glance from you is worth a thousand dictionaries.",
  },
  {
    title: "A Promise of Always & Forever",
    caption:
      "Gently locking pinkies, sealing a lifelong devotion under the golden sky.",
    message:
      "Pinky promises are the most sacred laws of my heart. I promise to hold you close, protect your smiles, and love you forever.",
  },
  {
    title: "Wrapped in Your Soft Scent",
    caption: "Borrowing your favorite oversized sweet-smelling knit sweater.",
    message:
      "It smells like flowers and fresh breeze. Wearing it feels like receiving a massive, warm, 24-hour long hug from you.",
  },
  {
    title: "Pure Sunset Radiance",
    caption:
      "Watching the sun cast long golden beams across your stunning profile.",
    message:
      "No painter, sculptor, or camera could ever fully capture how gorgeous you looked under that setting orange sun. You are my masterpiece.",
  },
  {
    title: "Our Sweet Escape",
    caption:
      "Forgetting the entire chaotic outer world and focusing on our private bubble.",
    message:
      "When we are together, the rest of the universe feels like background static. You are the only high-definition melody I hear.",
  },
  {
    title: "Memories Written in Gold",
    caption:
      "Flipping through our collection of ticket stubs and dried wild flowers.",
    message:
      "Every tiny souvenir from our days is a holy relic to me. They are physical pieces of a love that is pure gold.",
  },
  {
    title: "The Day We Unlocked Forever",
    caption: "A snapshot of pure, unadulterated heart-melting happiness.",
    message:
      "I felt a massive wave of tranquil peace. I knew without a single doubt that my search was over. I had found my forever home.",
  },
  {
    title: "Two Silly Lovebirds",
    caption: "Singing goofy mock opera in the middle of a grocery store aisle.",
    message:
      "We must look so weird to onlookers—but I wouldn't trade our silly, chaotic bubble for all the serious riches in the world.",
  },
  {
    title: "My Safe Harbor, My Everything",
    caption:
      "Leaning our foreheads together, breathing the air of sweet, quiet trust.",
    message:
      "You are the anchor that keeps me grounded in stormy seas, and the sail that carries me to beautiful shores. Happy Birthday, my love.",
  },
  {
    title: "The Garden of Us",
    caption:
      "Watching the flowers bloom as our beautiful love continues to grow.",
    message:
      "Every moment we share is like planting a sweet red rose. Today, our garden is in full magnificent bloom, celebrating your day!",
  },
];

export default function PhotosSection({ onBack }: PhotosSectionProps) {
  const [activePhotoIndex, setActivePhotoIndex] = useState(0);
  const [radius, setRadius] = useState(260);
  const [stageWidth, setStageWidth] = useState(240);
  const [stageHeight, setStageHeight] = useState(300);
  const [containerHeight, setContainerHeight] = useState(420);

  // 3D Card flip map for individual Instaposts
  const [flippedCardIds, setFlippedCardIds] = useState<Record<string, boolean>>(
    {},
  );
  const [bookmarked, setBookmarked] = useState<Record<string, boolean>>({});
  const [selectedLightboxIndex, setSelectedLightboxIndex] = useState<
    number | null
  >(null);

  // Full-screen zoomed interactive scratch card state
  const [zoomedPhoto, setZoomedPhoto] = useState<any | null>(null);
  const [isZoomedFlipped, setIsZoomedFlipped] = useState(false);

  useEffect(() => {
    if (zoomedPhoto) {
      const timer = setTimeout(() => {
        setIsZoomedFlipped(true);
      }, 550); // Wait for zoom animation to settle before flipping!
      return () => clearTimeout(timer);
    } else {
      setIsZoomedFlipped(false);
    }
  }, [zoomedPhoto]);

  const handleCloseZoomed = () => {
    setIsZoomedFlipped(false);
    setTimeout(() => {
      setZoomedPhoto(null);
    }, 500); // Let the card flip back before closing fully
  };

  // Countdown overlay sequence states
  const [isBlackScreenActive, setIsBlackScreenActive] = useState(false);
  const [blackScreenMessage, setBlackScreenMessage] = useState("");
  const [blackScreenSub, setBlackScreenSub] = useState("");
  const [countdownNum, setCountdownNum] = useState<number | null>(null);
  const [isFullscreenVideoActive, setIsFullscreenVideoActive] = useState(false);
  const [isCinemaPlaying, setIsCinemaPlaying] = useState(false);
  const [fullVideoSrc, setFullVideoSrc] = useState<string | null>(null);

  // Likes of dynamically configured posts
  const [likes, setLikes] = useState<LikesState>({});
  const [activeCommentInput, setActiveCommentInput] = useState<
    Record<string, string>
  >({});
  const [isVideoFinished, setIsVideoFinished] = useState(false);
  const [isShareAlert, setIsShareAlert] = useState(false);
  const [isRotatePromptActive, setIsRotatePromptActive] = useState(false);

  const fullVideoRef = useRef<HTMLVideoElement | null>(null);
  const [rotationDegrees, setRotationDegrees] = useState(0);
  const [isAutoSpinning, setIsAutoSpinning] = useState(true);
  const autoSpinTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Verify video file existence on mount
  useEffect(() => {
    const verifySource = async () => {
      try {
        const response = await fetch(BIRTHDAY_CONFIG.cinemaVideo.filePath, {
          method: "HEAD",
        });
        if (response.ok) {
          setFullVideoSrc(BIRTHDAY_CONFIG.cinemaVideo.filePath);
        } else {
          setFullVideoSrc(BIRTHDAY_CONFIG.cinemaVideo.fallbackUrl);
        }
      } catch (e) {
        setFullVideoSrc(BIRTHDAY_CONFIG.cinemaVideo.fallbackUrl);
      }
    };
    verifySource();
  }, []);

  // Auto load and play when the full video source changes (e.g., fallback triggered)
  useEffect(() => {
    if (!fullVideoSrc) return;
    if (fullVideoRef.current && isFullscreenVideoActive) {
      fullVideoRef.current.load();
      fullVideoRef.current
        .play()
        .then(() => {
          setIsCinemaPlaying(true);
        })
        .catch((err) => {
          console.log(
            "Full video autoplay fallback blocked, wait for user tap:",
            err,
          );
        });
    }
  }, [fullVideoSrc, isFullscreenVideoActive]);

  // Responsively estimate optimal 3D ring positioning and card sizes with more spacing
  useEffect(() => {
    const handleResizeRadius = () => {
      const isLandscapePhone =
        window.innerHeight < 500 && window.innerWidth > window.innerHeight;

      if (isLandscapePhone) {
        // Rotated landscape mobile screen: make cards very compact so they fit the height!
        setRadius(175);
        setStageWidth(135);
        setStageHeight(175);
        setContainerHeight(230);
      } else if (window.innerWidth < 640) {
        // Portrait phone view: compact but clear
        setRadius(210);
        setStageWidth(160);
        setStageHeight(210);
        setContainerHeight(290);
      } else if (window.innerWidth < 1024) {
        // Tablet / small desktop view
        setRadius(320);
        setStageWidth(210);
        setStageHeight(265);
        setContainerHeight(370);
      } else {
        // Large screen desktop: elegant spacious layout
        setRadius(420);
        setStageWidth(240);
        setStageHeight(300);
        setContainerHeight(430);
      }
    };
    handleResizeRadius();
    window.addEventListener("resize", handleResizeRadius);
    return () => window.removeEventListener("resize", handleResizeRadius);
  }, []);

  // Synchronize dynamic active slide based on continuous rotating degrees
  useEffect(() => {
    const total = BIRTHDAY_CONFIG.photos.length;
    const anglePerItem = 360 / total;
    const relativeAngle = rotationDegrees % 360;
    const rawIndex = Math.round(-relativeAngle / anglePerItem) % total;
    const positiveIndex = (rawIndex + total) % total;
    setActivePhotoIndex(positiveIndex);
  }, [rotationDegrees]);

  // Function to pause auto-spinning on interaction, and resume after 8 seconds
  const handleInteraction = () => {
    setIsAutoSpinning(false);
    if (autoSpinTimerRef.current) {
      clearTimeout(autoSpinTimerRef.current);
    }
    autoSpinTimerRef.current = setTimeout(() => {
      setIsAutoSpinning(true);
    }, 8000);
  };

  // Navigate around the 3D ribbon
  const spinToCardIndex = (targetIndex: number) => {
    handleInteraction();
    const total = BIRTHDAY_CONFIG.photos.length;
    const anglePerItem = 360 / total;
    let currentActive = activePhotoIndex;
    let diff = targetIndex - currentActive;
    if (diff > total / 2) diff -= total;
    if (diff < -total / 2) diff += total;
    setRotationDegrees((prev) => prev - diff * anglePerItem);
  };

  // Automated 3D carousel slow, smooth perpetual rotation of slides
  useEffect(() => {
    if (!isAutoSpinning) return;
    const interval = setInterval(() => {
      setRotationDegrees((prev) => prev - 0.22); // Perfectly slow, smooth continuous glide
    }, 45);
    return () => clearInterval(interval);
  }, [isAutoSpinning]);

  // Hide the snow particle layer during video fullscreen activity
  useEffect(() => {
    if (isFullscreenVideoActive) {
      document.body.classList.add("video-active");
    } else {
      document.body.classList.remove("video-active");
    }
    return () => {
      document.body.classList.remove("video-active");
    };
  }, [isFullscreenVideoActive]);

  const toggleFlipCard = (id: string) => {
    setFlippedCardIds((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleSeeTheMagicClick = () => {
    const isMobilePortrait = window.innerHeight > window.innerWidth && window.innerWidth < 768;
    if (isMobilePortrait) {
      setIsRotatePromptActive(true);
    } else {
      triggerSpecialVideoReveal();
    }
  };

  // Automatically trigger video reveal when phone is rotated to landscape if prompt is active
  useEffect(() => {
    if (!isRotatePromptActive) return;

    const handleOrientationChange = () => {
      const isLandscape = window.innerWidth > window.innerHeight;
      if (isLandscape) {
        setIsRotatePromptActive(false);
        triggerSpecialVideoReveal();
      }
    };

    window.addEventListener("resize", handleOrientationChange);
    window.addEventListener("orientationchange", handleOrientationChange);
    
    // Initial check in case they already rotated before the prompt mounted fully
    handleOrientationChange();

    return () => {
      window.removeEventListener("resize", handleOrientationChange);
      window.removeEventListener("orientationchange", handleOrientationChange);
    };
  }, [isRotatePromptActive]);

  // Suspense transition black screen and countdown 5-1 using smooth setInterval
  const triggerSpecialVideoReveal = () => {
    setIsBlackScreenActive(true);
    setBlackScreenMessage("Wait...");
    setBlackScreenSub("Something extremely special is prepared for you...");
    setIsVideoFinished(false);
    setCountdownNum(5); // Start immediately with 5 for instantaneous responsiveness!
    setIsCinemaPlaying(false);

    let currentCount = 5;
    const interval = setInterval(() => {
      currentCount -= 1;
      if (currentCount <= 0) {
        clearInterval(interval);
        setCountdownNum(null);
        setIsBlackScreenActive(false);
        setIsFullscreenVideoActive(true);

        // Auto-trigger video play with unmuted support and fallback
        setTimeout(() => {
          if (fullVideoRef.current) {
            fullVideoRef.current.currentTime = 0;
            fullVideoRef.current.muted = false;
            fullVideoRef.current
              .play()
              .then(() => {
                setIsCinemaPlaying(true);
              })
              .catch((err) => {
                console.log(
                  "Full video autoplay unmuted blocked, trying muted...",
                  err,
                );
                if (fullVideoRef.current) {
                  fullVideoRef.current.muted = true;
                  fullVideoRef.current
                    .play()
                    .then(() => {
                      setIsCinemaPlaying(true);
                    })
                    .catch((e) => {
                      console.log("Muted autoplay failed:", e);
                      setIsCinemaPlaying(false);
                    });
                }
              });
          }
        }, 300);
      } else {
        setCountdownNum(currentCount);
      }
    }, 1000); // Perfect, exact 1-second interval with no drift!
  };

  // Automatic cinema video launch when both photos and message have been viewed
  useEffect(() => {
    try {
      localStorage.setItem("photos_seen", "true");
    } catch (e) {
      console.error(e);
    }

    const messageSeen = localStorage.getItem("message_seen") === "true";
    const autoTriggered =
      sessionStorage.getItem("auto_video_triggered") === "true";

    if (messageSeen && !autoTriggered) {
      sessionStorage.setItem("auto_video_triggered", "true");
      const timer = setTimeout(() => {
        triggerSpecialVideoReveal();
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, []);

  // Like Toggle
  const handleLikeToggle = (id: string, initialLikesCount: number) => {
    setLikes((prev) => {
      const current = prev[id] || {
        count: initialLikesCount,
        userLiked: false,
      };
      const increment = current.userLiked ? -1 : 1;
      return {
        ...prev,
        [id]: {
          count: current.count + increment,
          userLiked: !current.userLiked,
        },
      };
    });
  };

  // Bookmark Toggle
  const handleBookmarkToggle = (id: string) => {
    setBookmarked((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleShare = () => {
    setIsShareAlert(true);
    setTimeout(() => setIsShareAlert(false), 2000);
  };

  // Define 5 horizontal rows layout segments with customized labels
  const horizontalRows = [
    { label: "Row 1: Our Sweetest First Sparks", startIdx: 0, endIdx: 8 },
    { label: "Row 2: Sunsets & Laughs", startIdx: 8, endIdx: 16 },
    { label: "Row 3: Cozy Hugs & Warm Coffee", startIdx: 16, endIdx: 24 },
    { label: "Row 4: Deep Talks & Moonlights", startIdx: 24, endIdx: 32 },
    { label: "Row 5: Always & Forever Love", startIdx: 32, endIdx: 40 },
  ];

  return (
    <div
      id="photos-section-view"
      className="relative min-h-screen w-full flex flex-col justify-between py-8 px-4 md:px-8 select-none overflow-y-auto"
    >
      {/* Header bar */}
      <header className="relative z-10 w-full max-w-6xl mx-auto flex items-center justify-between pointer-events-auto">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-4 py-2 bg-purple-900/30 hover:bg-purple-900/60 text-purple-200 rounded-full text-xs font-bold border border-purple-500/20 shadow-md cursor-pointer hover:scale-105 active:scale-95 transition-all z-25"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Hub
        </button>
        <span className="font-mono text-[10px] bg-purple-950/70 border border-purple-500/20 text-purple-300 font-bold px-3 py-1 rounded-full flex items-center gap-1">
          <Film className="w-3.5 h-3.5 text-fuchsia-400 font-bold" />
          Memories & Cinema
        </span>
      </header>

      {/* Main Container flow */}
      <div className="relative z-10 w-full max-w-6xl mx-auto space-y-16 my-8">
        {/* CAROUSEL SLIDESHOW SECTION (3D COGNITIVE LOOP RING) */}
        <section id="photos-carousel-section" className="space-y-4">
          <div className="text-center">
            <span className="font-mono text-[9px] uppercase tracking-widest text-fuchsia-400 font-bold bg-[#1b082d] border border-purple-500/20 px-2.5 py-0.5 rounded-full inline-flex items-center gap-1 mb-2">
              <Sparkles className="w-3.5 h-3.5 text-fuchsia-400" />
              Surprise Gallery Loops
            </span>
            <h2 className="font-serif text-3xl font-bold text-purple-50">
              Spinning Ribbon of Love
            </h2>
            <p className="font-sans text-xs text-purple-200/80 max-w-sm mx-auto">
              Our memories auto-rotating in 3D perspective space. Tap any card
              to reveal its sweet hidden message.
            </p>
          </div>

          {/* Premium 3D Circular Loop Wrapper */}
          <div
            className="relative w-full overflow-hidden flex items-center justify-center pt-8 pb-4 transition-all duration-300"
            style={{ height: `${containerHeight}px` }}
          >
            {/* Absolute 3D Stage Viewport */}
            <div
              className="relative transition-all duration-300"
              style={{
                width: `${stageWidth}px`,
                height: `${stageHeight}px`,
                perspective: "1250px",
                transformStyle: "preserve-3d",
              }}
            >
              {/* Spinning Cylindrical Ring of Photos */}
              <div
                className="w-full h-full relative"
                style={{
                  transformStyle: "preserve-3d",
                  transform: `rotateY(${rotationDegrees}deg)`,
                  transition: isAutoSpinning
                    ? "transform 45ms linear"
                    : "transform 0.9s cubic-bezier(0.16, 1, 0.3, 1)",
                }}
              >
                {BIRTHDAY_CONFIG.photos.map((photo, i) => {
                  const angle = i * (360 / BIRTHDAY_CONFIG.photos.length);
                  const isActive = i === activePhotoIndex;

                  return (
                    <div
                      key={photo.id}
                      onClick={() => {
                        if (!isActive) {
                          spinToCardIndex(i);
                        }
                      }}
                      className={`absolute inset-0 transition-all duration-700 cursor-pointer ${
                        isActive
                          ? "scale-100 z-30 opacity-100"
                          : "scale-90 opacity-95 hover:opacity-100"
                      }`}
                      style={{
                        transform: `rotateY(${angle}deg) translateZ(${radius}px)`,
                        transformStyle: "preserve-3d",
                        backfaceVisibility: "visible",
                      }}
                    >
                      {/* elegant card container */}
                      <div
                        className={`absolute inset-0 w-full h-full rounded-2xl md:rounded-3xl overflow-hidden border bg-[#0c0412] flex flex-col justify-between ${
                          isActive
                            ? "border-fuchsia-400 shadow-[0_0_25px_rgba(236,72,153,0.45)]"
                            : "border-purple-500/30 shadow-lg"
                        }`}
                        onClick={(e) => {
                          if (isActive) {
                            e.stopPropagation();
                            setZoomedPhoto({ ...photo, index: i + 1 });
                          }
                        }}
                      >
                        <div className="relative w-full h-full">
                          <img
                            src={photo.filePath}
                            alt={photo.title}
                            className="w-full h-full object-cover select-none pointer-events-none"
                            referrerPolicy="no-referrer"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              if (target.src !== photo.fallbackUrl) {
                                target.src = photo.fallbackUrl;
                              }
                            }}
                          />
                          {/* Elegant dark overlay */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent w-full h-full" />
                          
                          {/* Photo title label badge */}
                          <div className="absolute bottom-3 inset-x-3 p-2 px-3 bg-purple-950/85 backdrop-blur-md rounded-xl border border-purple-500/15 text-center">
                            <h4 className="font-serif text-xs font-bold text-purple-100 truncate">
                              {photo.title}
                            </h4>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Interactive dot indexes (centered inside the ring block) */}
            <div className="absolute bottom-1 flex gap-1.5 z-10">
              {BIRTHDAY_CONFIG.photos.map((_, i) => (
                <button
                  key={i}
                  onClick={() => spinToCardIndex(i)}
                  className={`w-1.5 h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                    activePhotoIndex === i
                      ? "bg-fuchsia-500 w-4.5"
                      : "bg-purple-950/60 hover:bg-purple-800"
                  }`}
                />
              ))}
            </div>
          </div>
        </section>

        {/* MEMORY PHOTO FRAMES arranged in a beautiful, responsive 2x5 grid layout */}
        <section id="photos-memory-frames" className="space-y-12 pt-6">
          <div className="text-center max-w-md mx-auto">
            <span className="font-mono text-[9px] uppercase tracking-widest text-[#d946ef] font-bold bg-[#1b082d] border border-purple-500/20 px-2.5 py-0.5 rounded-full inline-flex items-center gap-1 mb-2">
              <Sparkles className="w-3.5 h-3.5 text-fuchsia-400" />
              Memory Gallery
            </span>
            <h2 className="font-serif text-3xl font-bold text-purple-50">
              Our Photos
            </h2>
            <p className="font-sans text-xs text-purple-200/80 mt-1">
              Explore our beautiful memory photo frames. Tap any card to **flip
              & rotate** it with 3D effects to read my message, or tap the zoom
              icon to view clearly on any smartphone!
            </p>
          </div>
          {/* Render exactly 25 cards in an auto-adjustable grid layout with medium sizing & lovely breathing space */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-5 md:gap-6 max-w-7xl mx-auto px-4 justify-center">
            {BIRTHDAY_CONFIG.galleryPosts.map((post, relativeIdx) => {
              const globalIdx = relativeIdx;
              const photoId = `dyn_p_${globalIdx}`;

              const photoObj: Photo = {
                id: photoId,
                title: post.title,
                filePath: post.filePath,
                fallbackUrl: post.fallbackUrl,
                hiddenMessage: post.message,
              };

              const isFlipped = flippedCardIds[photoId] || false;

              return (
                <div
                  key={photoId}
                  className="w-full max-w-[175px] xs:max-w-[190px] sm:max-w-[210px] md:max-w-[230px] lg:max-w-[245px] mx-auto select-none"
                  style={{ perspective: "1000px" }}
                >
                  {/* 3D Flipping Card Body Container */}
                  <motion.div
                    animate={{ rotateY: isFlipped ? 180 : 0 }}
                    transition={{ duration: 0.6, ease: "easeInOut" }}
                    style={{ transformStyle: "preserve-3d" }}
                    className="relative w-full aspect-[3/4] rounded-xl overflow-visible cursor-pointer"
                  >
                    {/* FRONT SIDE (Styled precisely like an elegant borderless full-bleed ID card photo frame with rose gold glow) */}
                    <div
                      className="absolute inset-0 w-full h-full rounded-xl overflow-hidden border border-fuchsia-500/20 bg-neutral-950 shadow-[0_0_15px_rgba(236,72,153,0.15)] flex flex-col justify-between"
                      style={{ backfaceVisibility: "hidden" }}
                      onClick={() => toggleFlipCard(photoId)}
                    >
                      <div className="relative w-full h-full">
                        <img
                          src={photoObj.fallbackUrl}
                          alt={photoObj.title}
                          className="w-full h-full object-cover select-none pointer-events-none rounded-xl"
                          referrerPolicy="no-referrer"
                        />

                        {/* ID Card Styled elegant overlay caption */}
                        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/95 via-black/55 to-transparent pt-8 pb-3 px-2 text-center select-none">
                          <p className="font-serif text-[11px] xs:text-[13px] md:text-sm text-rose-100 font-extrabold tracking-wide truncate uppercase">
                            {photoObj.title}
                          </p>
                        </div>

                        {/* Top corner cute indicator index */}
                        <span className="absolute top-1.5 right-1.5 px-1.5 py-0.5 rounded bg-black/60 text-white font-mono text-[6px] xs:text-[7.5px] sm:text-[9px] font-bold"></span>

                        {/* Top-left elegant expand icon */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedLightboxIndex(globalIdx);
                          }}
                          className="absolute top-1 left-1 p-0.5 rounded bg-black/60 hover:bg-rose-600 text-white transition-colors border border-white/10"
                          title="Zoom In"
                        >
                          <Maximize2 className="w-1.5 h-1.5 xs:w-2.5 xs:h-2.5" />
                        </button>
                      </div>
                    </div>

                    {/* BACK SIDE (Elegant Scratch Card with White Background and Medium Black Text) */}
                    <div
                      className="absolute inset-0 w-full h-full rounded-xl overflow-hidden shadow-2xl"
                      style={{
                        backfaceVisibility: "hidden",
                        transform: "rotateY(180deg)",
                      }}
                    >
                      <ScratchCard
                        id={photoId}
                        message={photoObj.hiddenMessage}
                        title={photoObj.title}
                        index={relativeIdx + 1}
                        onFlipBack={() => toggleFlipCard(photoId)}
                      />
                    </div>
                  </motion.div>
                </div>
              );
            })}
          </div>

          {/* Bottom special action button - See the Magic! */}
          <div className="pt-10 pb-4 text-center pointer-events-auto">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              className="max-w-md mx-auto"
            >
              <button
                onClick={handleSeeTheMagicClick}
                className="w-full py-4 bg-gradient-to-r from-red-500 via-rose-500 to-fuchsia-600 hover:from-red-400 hover:to-fuchsia-400 text-white rounded-2xl text-sm font-black shadow-[0_0_30px_rgba(244,63,94,0.3)] border border-rose-500/30 flex items-center justify-center gap-2.5 cursor-pointer transition-all uppercase tracking-widest hover:scale-105 active:scale-95"
              >
                <Sparkles className="w-4 h-4 fill-white animate-pulse" />
                See the Magic
              </button>
            </motion.div>
          </div>
        </section>
      </div>

      {/* SUSPENSE TRANSIT: FULLSCREEN BLACK OVERLAY COUNTDOWN */}
      <AnimatePresence>
        {isBlackScreenActive && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-[radial-gradient(circle_at_center,#120424_0%,#030107_100%)] z-[999999] flex flex-col items-center justify-center p-8 text-center select-none"
          >
            {/* Elegant high-end glow background accents instead of any heart */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-fuchsia-500/10 rounded-full blur-[120px] pointer-events-none z-0" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200px] h-[200px] bg-rose-500/10 rounded-full blur-[80px] pointer-events-none z-0" />

            <div className="relative z-10 max-w-lg w-full flex flex-col items-center justify-center">
              {countdownNum === null ? (
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.5 }}
                  className="flex flex-col items-center space-y-5"
                >
                  {/* Immersive minimalist spinner loading state */}
                  <div className="relative w-16 h-16 flex items-center justify-center">
                    <span className="absolute inset-0 rounded-full border-2 border-fuchsia-500/15 border-t-fuchsia-500 animate-spin" />
                    <Sparkles className="w-6 h-6 text-fuchsia-400 animate-pulse" />
                  </div>

                  <h1 className="font-sans text-[10.5px] font-bold uppercase tracking-[0.25em] text-fuchsia-400">
                    GET READY
                  </h1>

                  <p className="font-serif text-lg md:text-xl text-neutral-250 font-medium leading-relaxed max-w-xs">
                    Something extremely special is prepared for you...
                  </p>
                </motion.div>
              ) : (
                <AnimatePresence mode="wait">
                  <motion.div
                    key={countdownNum}
                    initial={{ opacity: 0, scale: 0.25 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.6 }}
                    transition={{
                      type: "spring",
                      stiffness: 160,
                      damping: 14,
                      duration: 0.35,
                    }}
                    className="flex flex-col items-center justify-center"
                  >
                    {/* Subtle countdown header */}
                    <span className="font-sans text-[11px] font-bold uppercase tracking-[0.3em] text-fuchsia-400/70 mb-5">
                      GET READY
                    </span>

                    {/* Stunning glowing typography - high contrast solid white text with bright fuchsia glow */}
                    <span className="font-sans font-black text-9xl md:text-[12rem] leading-none text-white drop-shadow-[0_0_55px_rgba(236,72,153,0.9)] tracking-tighter select-none">
                      {countdownNum}
                    </span>
                  </motion.div>
                </AnimatePresence>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FULL SCREEN SURPRISE IMMERSIVE VIDEO OVERLAY */}
      <AnimatePresence>
        {isFullscreenVideoActive && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 w-full h-full bg-black z-[999999] flex flex-col justify-center items-center pointer-events-auto"
          >
            {/* The Video plays unmuted in full screen viewport */}
            {fullVideoSrc && (
              <video
                ref={fullVideoRef}
                id="fullscreen-cinema-video"
                className="w-full h-full object-contain bg-black"
                controls
                autoPlay
                playsInline
                src={fullVideoSrc}
                onPlay={() => {
                  setIsCinemaPlaying(true);
                }}
                onPlaying={() => {
                  setIsCinemaPlaying(true);
                }}
                onEnded={() => {
                  setIsVideoFinished(true);
                  setIsCinemaPlaying(false);
                }}
                onError={() => {
                  if (fullVideoSrc !== BIRTHDAY_CONFIG.cinemaVideo.fallbackUrl) {
                    setFullVideoSrc(BIRTHDAY_CONFIG.cinemaVideo.fallbackUrl);
                  }
                }}
              />
            )}

            {/* Tap to play overlay fallback if browser blocked unmuted autoplay */}
            <AnimatePresence>
              {!isCinemaPlaying && !isVideoFinished && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-black/75 z-40 flex flex-col items-center justify-center p-6 text-center cursor-pointer backdrop-blur-xs"
                  onClick={() => {
                    if (fullVideoRef.current) {
                      fullVideoRef.current.muted = false;
                      fullVideoRef.current
                        .play()
                        .then(() => {
                          setIsCinemaPlaying(true);
                        })
                        .catch((err) =>
                          console.log("Overlay play failed:", err),
                        );
                    }
                  }}
                >
                  <motion.div
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-20 h-20 rounded-full bg-gradient-to-tr from-fuchsia-500 to-rose-500 flex items-center justify-center text-white shadow-[0_0_40px_rgba(236,72,153,0.5)] mb-5"
                  >
                    <Play className="w-8 h-8 fill-white translate-x-0.5" />
                  </motion.div>
                  <span className="font-serif text-lg text-white font-bold">
                    Tap to Play surprise video
                  </span>
                  <span className="font-sans text-[11px] text-neutral-400 mt-1 uppercase tracking-widest">
                    Unmute your device volume
                  </span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Exit fullscreen button */}
            <button
              onClick={() => {
                setIsFullscreenVideoActive(false);
                setIsVideoFinished(false);
                setIsCinemaPlaying(false);
              }}
              className="absolute top-4 right-4 z-[1000] px-4.5 py-2.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-bold cursor-pointer transition-all hover:scale-105 active:scale-95"
            >
              Exit Cinema
            </button>

            {/* FINISHED VIDEO OVERLAY: Displays "Once More, Happy Birthday My Love! ❤️" as exact text reveal */}
            <AnimatePresence>
              {isVideoFinished && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-[#070110]/98 flex flex-col items-center justify-center p-6 text-center z-50 backdrop-blur-md"
                >
                  <motion.div
                    animate={{ scale: [1, 1.25, 1] }}
                    transition={{ repeat: Infinity, duration: 2.2 }}
                    className="w-20 h-20 bg-rose-500/10 border border-rose-500/30 rounded-full flex items-center justify-center mb-8 text-rose-500 shadow-lg"
                  >
                    <Heart className="w-10 h-10 fill-rose-500 text-rose-500 animate-pulse" />
                  </motion.div>

                  <h1 className="font-serif text-3xl md:text-5xl text-rose-400 font-extrabold leading-tight mb-2 tracking-wide shadow-glow select-text">
                    Once More, Happy Birthday My Love
                  </h1>

                  <h2 className="font-sans font-black text-5xl md:text-7xl lg:text-8xl text-transparent bg-clip-text bg-gradient-to-r from-rose-400 via-fuchsia-400 to-pink-400 drop-shadow-[0_0_35px_rgba(244,63,94,0.6)] uppercase tracking-tight mb-8 select-text">
                    {BIRTHDAY_CONFIG.recipientName}
                  </h2>

                  <h3 className="font-serif text-sm md:text-base text-purple-200/90 max-w-md mx-auto mb-10 leading-relaxed italic select-text">
                    "Every tick of the clock, every single heartbeat, yours
                    forever and always. I love you beyond words."
                  </h3>

                  <div className="flex flex-col gap-3 w-full max-w-[240px]">
                    <button
                      onClick={() => {
                        setIsFullscreenVideoActive(false);
                        setIsCinemaPlaying(false);
                        triggerSpecialVideoReveal();
                      }}
                      className="w-full py-3 bg-gradient-to-r from-red-500 via-rose-500 to-fuchsia-600 hover:from-red-400 hover:to-fuchsia-400 text-white rounded-xl text-xs font-bold shadow-lg shadow-rose-950/40 hover:scale-103 active:scale-97 cursor-pointer transition-all uppercase tracking-widest"
                    >
                      Play Once More
                    </button>
                    <button
                      onClick={() => {
                        setIsFullscreenVideoActive(false);
                        setIsVideoFinished(false);
                        setIsCinemaPlaying(false);
                      }}
                      className="w-full py-3 bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded-xl text-xs font-bold hover:scale-103 active:scale-97 cursor-pointer transition-all uppercase tracking-widest"
                    >
                      Return to Gallery
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

      {/* BEAUTIFUL FULLSCREEN GLASSMORPHIC LIGHTBOX ZOOM MODAL */}
      <AnimatePresence>
        {selectedLightboxIndex !== null &&
          (() => {
            const post = BIRTHDAY_CONFIG.galleryPosts[selectedLightboxIndex];

            const prevPhoto = () => {
              setSelectedLightboxIndex((prev) =>
                prev !== null ? (prev - 1 + 25) % 25 : null,
              );
            };

            const nextPhoto = () => {
              setSelectedLightboxIndex((prev) =>
                prev !== null ? (prev + 1) % 25 : null,
              );
            };

            return (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/95 backdrop-blur-xl z-[999999] flex items-center justify-center p-4 md:p-8"
                onClick={() => setSelectedLightboxIndex(null)}
              >
                {/* Drifting subtle love sparkles in the modal background */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
                  <div className="absolute top-1/4 left-1/3 w-2 h-2 bg-pink-500 rounded-full animate-ping" />
                  <div
                    className="absolute top-3/4 left-1/4 w-3 h-3 bg-fuchsia-500 rounded-full animate-bounce"
                    style={{ animationDuration: "6s" }}
                  />
                  <div className="absolute top-1/2 left-2/3 w-1.5 h-1.5 bg-rose-400 rounded-full animate-pulse" />
                </div>

                {/* Lightbox container */}
                <motion.div
                  initial={{ scale: 0.9, y: 20 }}
                  animate={{ scale: 1, y: 0 }}
                  exit={{ scale: 0.9, y: 20 }}
                  transition={{ type: "spring", damping: 25, stiffness: 180 }}
                  className="relative max-w-4xl w-full bg-gradient-to-b from-[#140825] to-[#07010f] rounded-2xl border border-fuchsia-500/25 shadow-[0_0_50px_rgba(236,72,153,0.3)] overflow-hidden pointer-events-auto flex flex-col md:flex-row"
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Photo half */}
                  <div className="relative w-full md:w-1/2 aspect-square md:aspect-[4/5] bg-black flex items-center justify-center border-b md:border-b-0 md:border-r border-fuchsia-500/10">
                    <img
                      src={post.filePath}
                      alt={post.title}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        if (target.src !== post.fallbackUrl) {
                          target.src = post.fallbackUrl;
                        }
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent pointer-events-none" />

                    {/* Title indicator overlay inside photo */}
                    <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
                      <span className="font-mono text-[9px] font-bold text-fuchsia-300 tracking-wider">
                        MEMORY {selectedLightboxIndex + 1} / 25
                      </span>
                    </div>
                  </div>

                  {/* Love letter text half */}
                  <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col justify-between text-left space-y-4 md:space-y-6">
                    {/* Header info */}
                    <div className="space-y-2">
                      <span className="font-mono text-[9px] uppercase tracking-widest text-[#d946ef] font-bold bg-[#1b082d] border border-purple-500/20 px-2.5 py-0.5 rounded-full inline-flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-fuchsia-400" />
                        Day {selectedLightboxIndex + 1} Whisper
                      </span>
                      <h3 className="font-serif text-xl md:text-2xl font-bold text-purple-100 leading-tight">
                        {post.title}
                      </h3>
                      <p className="font-sans text-xs text-purple-300/60 italic border-l-2 border-rose-500/50 pl-2">
                        {post.caption}
                      </p>
                    </div>

                    {/* Handwritten full body letter message */}
                    <div className="flex-1 overflow-y-auto pr-1 py-1 max-h-[160px] md:max-h-[220px]">
                      <p className="font-serif text-sm md:text-base leading-relaxed italic text-fuchsia-100 whitespace-pre-line bg-purple-950/10 p-3 rounded-xl border border-purple-500/5">
                        "{post.message}"
                      </p>
                    </div>

                    {/* Stamps or bottom footer inside lightbox */}
                    <div className="border-t border-purple-900/30 pt-4 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-500 shadow-sm animate-pulse">
                          💖
                        </div>
                        <span className="font-serif text-[11px] text-purple-300 italic">
                          Yours Forever & Always
                        </span>
                      </div>

                      <button
                        onClick={() => setSelectedLightboxIndex(null)}
                        className="px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/10 text-white rounded-xl text-xs font-bold transition-all hover:scale-105 active:scale-95"
                      >
                        Close Letter
                      </button>
                    </div>
                  </div>

                  {/* Left/Right controls */}
                  <button
                    onClick={prevPhoto}
                    className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 md:w-10 md:h-10 rounded-full bg-black/60 hover:bg-rose-600/80 border border-white/10 text-white flex items-center justify-center backdrop-blur-md transition-colors z-[1000]"
                    title="Previous Memory"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={nextPhoto}
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 md:w-10 md:h-10 rounded-full bg-black/60 hover:bg-rose-600/80 border border-white/10 text-white flex items-center justify-center backdrop-blur-md transition-colors z-[1000]"
                    title="Next Memory"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>

                  {/* Close corner button */}
                  <button
                    onClick={() => setSelectedLightboxIndex(null)}
                    className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/60 hover:bg-red-600 border border-white/10 text-white flex items-center justify-center backdrop-blur-md transition-colors z-[1000]"
                    title="Close"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </motion.div>
              </motion.div>
            );
          })()}
      </AnimatePresence>

      {/* FULL SCREEN ZOOMED INTERACTIVE SCRATCH CARD OVERLAY */}
      <AnimatePresence>
        {zoomedPhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 backdrop-blur-xl z-[99999] flex flex-col items-center justify-center p-4 md:p-6"
            onClick={handleCloseZoomed}
          >
            {/* Glowing background halo */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] sm:w-[450px] sm:h-[450px] bg-fuchsia-500/10 rounded-full blur-[100px] pointer-events-none" />

            <div className="relative z-10 max-w-sm w-full flex flex-col items-center gap-6">
              {/* Informative Header text */}
              <div className="text-center space-y-1">
                <span className="font-mono text-[10px] uppercase tracking-widest text-fuchsia-400 font-bold bg-[#1b082d] border border-purple-500/20 px-3 py-1 rounded-full">
                  Memory #{zoomedPhoto.index}
                </span>
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-purple-100 mt-2">
                  {zoomedPhoto.title}
                </h3>
              </div>

              {/* 3D Flippable Card Stage Container */}
              <div 
                className="relative w-[280px] h-[380px] sm:w-[320px] sm:h-[430px]"
                style={{ perspective: "1200px" }}
                onClick={(e) => e.stopPropagation()}
              >
                <motion.div
                  className="w-full h-full relative"
                  style={{ transformStyle: "preserve-3d" }}
                  animate={{ rotateY: isZoomedFlipped ? 180 : 0 }}
                  transition={{ duration: 0.8, ease: "easeInOut" }}
                >
                  {/* FRONT SIDE (Full Image) */}
                  <div
                    className="absolute inset-0 w-full h-full rounded-2xl sm:rounded-3xl overflow-hidden border border-fuchsia-400/40 bg-[#0c0412] shadow-2xl shadow-fuchsia-500/10"
                    style={{ backfaceVisibility: "hidden" }}
                  >
                    <img
                      src={zoomedPhoto.filePath}
                      alt={zoomedPhoto.title}
                      className="w-full h-full object-cover select-none pointer-events-none"
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        if (target.src !== zoomedPhoto.fallbackUrl) {
                          target.src = zoomedPhoto.fallbackUrl;
                        }
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  </div>

                  {/* BACK SIDE (Scratch Card) */}
                  <div
                    className="absolute inset-0 w-full h-full rounded-2xl sm:rounded-3xl overflow-hidden bg-white shadow-2xl"
                    style={{
                      backfaceVisibility: "hidden",
                      transform: "rotateY(180deg)",
                    }}
                  >
                    <ScratchCard
                      id={zoomedPhoto.id}
                      message={zoomedPhoto.hiddenMessage}
                      title={zoomedPhoto.title}
                      index={zoomedPhoto.index}
                      onFlipBack={handleCloseZoomed}
                    />
                  </div>
                </motion.div>
              </div>

              {/* Action and Instruction Buttons */}
              <div className="flex flex-col items-center gap-2.5 w-full">
                <p className="font-sans text-[11px] text-purple-300/70 italic animate-pulse">
                  {!isZoomedFlipped 
                    ? "Preparing your secret surprise message..." 
                    : "Scratch the surface to reveal the magic! ✨"}
                </p>

                <button
                  onClick={handleCloseZoomed}
                  className="px-6 py-2.5 bg-purple-950/80 border border-purple-500/30 hover:border-fuchsia-400 text-purple-200 hover:text-white rounded-full text-xs font-bold shadow-md hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <span>Put Back in Carousel</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* PLEASE ROTATE THE PHONE DIALOG OVERLAY */}
      <AnimatePresence>
        {isRotatePromptActive && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-neutral-950/98 backdrop-blur-3xl z-[999999] flex flex-col items-center justify-center p-6 text-center select-none"
          >
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-rose-500/10 rounded-full blur-[100px] pointer-events-none z-0" />

            <div className="relative z-10 max-w-sm w-full space-y-6 flex flex-col items-center">
              {/* Rotating phone custom icon */}
              <motion.div
                animate={{ rotate: [0, 90, 90, 0] }}
                transition={{
                  repeat: Infinity,
                  duration: 2.8,
                  ease: "easeInOut",
                  repeatDelay: 1,
                }}
                className="w-20 h-20 bg-rose-500/15 border border-rose-500/30 rounded-3xl flex items-center justify-center text-rose-500 shadow-[0_0_25px_rgba(244,63,94,0.15)]"
              >
                <Smartphone className="w-10 h-10 text-rose-400" />
              </motion.div>

              <div className="space-y-2">
                <h1 className="font-serif text-2xl md:text-3xl text-purple-100 font-extrabold tracking-tight">
                  Please Rotate Your Phone
                </h1>
                <p className="font-sans text-xs text-purple-300/80 leading-relaxed">
                  Turn your device horizontally (to landscape mode) for the
                  ultimate, theater-like widescreen video experience!
                </p>
              </div>

              {/* Action buttons */}
              <div className="w-full space-y-2.5 pt-2">
                <button
                  onClick={() => {
                    setIsRotatePromptActive(false);
                    triggerSpecialVideoReveal();
                  }}
                  className="w-full py-3.5 bg-gradient-to-r from-red-500 via-rose-500 to-fuchsia-600 hover:from-red-400 hover:to-fuchsia-400 text-white rounded-xl text-xs font-black shadow-lg shadow-rose-950/40 uppercase tracking-widest cursor-pointer transition-all active:scale-95 flex items-center justify-center gap-2"
                >
                  <RotateCw className="w-4 h-4" />
                  OK, Rotated! Let's Go
                </button>
                <button
                  onClick={() => {
                    setIsRotatePromptActive(false);
                    triggerSpecialVideoReveal(); // Allow skipping rotation if on desktop/stubborn
                  }}
                  className="text-purple-400 hover:text-white font-mono text-[9px] uppercase tracking-widest cursor-pointer hover:underline"
                >
                  Skip & Play Now
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
