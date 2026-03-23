"use client";

import { useState, useEffect, useRef } from "react";

type StreamingTextProps = {
  text: string;
  speed?: number;
  onComplete?: () => void;
  className?: string;
};

export function StreamingText({
  text,
  speed = 18,
  onComplete,
  className = "",
}: StreamingTextProps) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);
  const indexRef = useRef(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    indexRef.current = 0;
    setDisplayed("");
    setDone(false);

    intervalRef.current = setInterval(() => {
      indexRef.current++;
      if (indexRef.current >= text.length) {
        setDisplayed(text);
        setDone(true);
        if (intervalRef.current) clearInterval(intervalRef.current);
        onComplete?.();
      } else {
        setDisplayed(text.slice(0, indexRef.current));
      }
    }, speed);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [text, speed, onComplete]);

  return (
    <span className={className}>
      {displayed}
      {!done && <span className="streaming-cursor" />}
    </span>
  );
}
