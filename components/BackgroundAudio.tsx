"use client";

import { useEffect, useRef, useState } from "react";
import { subscribeIntro } from "@/lib/intro";

export function BackgroundAudio() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const audio = new Audio("/background.mp3");
    audio.loop = true;
    audio.volume = 0.35;
    audio.preload = "auto";
    audio.muted = false;
    audioRef.current = audio;

    let started = false;
    let waitingForGesture = false;

    const playUnmuted = async () => {
      if (started) return true;
      try {
        audio.muted = false;
        await audio.play();
        started = true;
        setPlaying(true);
        return true;
      } catch {
        return false;
      }
    };

    const armGestureFallback = () => {
      if (waitingForGesture || started) return;
      waitingForGesture = true;
      const onGesture = async () => {
        const ok = await playUnmuted();
        if (ok) {
          window.removeEventListener("pointerdown", onGesture);
          window.removeEventListener("keydown", onGesture);
          window.removeEventListener("touchstart", onGesture);
        }
      };
      window.addEventListener("pointerdown", onGesture);
      window.addEventListener("keydown", onGesture);
      window.addEventListener("touchstart", onGesture);
    };

    const unsub = subscribeIntro(async (s) => {
      if (s.phase === "done" && !started) {
        const ok = await playUnmuted();
        if (!ok) armGestureFallback();
      }
    });

    return () => {
      unsub();
      audio.pause();
      audio.src = "";
      audioRef.current = null;
    };
  }, []);

  const toggle = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) {
      audio.muted = false;
      audio.play().then(() => setPlaying(true)).catch(() => {});
    } else {
      audio.pause();
      setPlaying(false);
    }
  };

  const showAsOff = !playing;

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={showAsOff ? "Play background music" : "Mute background music"}
      aria-pressed={!showAsOff}
      className="fixed bottom-6 right-6 z-50 flex h-10 w-10 items-center justify-center rounded-full border border-thread bg-ink-0/70 text-bone-dim backdrop-blur transition hover:text-bone hover:border-amber"
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
      >
        <path d="M11 5L6 9H3v6h3l5 4V5z" />
        {!showAsOff ? (
          <>
            <path d="M15.5 8.5a5 5 0 0 1 0 7" />
            <path d="M18.5 5.5a9 9 0 0 1 0 13" />
          </>
        ) : (
          <>
            <line x1="22" y1="9" x2="16" y2="15" />
            <line x1="16" y1="9" x2="22" y2="15" />
          </>
        )}
      </svg>
    </button>
  );
}
