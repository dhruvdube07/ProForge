import React from 'react';

/**
 * AmbientBackground
 * Hardware-accelerated dynamic aurora orbs and precision micro-grid texture
 * that adapt seamlessly to the active theme palette and dark/light modes.
 */
export default function AmbientBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10 select-none ambient-glow-container" aria-hidden="true">
      {/* Floating Aurora Orbs */}
      <div className="ambient-orb ambient-orb-1" />
      <div className="ambient-orb ambient-orb-2" />
      <div className="ambient-orb ambient-orb-3" />
      
      {/* Precision Micro-Grid Texture */}
      <div className="ambient-grid-overlay" />
    </div>
  );
}
