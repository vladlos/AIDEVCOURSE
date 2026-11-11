"use client";

import { useEffect, useState } from "react";

const MAX_MINUTES = 999;
const MAX_SECONDS = 59;

function clampInput(value: string, maximum: number) {
  const parsedValue = Number.parseInt(value, 10);

  if (Number.isNaN(parsedValue)) {
    return 0;
  }

  return Math.min(maximum, Math.max(0, parsedValue));
}

function formatTime(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

export default function Timer() {
  const [minutes, setMinutes] = useState(5);
  const [seconds, setSeconds] = useState(0);
  const [remainingSeconds, setRemainingSeconds] = useState(5 * 60);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    if (!isRunning) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      if (remainingSeconds <= 1) {
        setRemainingSeconds(0);
        setIsRunning(false);
        return;
      }

      setRemainingSeconds(remainingSeconds - 1);
    }, 1000);

    return () => window.clearTimeout(timeoutId);
  }, [isRunning, remainingSeconds]);

  function handleMinutesChange(value: string) {
    const nextMinutes = clampInput(value, MAX_MINUTES);

    setMinutes(nextMinutes);
    setRemainingSeconds(nextMinutes * 60 + seconds);
  }

  function handleSecondsChange(value: string) {
    const nextSeconds = clampInput(value, MAX_SECONDS);

    setSeconds(nextSeconds);
    setRemainingSeconds(minutes * 60 + nextSeconds);
  }

  function resetTimer() {
    setIsRunning(false);
    setRemainingSeconds(minutes * 60 + seconds);
  }

  const isComplete = remainingSeconds === 0;

  return (
    <section
      aria-labelledby="timer-title"
      className="w-full max-w-md rounded-3xl border border-zinc-200 bg-white p-8 text-center shadow-xl dark:border-zinc-800 dark:bg-zinc-950"
    >
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-indigo-600 dark:text-indigo-400">
        Зворотний відлік
      </p>
      <h2
        id="timer-title"
        className="mt-2 text-2xl font-semibold text-zinc-900 dark:text-white"
      >
        Таймер
      </h2>

      <p
        aria-label="Залишилося часу"
        aria-live="off"
        className="my-8 font-mono text-6xl font-bold tabular-nums tracking-tight text-zinc-950 dark:text-white"
      >
        {formatTime(remainingSeconds)}
      </p>

      <p aria-live="polite" className="mb-6 min-h-6 text-sm text-zinc-500 dark:text-zinc-400">
        {isComplete ? "Час вийшов" : isRunning ? "Таймер запущено" : "Готовий до запуску"}
      </p>

      <div className="mb-6 flex justify-center gap-4">
        <label className="flex flex-col gap-2 text-left text-sm font-medium text-zinc-700 dark:text-zinc-300">
          Хвилини
          <input
            type="number"
            min="0"
            max={MAX_MINUTES}
            step="1"
            value={minutes}
            disabled={isRunning}
            onChange={(event) => handleMinutesChange(event.target.value)}
            className="w-28 rounded-xl border border-zinc-300 bg-white px-3 py-2 text-center text-lg text-zinc-950 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 disabled:opacity-60 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white"
          />
        </label>
        <label className="flex flex-col gap-2 text-left text-sm font-medium text-zinc-700 dark:text-zinc-300">
          Секунди
          <input
            type="number"
            min="0"
            max={MAX_SECONDS}
            step="1"
            value={seconds}
            disabled={isRunning}
            onChange={(event) => handleSecondsChange(event.target.value)}
            className="w-28 rounded-xl border border-zinc-300 bg-white px-3 py-2 text-center text-lg text-zinc-950 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 disabled:opacity-60 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white"
          />
        </label>
      </div>

      <div className="flex justify-center gap-3">
        <button
          type="button"
          disabled={isComplete}
          onClick={() => setIsRunning((running) => !running)}
          className="min-w-32 rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white transition-colors hover:bg-indigo-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isRunning ? "Пауза" : "Старт"}
        </button>
        <button
          type="button"
          onClick={resetTimer}
          className="rounded-xl border border-zinc-300 px-5 py-3 font-semibold text-zinc-700 transition-colors hover:bg-zinc-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-500 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-800"
        >
          Скинути
        </button>
      </div>
    </section>
  );
}
