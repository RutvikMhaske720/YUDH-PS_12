'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Sliders, Play, Pause, RotateCcw, Activity, LineChart } from 'lucide-react';

interface InteractiveElementProps {
  element: {
    type: 'desmos_graph' | 'physics_simulation';
    sim_type?: 'projectile' | 'pendulum' | 'wave';
    title: string;
    description?: string;
    formula?: string;
    params?: Array<{
      name: string;
      label: string;
      min: number;
      max: number;
      step: number;
      default: number;
    }>;
  };
}

export default function InteractiveCanvas({ element }: InteractiveElementProps) {
  // Initialize slider states from params
  const initialParams: Record<string, number> = {};
  if (element.params) {
    element.params.forEach(p => {
      initialParams[p.name] = p.default;
    });
  }

  const [params, setParams] = useState<Record<string, number>>(initialParams);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [simTime, setSimTime] = useState<number>(0);

  // Animation frame loop for dynamic physics simulation
  useEffect(() => {
    let animId: number;
    if (isPlaying) {
      const step = () => {
        setSimTime(t => (t + 0.04));
        animId = requestAnimationFrame(step);
      };
      animId = requestAnimationFrame(step);
    }
    return () => cancelAnimationFrame(animId);
  }, [isPlaying]);

  const updateParam = (name: string, val: number) => {
    setParams(prev => ({ ...prev, [name]: val }));
  };

  const handleReset = () => {
    setSimTime(0);
    setParams(initialParams);
  };

  const isDesmos = element.type === 'desmos_graph' || element.sim_type === 'wave';
  const isProjectile = element.sim_type === 'projectile';
  const isPendulum = element.sim_type === 'pendulum';

  // 1. DESMOS / FUNCTION PLOTTER CALCULATIONS
  const a = params['a'] ?? 0.5;
  const b = params['b'] ?? 0.0;
  const c = params['c'] ?? 0.0;

  const points: { x: number; y: number }[] = [];
  const svgWidth = 500;
  const svgHeight = 220;

  if (isDesmos) {
    for (let x = -8; x <= 8; x += 0.25) {
      // y = a * x^2 + b * x + c  OR wave
      let y = 0;
      if (element.title.toLowerCase().includes('wave')) {
        y = a * Math.sin(b * x - simTime * 2) + c;
      } else {
        y = a * Math.pow(x, 2) + b * x + c;
      }
      points.push({ x, y });
    }
  }

  // 2. PROJECTILE SIMULATION CALCULATIONS
  const v0 = params['velocity'] ?? 25;
  const angleDeg = params['angle'] ?? 45;
  const g = params['gravity'] ?? 9.8;
  const rad = (angleDeg * Math.PI) / 180;

  const vx = v0 * Math.cos(rad);
  const vy = v0 * Math.sin(rad);
  const flightTime = (2 * vy) / g;
  const maxRange = (v0 * v0 * Math.sin(2 * rad)) / g;
  const maxHeight = (vy * vy) / (2 * g);

  // Normalized trajectory curve points for projectile
  const projectilePoints: { x: number; y: number }[] = [];
  for (let t = 0; t <= flightTime; t += flightTime / 40) {
    const px = vx * t;
    const py = vy * t - 0.5 * g * t * t;
    projectilePoints.push({ x: px, y: Math.max(0, py) });
  }

  // Current ball position in time loop
  const curT = flightTime > 0 ? (simTime % (flightTime + 0.8)) : 0;
  const ballX = Math.min(maxRange, vx * Math.min(curT, flightTime));
  const ballY = Math.max(0, vy * Math.min(curT, flightTime) - 0.5 * g * Math.pow(Math.min(curT, flightTime), 2));

  // Mapping projectile coordinates to SVG canvas viewBox: (0 0 500 200)
  const scaleX = maxRange > 0 ? 440 / Math.max(maxRange, 10) : 1;
  const scaleY = maxHeight > 0 ? 150 / Math.max(maxHeight, 10) : 1;

  return (
    <div style={{
      background: '#FAF7F2',
      border: '1px solid #3D6B5E40',
      borderRadius: 14,
      padding: 16,
      margin: '16px 0',
      boxShadow: '0 4px 16px rgba(0,0,0,0.04)',
      fontFamily: 'var(--font-sans, system-ui)'
    }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #1C2B2715', paddingBottom: 10, marginBottom: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {isDesmos ? (
            <LineChart style={{ width: 18, height: 18, color: '#3D6B5E' }} />
          ) : (
            <Activity style={{ width: 18, height: 18, color: '#D48A55' }} />
          )}
          <span style={{ fontWeight: 700, fontSize: '0.9rem', color: '#1C2B27' }}>
            {element.title}
          </span>
        </div>
        <span style={{
          background: '#3D6B5E15',
          color: '#23493D',
          fontSize: '0.72rem',
          fontWeight: 700,
          padding: '3px 10px',
          borderRadius: 9999,
          textTransform: 'uppercase',
          letterSpacing: '0.04em'
        }}>
          {element.type === 'desmos_graph' ? 'Desmos Curve Engine' : 'Dynamic Physics Engine'}
        </span>
      </div>

      {element.description && (
        <p style={{ fontSize: '0.8rem', color: '#526058', marginBottom: 12 }}>
          {element.description}
        </p>
      )}

      {/* CANVAS CONTAINER */}
      <div style={{
        background: '#FFFFFF',
        borderRadius: 10,
        border: '1px solid #1C2B2715',
        position: 'relative',
        overflow: 'hidden',
        height: 220,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        {/* Grid lines background */}
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'linear-gradient(to right, #1c2b270a 1px, transparent 1px), linear-gradient(to bottom, #1c2b270a 1px, transparent 1px)',
          backgroundSize: '20px 20px'
        }} />

        {/* 1. Desmos Curve Render */}
        {isDesmos && (
          <svg viewBox="-10 -15 20 30" style={{ width: '100%', height: '100%', position: 'relative', zIndex: 10, overflow: 'visible' }}>
            {/* Axis Lines */}
            <line x1="-10" y1="0" x2="10" y2="0" stroke="#1C2B27" strokeWidth="0.25" opacity="0.3" />
            <line x1="0" y1="-15" x2="0" y2="15" stroke="#1C2B27" strokeWidth="0.25" opacity="0.3" />

            {/* Path */}
            <path
              d={points.reduce((acc, p, i) => `${acc} ${i === 0 ? 'M' : 'L'} ${p.x} ${-p.y}`, '')}
              fill="none"
              stroke="#23493D"
              strokeWidth="0.7"
            />

            {/* Live Focus Dot */}
            <circle cx="2" cy={-(a * 4 + b * 2 + c)} r="0.6" fill="#D48A55" />
          </svg>
        )}

        {/* 2. Projectile Motion Simulation */}
        {isProjectile && (
          <svg viewBox="0 0 500 200" style={{ width: '100%', height: '100%', position: 'relative', zIndex: 10 }}>
            {/* Ground Line */}
            <line x1="30" y1="180" x2="480" y2="180" stroke="#1C2B27" strokeWidth="2" opacity="0.4" />
            
            {/* Launch base */}
            <circle cx="30" cy="180" r="4" fill="#23493D" />

            {/* Trajectory Arc */}
            <path
              d={projectilePoints.reduce((acc, p, i) => `${acc} ${i === 0 ? 'M' : 'L'} ${30 + p.x * scaleX} ${180 - p.y * scaleY}`, '')}
              fill="none"
              stroke="#23493D"
              strokeWidth="2.5"
              strokeDasharray="4 4"
              opacity="0.8"
            />

            {/* Animated Projectile Ball */}
            <circle
              cx={30 + ballX * scaleX}
              cy={180 - ballY * scaleY}
              r="7"
              fill="#D48A55"
              stroke="#FFFFFF"
              strokeWidth="2"
            />

            {/* Velocity Vector Arrow */}
            <line
              x1={30 + ballX * scaleX}
              y1={180 - ballY * scaleY}
              x2={30 + ballX * scaleX + (vx * 0.4)}
              y2={180 - ballY * scaleY - (vy * 0.4 - g * curT * 0.4)}
              stroke="#D48A55"
              strokeWidth="1.5"
              opacity="0.6"
            />
          </svg>
        )}

        {/* 3. Pendulum Simulation */}
        {isPendulum && (
          <div style={{ position: 'relative', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg viewBox="-100 0 200 200" style={{ width: 220, height: 200 }}>
              <circle cx="0" cy="20" r="5" fill="#1C2B27" />
              {/* Calculate pendulum swing angle */}
              {(() => {
                const len = params['length'] ?? 1.0;
                const damp = params['damping'] ?? 0.05;
                const theta0 = ((params['initial_theta'] ?? 30) * Math.PI) / 180;
                const omega = Math.sqrt(9.8 / len);
                const curTheta = theta0 * Math.exp(-damp * simTime) * Math.cos(omega * simTime);
                const bobX = 140 * Math.sin(curTheta);
                const bobY = 20 + 140 * Math.cos(curTheta);

                return (
                  <>
                    <line x1="0" y1="20" x2={bobX} y2={bobY} stroke="#23493D" strokeWidth="2.5" />
                    <circle cx={bobX} cy={bobY} r="14" fill="#D48A55" stroke="#FFFFFF" strokeWidth="2" />
                  </>
                );
              })()}
            </svg>
          </div>
        )}

        {/* Overlay Formula / Stats Badge */}
        <div style={{
          position: 'absolute',
          bottom: 8,
          left: 12,
          right: 12,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: 'rgba(255, 255, 255, 0.92)',
          backdropFilter: 'blur(4px)',
          padding: '4px 12px',
          borderRadius: 6,
          fontSize: '0.74rem',
          fontFamily: 'monospace',
          color: '#3E4F49',
          zIndex: 20
        }}>
          <span>{element.formula || 'Interactive Derivation Model'}</span>
          {isProjectile && (
            <span>Range R: {maxRange.toFixed(1)}m | Max Height H: {maxHeight.toFixed(1)}m | Flight: {flightTime.toFixed(1)}s</span>
          )}
          {isDesmos && (
            <span>Params: a={a} | b={b} | c={c}</span>
          )}
        </div>
      </div>

      {/* PARAMETER SLIDERS & CONTROLS */}
      <div style={{ marginTop: 14, display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap: 12 }}>
          {element.params?.map((p) => (
            <div key={p.name} style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.74rem', fontWeight: 600, color: '#3E4F49' }}>
                <span>{p.label}</span>
                <span style={{ fontFamily: 'monospace', color: '#23493D' }}>{params[p.name] ?? p.default}</span>
              </div>
              <input
                type="range"
                min={p.min}
                max={p.max}
                step={p.step}
                value={params[p.name] ?? p.default}
                onChange={(e) => updateParam(p.name, parseFloat(e.target.value))}
                style={{ accentColor: '#23493D', cursor: 'pointer', height: 4 }}
              />
            </div>
          ))}
        </div>

        {/* Playback Controls for Simulations */}
        {(isProjectile || isPendulum || element.title.toLowerCase().includes('wave')) && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 8, paddingTop: 4 }}>
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 5,
                background: isPlaying ? '#23493D' : '#D48A55',
                color: '#FFF',
                border: 'none',
                padding: '5px 12px',
                borderRadius: 6,
                fontSize: '0.74rem',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              {isPlaying ? <Pause style={{ width: 12, height: 12 }} /> : <Play style={{ width: 12, height: 12 }} />}
              <span>{isPlaying ? 'Pause Simulation' : 'Resume Simulation'}</span>
            </button>
            <button
              onClick={handleReset}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 5,
                background: '#FAF7F2',
                color: '#526058',
                border: '1px solid #1C2B2720',
                padding: '5px 12px',
                borderRadius: 6,
                fontSize: '0.74rem',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              <RotateCcw style={{ width: 12, height: 12 }} />
              <span>Reset</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
