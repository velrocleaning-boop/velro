"use client";
import React from 'react';
import { Sparkles } from 'lucide-react';

export default function Loading() {
  return (
    <div style={{ 
      position: 'fixed', 
      inset: 0, 
      backgroundColor: 'white', 
      display: 'flex', 
      flexDirection: 'column',
      alignItems: 'center', 
      justifyContent: 'center',
      zIndex: 9999
    }}>
      <div style={{ position: 'relative' }}>
        <Sparkles 
          size={60} 
          color="var(--primary)" 
          style={{ 
            animation: 'pulse 1.5s ease-in-out infinite' 
          }} 
        />
        <style dangerouslySetInnerHTML={{ __html: `
          @keyframes pulse {
            0% { transform: scale(0.9); opacity: 0.5; }
            50% { transform: scale(1.1); opacity: 1; }
            100% { transform: scale(0.9); opacity: 0.5; }
          }
        `}} />
      </div>
      <p style={{ marginTop: '1.5rem', fontWeight: 700, color: '#111827', letterSpacing: '0.1em', textTransform: 'uppercase', fontSize: '0.8rem' }}>
        Loading...
      </p>
    </div>
  );
}
