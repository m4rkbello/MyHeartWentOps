import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { motion, useMotionValue } from 'framer-motion';

// IMPORT THE PHOTOS (Assuming JPG as requested)
// Ensure these files exist in your src folder or update paths
import MyPhoto from './photo1.jpg'; // You
import SomeonePhoto from './photo2.jpg'; // Special Someone (LEZZIE)

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
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 1200,
    height: typeof window !== 'undefined' ? window.innerHeight : 800,
  });
  
  const someoneHeartRef = useRef(null); // Reference to her heart
  const constraintsRef = useRef(null); // Reference to container for dragging

  // Position trackers (States, not MotionValues, for robust collision check)
  const [dragX, setDragX] = useState(0);
  const [dragY, setDragY] = useState(0);

  // Track window size for responsive collision thresholds
  useEffect(() => {
    const handleResize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Dynamic romantic text based on state
  const romanticText = useMemo(() => {
    switch (mergeState) {
      case 'merged': return "Two souls, one heartbeat, forever combined in this endless universe.";
      case 'merging': return "Holding you close...";
      default: return windowSize.width < 768 ? "Tap & drag your heart to LEZZIE..." : "Drag your heart to LEZZIE... and let's become one.";
    }
  }, [mergeState, windowSize.width]);

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

    // Responsive Merge threshold (pixels)
    // How close they need to be to trigger merge
    const collisionZone = windowSize.width < 768 ? 70 : 110;
    const snapZone = windowSize.width < 768 ? 50 : 80;

    if (distance < collisionZone && distance > snapZone) {
        // High tension state, visuals change
        setMergeState('merging');
    } else if (distance <= snapZone) {
        // Trigger dynamic snap animation and massive emoji burst
        setMergeState('merged');
        setIsBurstActive(true);
    } else if (distance >= collisionZone && mergeState === 'merging') {
        // Pulled back apart
        setMergeState('separate');
    }

  }, [dragX, dragY, mergeState, windowSize.width]);

  // Clean up burst effect after it finishes
  useEffect(() => {
    if (isBurstActive) {
      const timer = setTimeout(() => setIsBurstActive(false), 2000); // Duration of the full emoji explosion
      return () => clearTimeout(timer);
    }
  }, [isBurstActive]);

  // =========================================
  // 2. CURSOR (Mouse Tracking)
  // =========================================
  
  // --- Custom Heart Cursor State ---
  const [mousePosition, setMousePosition] = useState({ x: -100, y: -100 });
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    // Detect touch device to hide custom cursor
    if (('navigator' in window && window.navigator.maxTouchPoints > 0) || (window.matchMedia && window.matchMedia("(any-pointer: coarse)").matches)) {
        setIsTouch(true);
    }

    const updateMousePosition = (e) => {
      if (isTouch) return;
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", updateMousePosition);
    return () => window.removeEventListener("mousemove", updateMousePosition);
  }, [isTouch]);

  // =========================================
  // 3. COSMIC ELEMENT GENERATION (Sparks, Explosion)
  // =========================================

  // Continuous background sparks
  const backgroundSparks = useMemo(() => {
    const colors = ['#ff4d6d', '#c77dff', '#00f5d4', '#fdfcdc', '#ff9a9e'];
    // Reduce count on mobile for performance
    const count = windowSize.width < 768 ? 40 : 70;
    return Array.from({ length: count }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}vw`,
      top: `${Math.random() * 100}vh`,
      size: `${Math.random() * (windowSize.width < 768 ? 3 : 4) + 1}px`,
      color: colors[Math.floor(Math.random() * colors.length)],
      animationDuration: `${Math.random() * 3 + 2}s`,
      animationDelay: `${Math.random() * 3}s`,
    }));
  }, [windowSize.width]);

  // The Explosive Emoji Overflow Burst (Hearts, In-Love, Flowers)
  const overflowBurst = useMemo(() => {
    if (!isBurstActive) return [];
    
    // Exact types requested
    const emojis = ['💖', '😍', '🌹', '💐', '💘', '🤩', '🌸', '😘'];
    // Reduce count on mobile for performance
    const count = windowSize.width < 768 ? 150 : 300;
    
    return Array.from({ length: count }).map((_, i) => ({
      id: i,
      emoji: emojis[Math.floor(Math.random() * emojis.length)],
      // Explode outwards from the screen center
      left: `${50 + (Math.random() - 0.5) * 90}vw`,
      top: `${50 + (Math.random() - 0.5) * 90}vh`,
      // Smaller emojis on mobile
      size: windowSize.width < 768 ? `${Math.random() * 15 + 15}px` : `${Math.random() * 20 + 20}px`,
      animationDuration: `${Math.random() * 1 + 1}s`, // between 1s and 2s
    }));
  }, [isBurstActive, windowSize.width]);

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
      scale: [0.5, 1.2, 1], // Goes big, then settles. Reduced max scale for mobile safety
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

      {/* CUSTOM CURSOR (Hidden on touch devices, over drag, or during merging) */}
      {!isTouch && (
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
      )}

      {/* MAIN CONTENT */}
      <motion.div
        className="animation-wrapper"
        initial="hidden" animate="visible" variants={containerVariants}
      >
        <motion.p className="project-title" variants={itemVariants}>{projectName}</motion.p>

        {/* INTERACTION AREA - serves as constraints for dragging */}
        <div 
          className={`interaction-area ${mergeState === 'merged' ? 'merged-view' : 'separate-view'}`}
          ref={constraintsRef}
        >
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
                  {/* Photo 1 (You) - Left side */}
                  <image href={MyPhoto} x="-10%" y="0" width="120%" height="100%" preserveAspectRatio="xMidYMid slice" />
                  {/* Photo 2 (Her) - Right side */}
                  <image href={SomeonePhoto} x="12%" y="0" width="120%" height="100%" preserveAspectRatio="xMidYMid slice" />
                  
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
              {/* 1. Her Heart (Target - LEZZIE) */}
              <motion.div
                className={`heart-scene static-target ${mergeState === 'merging' ? 'tension' : ''}`} 
                ref={someoneHeartRef}
                variants={standaloneHeartPulse} animate="animate"
              >
                {/* Universe Stardust Effect behind her photo */}
                <div className="cosmic-halo target-halo stardust-aura" />
                
                <svg className="exact-heart-svg standalone-heart" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
                  <defs><clipPath id="someoneMask"><path d={heartPath} /></clipPath></defs>
                  <image href={SomeonePhoto} clipPath="url(#someoneMask)" width="100%" height="100%" preserveAspectRatio="xMidYMid slice" />
                  
                  {/* PINK BORDER */}
                  <path d={heartPath} className="heart-path-border target-border pink-universe-line" />
                </svg>
                <p className="heart-label her-label">{someoneName.split(' ')[0]}</p>
              </motion.div>

              {/* 2. Your Draggable Heart */}
              <DraggableHeart 
                MyPhoto={MyPhoto} 
                heartPath={heartPath} 
                StandaloneHeartPulse={standaloneHeartPulse} 
                handleDragPosition={handleDragPosition}
                constraintsRef={constraintsRef}
                windowWidth={windowSize.width}
                mergeState={mergeState}
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
const DraggableHeart = ({ MyPhoto, heartPath, StandaloneHeartPulse, handleDragPosition, constraintsRef, windowWidth, mergeState }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Define dynamic scale on hover/tap based on device
  const whileInteraction = windowWidth < 768 
    ? { scale: 1.2, zIndex: 50, transition: {duration: 0.2} } // Mobile tap
    : { scale: 1.1, zIndex: 50 }; // Desktop hover

  return (
    <motion.div
      id="my-draggable-heart"
      className={`heart-scene draggable-heart ${mergeState === 'merging' ? 'tension' : ''}`}
      drag
      dragConstraints={constraintsRef} // Constrain to interaction area
      dragElastic={0.1}
      dragMomentum={false} // Better control for collision on mobile
      // Report position back to main component constantly
      onDrag={() => handleDragPosition(x.get(), y.get())}
      style={{ x, y }}
      whileHover={windowWidth >= 768 ? whileInteraction : {}}
      whileTap={whileInteraction}
      variants={StandaloneHeartPulse}
      animate="animate"
    >
      <svg className="exact-heart-svg standalone-heart" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
        <defs><clipPath id="myMask"><path d={heartPath} /></clipPath></defs>
        <image href={MyPhoto} clipPath="url(#myMask)" width="100%" height="100%" preserveAspectRatio="xMidYMid slice" />
        <path d={heartPath} className="heart-path-border my-stroke" />
      </svg>
      <p className="heart-label my-label">Me</p>
    </motion.div>
  );
};

// =========================================
// 6. CSS STYLES (Restructured for drag layout & new effects)
// =========================================
const styles = `
/* Hide default cursor only on desktop, if not touching */
@media (any-pointer: fine) {
    * { cursor: none !important; }
}

/* Prevent text selection and pull-to-refresh on mobile while dragging */
html, body {
    margin: 0; padding: 0;
    width: 100%; height: 100%;
    overflow: hidden;
    overscroll-behavior: none;
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    user-select: none;
    touch-action: none;
    background: #030308;
}

.main-scene {
  display: flex; justify-content: center; align-items: center;
  height: 100vh; width: 100vw; background: #030308; overflow: hidden; position: relative;
}

/* BACKGROUND ELEMENTS */
.stars, .twinkling, .nebula-gradient {
  position: absolute; top: 0; left: 0; right: 0; bottom: 0;
  width: 100%; height: 100%; display: block;
}
.stars { background: transparent url('https://s3-us-west-2.amazonaws.com/s.cdpn.io/1231630/stars.png') repeat top center; z-index: 0; }
.twinkling {
  background: transparent url('https://s3-us-west-2.amazonaws.com/s.cdpn.io/1231630/twinkling.png') repeat top center;
  z-index: 1; animation: move-twink-back 200s linear infinite; opacity: 0.4;
}
.nebula-gradient {
  z-index: 2;
  background: radial-gradient(circle at center, rgba(100, 20, 150, 0.3) 0%, rgba(255, 77, 109, 0.1) 50%, transparent 80%);
  pointer-events: none;
}
@keyframes move-twink-back { from {background-position: 0 0;} to {background-position: -10000px 5000px;} }

/* COSMIC SPARKS */
.sparks-container { position: absolute; width: 100%; height: 100%; z-index: 3; pointer-events: none; }
.sparkle { position: absolute; border-radius: 50%; opacity: 0; animation: float-and-twinkle ease-in-out infinite; }
@keyframes float-and-twinkle {
  0% { transform: translateY(0) scale(0.5); opacity: 0; }
  50% { opacity: 1; transform: translateY(-30px) scale(1.2); }
  100% { transform: translateY(-60px) scale(0.5); opacity: 0; }
}

/* Dedicated Stardust Merge Effect */
.overflow-container {
  position: absolute; width: 100%; height: 100%; z-index: 99; /* Higher depth */
  pointer-events: none;
  overflow: hidden;
}
.overflow-emoji {
  position: absolute; opacity: 0; font-family: "Segoe UI Emoji", sans-serif;
  animation: stardust-explode-dissolve ease-out forwards;
  will-change: transform, opacity;
}
@keyframes stardust-explode-dissolve {
  0% { transform: translate(-50%, -50%) scale(0.1); opacity: 0; }
  10% { opacity: 1; }
  100% { transform: translate(-50%, -50%) scale(1.5); opacity: 0; }
}

/* CUSTOM HEART CURSOR */
.custom-cursor { position: fixed; top: 0; left: 0; width: 24px; height: 24px; pointer-events: none; z-index: 9999; mix-blend-mode: screen; }
.custom-cursor svg { width: 100%; height: 100%; fill: #ff4d6d; filter: drop-shadow(0 0 8px rgba(255, 77, 109, 0.9)); }

/* MAIN CONTENT & LAYOUT */
.animation-wrapper {
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 10; 
  width: 90%;
  max-width: 1200px;
  height: 90vh;
  justify-content: space-between;
  padding: 2vh 0;
  box-sizing: border-box;
}

.project-title {
  font-size: clamp(0.8rem, 2vw, 1rem);
  font-weight: 600; color: #c77dff; text-transform: uppercase; letter-spacing: 0.3em;
  margin: 0; text-shadow: 0 0 10px rgba(199, 125, 255, 0.6);
}

/* =========================================
   INTERACTION AREA
   ========================================= */
.interaction-area {
  position: relative;
  width: 100%;
  flex-grow: 1; /* Take up available vertical space */
  display: flex;
  justify-content: center;
  align-items: center;
  touch-action: none; /* Crucial for Framer drag on mobile */
  margin: 2vh 0;
  box-sizing: border-box;
}

/* Layout when separate - Desktop: Side by Side */
@media (min-width: 768px) {
    .separate-view {
        justify-content: space-around;
        padding: 0 10%;
    }
}

/* Layout when separate - Mobile: Top/Bottom */
@media (max-width: 767px) {
    .separate-view {
        flex-direction: column-reverse; /* Draggable on bottom, target on top */
        justify-content: space-between;
        padding: 5vh 0;
    }
}

/* Common Styles */
.heart-scene { position: relative; display: flex; flex-direction: column; align-items: center; pointer-events: auto; }
.heart-path-border { fill: transparent; stroke-width: 0.8px; pointer-events: none; transition: all 0.3s ease; }
.heart-label { font-weight: 600; text-transform: uppercase; letter-spacing: 0.2em; margin-top: 10px;}

/* Sizing for standalone hearts based on screen */
.standalone-heart {
    /* Fluid sizing */
    width: clamp(120px, 25vw, 180px);
    height: clamp(120px, 25vw, 180px);
    overflow: visible;
}
.heart-label {
    font-size: clamp(0.7rem, 1.5vw, 0.9rem);
}

/* =========================================
   NEW SPECIFIC STYLES FOR REQUEST
   ========================================= */

/* 1. LEZZIE'S HEART (Static Target) */
.static-target { 
    opacity: 0.9; 
}

/* PINK BORDER FOR LEZZIE */
.pink-universe-line { 
    stroke: #ff69b4; /* Hot Pink */
    stroke-width: 1.2px;
    filter: drop-shadow(0 0 5px rgba(255, 105, 180, 0.8));
}

/* Sparkle/Stardust Stardust Effect behind Lezzie */
.stardust-aura {
  position: absolute;
  width: 120%; height: 120%; top: -10%; left: -10%;
  border-radius: 50%;
  /* Multi-layered Universe glow */
  background: radial-gradient(circle, rgba(255,105,180,0.15) 0%, rgba(199,125,255,0.08) 40%, transparent 70%);
  /* Stardust sparkle effect using multiple box shadows */
  box-shadow: 
    0 0 20px 2px rgba(255, 105, 180, 0.3),
    0 0 40px 4px rgba(199, 125, 255, 0.15),
    inset 0 0 15px rgba(255, 255, 255, 0.1);
  filter: blur(10px); 
  z-index: -1;
  animation: stardust-wobble 5s infinite ease-in-out;
}

@keyframes stardust-wobble {
    0%, 100% { transform: scale(1) translate(0, 0); opacity: 0.8; }
    50% { transform: scale(1.05) translate(2px, -2px); opacity: 1; }
}

.her-label { color: #ffb3c1; text-shadow: 0 0 5px rgba(255, 105, 180, 0.5);}

/* WHEN MERGING (Tension State) */
.heart-scene.tension .standalone-heart {
    filter: drop-shadow(0 0 20px rgba(255, 255, 255, 0.8));
}

/* How Lezzie's border acts when merging */
.heart-scene.tension .target-border {
    stroke: #ffffff;
    stroke-dasharray: 4 4; /* Dashed when merging */
    stroke-width: 1.5px;
    animation: border-dance 0.5s infinite linear;
}

@keyframes border-dance {
    to { stroke-dashoffset: 8; }
}


/* =========================================
   DRAGGABLE HEART (Me)
   ========================================= */
.draggable-heart { transition: none !important; touch-action: none; -webkit-tap-highlight-color: transparent;} 
.my-stroke { stroke: #00f5d4; filter: drop-shadow(0 0 5px rgba(0, 245, 212, 0.8));}
.draggable-heart p { color: #00f5d4; text-shadow: 0 0 5px rgba(0, 245, 212, 0.5);}


/* =========================================
   MERGED STATE visuals
   ========================================= */
.merged-heart-container { position: relative; display: flex; flex-direction: column; align-items: center;}
.big-heart {
  /* Fluid sizing for merged heart */
  width: clamp(280px, 60vw, 600px);
  height: clamp(280px, 60vw, 600px);
  filter: drop-shadow(0 0 30px rgba(255, 77, 109, 0.9));
}
.golden-glow { stroke: #fdfcdc; stroke-width: 1px; filter: drop-shadow(0 0 10px rgba(253, 252, 220, 0.8));} /* Starlight Gold border */

.intense-halo {
  position: absolute;
  width: 150%; height: 150%; top: -25%; left: -25%;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.2) 0%, rgba(255, 77, 109, 0.1) 40%, transparent 70%);
  filter: blur(25px); z-index: -1;
}

/* =========================================
   TEXT STYLES
   ========================================= */
.her-name {
  font-weight: 900; letter-spacing: 0.1em;
  margin: 0;
  line-height: 1.1;
  font-size: clamp(1.5rem, 5vw, 2.8rem);
}

.her-name.pending-reveal {
  opacity: 0.4;
  color: #ffb3c1;
  text-shadow: 0 0 5px rgba(255, 105, 180, 0.3);
}

.her-name.final-reveal {
  color: #ffffff;
  opacity: 1;
  text-shadow: 0 0 10px rgba(255, 255, 255, 0.9), 0 0 30px rgba(255, 77, 109, 0.8);
}

.post-merge-flowers {
  color: #fdfcdc; 
  font-size: clamp(0.8rem, 2vw, 1rem);
  font-style: italic; font-weight: 300; letter-spacing: 0.1em;
  text-shadow: 0 0 10px rgba(253, 252, 220, 0.5);
  margin: 10px 0 0 0;
}

.romantic-subtext {
  color: #ffffff; 
  font-style: italic; font-weight: 300; letter-spacing: 0.05em;
  text-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
  margin: 0;
  font-size: clamp(0.9rem, 2.5vw, 1.2rem);
  max-width: 600px;
  line-height: 1.4;
}
`;

// Inject styles into the head
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement("style");
  styleSheet.type = "text/css";
  styleSheet.innerText = styles;
  document.head.appendChild(styleSheet);
}

export default App;