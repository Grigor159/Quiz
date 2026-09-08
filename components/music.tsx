"use client";

import { useEffect, useRef, useState } from "react";

export default function Music() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [needsUnlock, setNeedsUnlock] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio
      .play()
      .then(() => setIsPlaying(true))
      .catch(() => {
        setNeedsUnlock(true);
      });
  }, []);

  const start = () => {
    audioRef.current
      ?.play()
      .then(() => {
        setIsPlaying(true);
        setNeedsUnlock(false);
      })
      .catch(() => {
        setNeedsUnlock(true);
      });
  };

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      start();
    }
  };

  return (
    <div style={styles.wrap}>
      <audio
        ref={audioRef}
        src="/music/music.mp3"
        loop
      />
      {needsUnlock ? (
        <button style={styles.button} onClick={start}>
          ▶ Play music
        </button>
      ) : (
        <button style={styles.button} onClick={togglePlay} aria-label={isPlaying ? "Pause" : "Play"}>
          {isPlaying ? "⏸ Pause" : "▶ Play"}
        </button>
      )}
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  wrap: {
    position: "fixed",
    top: 16,
    right: 16,
    zIndex: 1000,
  },
  button: {
    padding: "8px 14px",
    borderRadius: 999,
    border: "1px solid #4c4a44",
    background: "#1b1b1f",
    color: "#f2f0ea",
    fontFamily: "system-ui, sans-serif",
    fontSize: 13,
    cursor: "pointer",
    boxShadow: "0 2px 8px rgba(0,0,0,0.25)",
  },
  errorBadge: {
    maxWidth: 240,
    padding: "8px 12px",
    borderRadius: 10,
    border: "1px solid #7a3b34",
    background: "#2b1c1a",
    color: "#f2b8ae",
    fontFamily: "system-ui, sans-serif",
    fontSize: 12,
    lineHeight: 1.4,
    boxShadow: "0 2px 8px rgba(0,0,0,0.25)",
  },
};