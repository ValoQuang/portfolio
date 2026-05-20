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

    const playUnmuted = () => {
      if (started) return;
      audio.muted = false;
      const p = audio.play();
      if (p && typeof p.then === "function") {
        p.then(() => {
          started = true;
          setPlaying(true);
        }).catch(() => {});
      } else {
        started = true;
        setPlaying(true);
      }
    };

    const onIntroStart = () => playUnmuted();
    window.addEventListener("intro-start", onIntroStart);

    const unsub = subscribeIntro((s) => {
      if (s.phase === "done" && !started) playUnmuted();
    });

    return () => {
      window.removeEventListener("intro-start", onIntroStart);
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
