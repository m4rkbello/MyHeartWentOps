// src/App.js
import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { motion, useMotionValue } from 'framer-motion';

// --- IMPORTS ---
// 1. Photos
import MyPhoto from './photo1.jpg'; // You
import SomeonePhoto from './photo2.jpg'; // Special Someone

// 2. Music
// ADD YOUR MUSIC FILE TO SRC FOLDER (e.g., merge-sound.mp3)
import mergeSoundFile from './Palangga.mp3'; 

const App = () => {
  // Define Name Variables
  const someoneName = "LEZZIE NICE SULMERON MENDEZ";
  const projectName = "MyHeartWentOps";

  // =========================================
  // 1. STATE & MECHANICS (Merge, Collision, Text)
  // =========================================
  
  // Dedicated State Machine: separate | merging | merged
  const [mergeState, setMergeState] = useState('separate');
  const [isBurstActive, setIsBurstActive] = useState(false);
  const someoneHeartRef = useRef(null); // Reference to her heart

  // --- NEW: AUDIO REF ---
  // We create the Audio object once and store it in a ref so it doesn't reload.
  const audioRef = useRef(new Audio(mergeSoundFile));

  // Position trackers (States, not MotionValues, for robust collision check)
  const [dragX, setDragX] = useState(0);
  const [dragY, setDragY] = useState(0);

  // Dynamic romantic text based on state
  const romanticText = useMemo(() => {
    switch (mergeState) {
      case 'merged': return "Two souls, one heartbeat, forever combined in this endless universe.";
      case 'merging': return "We are becoming one...";
      default: return "Drag your heart to mine... and let's become one.";
    }
  }, [mergeState]);

  // Handle Drag Position Updates from child
  const handleDragPosition = useCallback((x, y) => {
    setDragX(x);
    setDragY(y);
  }, []);

  // Check for Collision/Merge on position change
  useEffect(() => {
    if (mergeState !== 'separate' || !someoneHeartRef.current) return;

    // Get Special Someone's heart position relative to viewport
    const someoneRect = someoneHeartRef.current.getBoundingClientRect();
    const someoneCenterX = someoneRect.left + someoneRect.width / 2;
    const someoneCenterY = someoneRect.top + someoneRect.height / 2;

    // Get current position of "Your Heart" too.
    const myHeartEl = document.getElementById('my-draggable-heart');
    if (!myHeartEl) return;
    const myRect = myHeartEl.getBoundingClientRect();
    const myCenterX = myRect.left + myRect.width / 2;
    const myCenterY = myRect.top + myRect.height / 2;

    // Pythagorean theorem to find distance between centers
    const distance = Math.sqrt(
      Math.pow(someoneCenterX - myCenterX, 2) +
      Math.pow(someoneCenterY - myCenterY, 2)
    );

    // Merge threshold (pixels)
    const threshold = 120;

    if (distance < threshold) {
      // Trigger dynamic snap animation and massive emoji burst
      setMergeState('merging');
      setIsBurstActive(true);

      // --- NEW: PLAY MUSIC ---
      // Browsers require a user interaction (like dragging) to allow audio.
      audioRef.current.play().catch(error => {
        console.log("Audio play failed. Usually browser direct interaction policy:", error);
      });
      
      // If you want the music to loop:
      // audioRef.current.loop = true;

      // Small delay before finalizing the view, for the explosion to pop
      setTimeout(() => setMergeState('merged'), 200); 
    }
  }, [dragX, dragY, mergeState]);

  // Clean up burst effect after it finishes
  useEffect(() => {
    if (isBurstActive) {
      const timer = setTimeout(() => setIsBurstActive(false), 2000); // Duration of the full emoji explosion
      return () => clearTimeout(timer);
    }
  }, [isBurstActive]);

  // --- NEW: CLEANUP AUDIO ---
  // Stop the music if the user closes the component/app
  useEffect(() => {
    const currentAudio = audioRef.current;
    return () => {
      currentAudio.pause();
      currentAudio.currentTime = 0; // Reset to start
    };
  }, []);

  // =========================================
  // 2. CURSOR (Mouse Tracking)
  // =========================================
  
  // --- Custom Heart Cursor State ---
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const updateMousePosition = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", updateMousePosition);
    return () => window.removeEventListener("mousemove", updateMousePosition);
  }, []);

  // =========================================
  // 3. COSMIC ELEMENT GENERATION (Sparks, Explosion)
  // =========================================

  // Continuous background sparks
  const backgroundSparks = useMemo(() => {
    const colors = ['#ff4d6d', '#c77dff', '#00f5d4', '#fdfcdc', '#ff9a9e'];
    return Array.from({ length: 70 }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}vw`,
      top: `${Math.random() * 100}vh`,
      size: `${Math.random() * 4 + 1}px`,
      color: colors[Math.floor(Math.random() * colors.length)],
      animationDuration: `${Math.random() * 3 + 2}s`,
      animationDelay: `${Math.random() * 3}s`,
    }));
  }, []);

  // The Explosive Emoji Overflow Burst (Hearts, In-Love, Flowers)
  const overflowBurst = useMemo(() => {
    if (!isBurstActive) return [];
    
    // Exact types requested
    const emojis = ['💖', '😍', '🌹', '💐', '💘', '🤩', '🌸', '😘'];
    
    return Array.from({ length: 300 }).map((_, i) => ({
      id: i,
      emoji: emojis[Math.floor(Math.random() * emojis.length)],
      // Explode outwards from the screen center
      left: `${50 + (Math.random() - 0.5) * 80}vw`,
      top: `${50 + (Math.random() - 0.5) * 80}vh`,
      size: `${Math.random() * 20 + 20}px`, // Large emojis, 20px-40px
      animationDuration: `${Math.random() * 1 + 1}s`, // between 1s and 2s
    }));
  }, [isBurstActive]);

  // =========================================
  // 4. ANIMATION VARIANTS & PATHS
  // =========================================
  
  // Standalone heartbeat pulse for separate states
  const standaloneHeartPulse = {
    animate: {
      scale: [1, 1.05, 1],
      transition: { repeat: Infinity, duration: 2, ease: "easeInOut" }
    }
  };

  // The dramatic "Snap & Grow" animation when merging
  const mergedHeartVariants = {
    initial: { scale: 0.5, opacity: 0 },
    animate: {
      scale: [0.5, 1.6, 1], // Goes very big, then settles
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: [0.34, 1.56, 0.64, 1], // Elastic ease
      }
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.5 } }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 1, ease: "easeOut" } }
  };

  // The EXACT SVG Heart Path
  const heartPath = "M16 28.5L4.65 17.15C2.65 15.15 1.5 12.5 1.5 9.5C1.5 6.5 3.92 3.5 7.5 3.5C9.74 3.5 11.62 4.44 13 6C14.38 4.44 16.26 3.5 18.5 3.5C22.08 3.5 24.5 6.5 24.5 9.5C24.5 12.5 23.35 15.15 21.35 17.15L16 28.5Z";

  // --- Render Components ---
  return (
    <div className="main-scene">
      {/* BACKGROUND */}
      <div className="stars"></div>
      <div className="twinkling"></div>
      <div className="nebula-gradient"></div>

      {/* CONTINUOUS SPARKS */}
      <div className="sparks-container">
        {backgroundSparks.map((spark) => (
          <div
            key={spark.id}
            className="sparkle"
            style={{
              left: spark.left, top: spark.top, width: spark.size, height: spark.size,
              backgroundColor: spark.color, boxShadow: `0 0 10px 2px ${spark.color}60`,
              animationDuration: spark.animationDuration, animationDelay: spark.animationDelay,
            }}
          />
        ))}
      </div>

      {/* OVERFLOW EMOJI EXPLOSION ON MERGE */}
      {isBurstActive && (
        <div className="overflow-container">
          {overflowBurst.map((particle) => (
            <p
              key={particle.id}
              className="overflow-emoji"
              style={{
                left: particle.left, top: particle.top, fontSize: particle.size,
                animationDuration: particle.animationDuration,
              }}
            >
              {particle.emoji}
            </p>
          ))}
        </div>
      )}

      {/* CUSTOM CURSOR (Hidden over drag or during merging) */}
      <motion.div className="custom-cursor" 
        style={{ 
          left: mousePosition.x - 12, 
          top: mousePosition.y - 12, 
          opacity: (mergeState === 'merging' || mergeState === 'merged') ? 0 : 1 
        }}
        animate={{ transition: { type: "spring", mass: 0.1, stiffness: 800, damping: 35 } }}
      >
        <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
          <path d={heartPath} />
        </svg>
      </motion.div>

      {/* MAIN CONTENT */}
      <motion.div
        className="animation-wrapper"
        initial="hidden" animate="visible" variants={containerVariants}
      >
        <motion.p className="project-title" variants={itemVariants}>{projectName}</motion.p>

        {/* INTERACTION AREA */}
        <div className={`interaction-area ${mergeState === 'merged' ? 'merged-view' : 'separate-view'}`}>
          {mergeState === 'merged' ? (
            
            // --- A: THE BIG, EXACT MERGED HEART ---
            <motion.div
              className="big-heart-scene"
              variants={mergedHeartVariants} initial="initial" animate="animate"
            >
              <div className="cosmic-halo intense-halo" />
              
              <svg className="exact-heart-svg big-exact" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <clipPath id="mergedMask">
                    <path d={heartPath} />
                  </clipPath>
                </defs>

                {/* THE MERGED PHOTOS SIDE-BY-SIDE WITHIN EXACT SHAPE */}
                <g clipPath="url(#mergedMask)">
                  {/* Photo 1 (You) - Left side, filling more space */}
                  <image href={MyPhoto} x="-10" y="0" width="120%" height="100%" preserveAspectRatio="xMidYMid slice" />
                  {/* Photo 2 (Her) - Right side, filling more space */}
                  <image href={SomeonePhoto} x="12" y="0" width="120%" height="100%" preserveAspectRatio="xMidYMid slice" />
                  
                  {/* Subtle divider line */}
                  <line x1="16" y1="5" x2="16" y2="28" stroke="white" strokeWidth="0.1" opacity="0.3"/>
                </g>

                {/* THE GOLDEN GLOWING BORDER */}
                <path d={heartPath} className="heart-path-border golden-glow" />
              </svg>

              {/* PERMANENT POST-MERGE FLOWERS */}
              <p className="post-merge-flowers">🌹 Bouquet of Us 💐</p>
            </motion.div>

          ) : (
            // --- B: SEPARATE HEARTS (DRAGGABLE) ---
            <>
              {/* 1. Her Heart (Target) */}
              <motion.div
                className="heart-scene static-target" ref={someoneHeartRef}
                variants={standaloneHeartPulse} animate="animate"
              >
                <div className="cosmic-halo target-halo" />
                <svg className="exact-heart-svg" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
                  <defs><clipPath id="someoneMask"><path d={heartPath} /></clipPath></defs>
                  <image href={SomeonePhoto} clipPath="url(#someoneMask)" width="100%" height="100%" preserveAspectRatio="xMidYMid slice" />
                  <path d={heartPath} className="heart-path-border target-border" />
                </svg>
                <p className="heart-label her-label">{someoneName.split(' ')[0]}</p>
              </motion.div>

              {/* 2. Your Draggable Heart (uses separate motion values) */}
              <DraggableHeart 
                MyPhoto={MyPhoto} 
                heartPath={heartPath} 
                StandaloneHeartPulse={standaloneHeartPulse} 
                handleDragPosition={handleDragPosition}
              />
            </>
          )}
        </div>

        {/* Her Name (Fades in dramatically when merged) */}
        <motion.h1 
          className={`her-name ${mergeState === 'merged' ? 'final-reveal' : 'pending-reveal'}`} 
          variants={itemVariants}
        >
          {someoneName}
        </motion.h1>

        {/* Romantic Text (Changes when merged) */}
        <motion.p className="romantic-subtext" key={mergeState} variants={itemVariants}>
          {romanticText}
        </motion.p>
      </motion.div>
    </div>
  );
};

// =========================================
// 5. DRAGGABLE HEART COMPONENT (Handles its own drag state)
// =========================================
const DraggableHeart = ({ MyPhoto, heartPath, StandaloneHeartPulse, handleDragPosition }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  return (
    <motion.div
      id="my-draggable-heart"
      className="heart-scene draggable-heart"
      drag
      dragConstraints={{ left: -500, right: 500, top: -300, bottom: 300 }}
      dragElastic={0.2}
      // Report position back to main component constantly
      onDrag={() => handleDragPosition(x.get(), y.get())}
      style={{ x, y }}
      whileDrag={{ scale: 1.1, zIndex: 50 }}
      variants={StandaloneHeartPulse}
      animate="animate"
    >
      <svg className="exact-heart-svg" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
        <defs><clipPath id="myMask"><path d={heartPath} /></clipPath></defs>
        <image href={MyPhoto} clipPath="url(#myMask)" width="100%" height="100%" preserveAspectRatio="xMidYMid slice" />
        <path d={heartPath} className="heart-path-border my-stroke" />
      </svg>
      <p className="heart-label my-label">Me</p>
    </motion.div>
  );
};

// =========================================
// 6. CSS STYLES
// =========================================
const styles = `
* { cursor: none !important; }
.main-scene {
  display: flex; justify-content: center; align-items: center;
  height: 100vh; width: 100vw; background: #030308; overflow: hidden; position: relative;
}

/* BACKGROUND ELEMENTS */
.stars, .twinkling, .nebula-gradient {
  position: absolute; top: 0; left: 0; right: 0; bottom: 0; width: 100%; height: 100%; display: block;
}
.stars { background: transparent url('https://s3-us-west-2.amazonaws.com/s.cdpn.io/1231630/stars.png') repeat top center; z-index: 0; }
.twinkling { background: transparent url('https://s3-us-west-2.amazonaws.com/s.cdpn.io/1231630/twinkling.png') repeat top center;
  z-index: 1; animation: move-twink-back 200s linear infinite; opacity: 0.4;
}
.nebula-gradient { z-index: 2; pointer-events: none;
  background: radial-gradient(circle at center, rgba(100, 20, 150, 0.2) 0%, rgba(200, 50, 100, 0.05) 50%, transparent 80%);
}
@keyframes move-twink-back { from {background-position: 0 0;} to {background-position: -10000px 5000px;} }

/* COSMIC SPARKS */
.sparks-container { position: absolute; width: 100%; height: 100%; z-index: 3; pointer-events: none; }
.sparkle { position: absolute; border-radius: 50%; opacity: 0; animation: float-and-twinkle ease-in-out infinite; }
@keyframes float-and-twinkle {
  0% { transform: translateY(0) scale(0.5); opacity: 0; }
  50% { opacity: 1; transform: translateY(-30px) scale(1.2); }
’ 100% { transform: translateY(-60px) scale(0.5); opacity: 0; }
}

/* THE OVERFLOW EMOJI BURST (Hearts, In-Love, Flowers) */
.overflow-container {
  position: absolute; width: 100%; height: 100%; z-index: 99; /* Highest depth */
  pointer-events: none;
}
.overflow-emoji {
  position: absolute; opacity: 0; font-family: "Segoe UI Emoji", sans-serif;
  animation: stardust-explode-dissolve ease-out forwards;
}
@keyframes stardust-explode-dissolve {
  0% { transform: scale(0.1) rotate(0deg); opacity: 0; }
  10% { opacity: 1; }
  90% { opacity: 1; }
  100% { transform: scale(1.6) rotate(30deg); opacity: 0; }
}

/* CUSTOM HEART CURSOR */
.custom-cursor { position: fixed; top: 0; left: 0; width: 24px; height: 24px; pointer-events: none; z-index: 9999; }
.custom-cursor svg { width: 100%; height: 100%; fill: #ff4d6d; filter: drop-shadow(0 0 8px rgba(255, 77, 109, 0.9)); }

/* MAIN LAYOUT */
.animation-wrapper {
  text-align: center; display: flex; flex-direction: column; align-items: center; z-index: 10; width: 90%;
}
.project-title { font-size: 1rem; font-weight: 600; color: #c77dff; text-transform: uppercase; letter-spacing: 5px; margin-bottom: 2rem; text-shadow: 0 0 10px rgba(199, 125, 255, 0.6); }

/* INTERACTION AREA */
.interaction-area { position: relative; width: 100%; height: 400px; display: flex; justify-content: center; align-items: center; }
.separate-view { justify-content: space-around; }

/* STANDALONE HEARTS */
.heart-scene { position: relative; display: flex; flex-direction: column; align-items: center; }
.exact-heart-svg { width: 180px; height: 180px; filter: drop-shadow(0 0 15px rgba(255, 77, 109, 0.6)); transition: filter 0.3s ease;}
.heart-path-border { fill: transparent; stroke-width: 0.8px; pointer-events: none; }
.heart-label { color: #ffb3c1; font-size: 0.9rem; margin-top: 10px; font-weight: 600; text-transform: uppercase; letter-spacing: 2px; }

.her-label { color: #c77dff; text-shadow: 0 0 5px rgba(199, 125, 255, 0.5);}
.target-border { stroke: #c77dff; stroke-dasharray: 2 2; stroke-width: 0.5px;}

.my-stroke { stroke: #00f5d4; }
.my-label { color: #00f5d4;}

/* Target Halo */
.target-halo {
  position: absolute; width: 220px; height: 220px;
  background: radial-gradient(circle, rgba(199, 125, 255, 0.3) 0%, transparent 70%); filter: blur(15px); z-index: -1;
}

/* Draggable Fix for Framer */
.draggable-heart { transition: none !important; }

/* THE BIG, EXACT MERGED HEART */
.big-exact {
  /* CHANGED: Increased size from 380px to 600px */
  width: 600px !important; height: 600px !important;
  filter: drop-shadow(0 0 30px rgba(255, 77, 109, 0.9));
}
.golden-glow { stroke: #fdfcdc; stroke-width: 1px;}
.intense-halo {
  position: absolute;
  /* CHANGED: Increased size and adjusted positioning to center the larger glow */
  width: 800px; height: 800px; top: -100px; left: -100px;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.3) 0%, rgba(255, 77, 109, 0.2) 40%, transparent 70%); filter: blur(25px); z-index: -1;
}

/* Post-Merge Decorative Flowers */
.post-merge-flowers {
  color: #ffb3c1; font-size: 1rem; margin-top: 15px; font-weight: 300; font-style: italic; letter-spacing: 1px;
  text-shadow: 0 0 8px rgba(255, 179, 193, 0.5);
}

/* TEXT STYLES */
.her-name { font-size: 2.8rem; color: #ffffff; font-weight: 900; letter-spacing: 2px; margin-bottom: 0.5rem; }
.her-name.pending-reveal { opacity: 0.4; text-shadow: 0 0 5px rgba(255, 255, 255, 0.3); margin-top: 1rem; }
.her-name.final-reveal { opacity: 1; text-shadow: 0 0 10px rgba(255, 255, 255, 0.9), 0 0 30px rgba(255, 77, 109, 0.9); margin-top: 1.5rem; }
.romantic-subtext { font-size: 1.2rem; color: #fdfcdc; font-style: italic; font-weight: 300; letter-spacing: 1px; text-shadow: 0 0 10px rgba(253, 252, 220, 0.5); margin-top: 0.5rem; min-height: 1.6rem; }
`;

// Inject styles into the head
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement("style");
  styleSheet.type = "text/css";
  styleSheet.innerText = styles;
  document.head.appendChild(styleSheet);
}

export default App;