import { useEffect, useRef } from 'react';
import './CelebrationOverlay.css';

/**
 * Generates particle spread positions distributed evenly in a circle.
 * Returns an array of { px, py } values (CSS translate distances).
 */
function generateParticleOffsets(count) {
  const offsets = [];
  const baseRadius = 20; // px from center

  for (let i = 0; i < count; i++) {
    const angle = (2 * Math.PI * i) / count;
    // Add slight randomness to radius so it feels organic
    const radius = baseRadius + (i % 2 === 0 ? 4 : -2);
    const px = Math.round(Math.cos(angle) * radius);
    const py = Math.round(Math.sin(angle) * radius);
    offsets.push({ px, py });
  }

  return offsets;
}

const PARTICLE_OFFSETS = generateParticleOffsets(8);

/**
 * Renders the particle burst effect (Tier 1).
 * Particles are positioned via the `position` prop ({ top, left })
 * which should be the coordinates of the step dot within the sphere.
 */
function ParticleBurst({ position }) {
  return (
    <div
      className="celebration-overlay__particles"
      style={{ top: position.top, left: position.left }}
    >
      {PARTICLE_OFFSETS.map((offset, i) => (
        <div
          key={i}
          className={`celebration-overlay__particle celebration-overlay__particle--${i}`}
          style={{
            '--px': `${offset.px}px`,
            '--py': `${offset.py}px`,
          }}
        />
      ))}
    </div>
  );
}

/**
 * Renders the milestone banner (Tier 2).
 */
function MilestoneBanner() {
  return (
    <div className="celebration-overlay__banner">
      <span className="celebration-overlay__banner-text">Milestone Reached</span>
    </div>
  );
}

/**
 * Renders the unlock micro-toast (Tier 3).
 * Positioned below the unlocked node via `position` prop.
 */
function UnlockToast({ position }) {
  return (
    <div
      className="celebration-overlay__toast"
      style={{ top: position.top, left: position.left }}
    >
      <span className="celebration-overlay__toast-text">
        Новий крок розблоковано
      </span>
    </div>
  );
}

/**
 * CelebrationOverlay -- renders celebration effects within a sphere.
 *
 * Props:
 *   type        -- "step" | "milestone" | "unlock"
 *   onComplete  -- callback when all animations have finished (for cleanup)
 *   dotPosition -- { top, left } of the relevant dot within the sphere (optional)
 */
export default function CelebrationOverlay({ type, onComplete, dotPosition }) {
  const timerRef = useRef(null);

  useEffect(() => {
    // Determine total duration based on type
    let duration;
    switch (type) {
      case 'milestone':
        duration = 2100; // banner lifecycle
        break;
      case 'unlock':
        duration = 1500; // toast lifecycle
        break;
      case 'step':
      default:
        duration = 600; // particle burst
        break;
    }

    timerRef.current = setTimeout(() => {
      if (onComplete) {
        onComplete();
      }
    }, duration);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [type, onComplete]);

  // Default dot position: center-left area (where timeline dots typically are)
  const position = dotPosition || { top: '50%', left: '20px' };

  return (
    <div className="celebration-overlay">
      {/* Tier 1: Particle burst (step + milestone) */}
      {(type === 'step' || type === 'milestone') && (
        <ParticleBurst position={position} />
      )}

      {/* Tier 2: Milestone banner */}
      {type === 'milestone' && <MilestoneBanner />}

      {/* Tier 3: Unlock toast */}
      {type === 'unlock' && <UnlockToast position={position} />}
    </div>
  );
}
