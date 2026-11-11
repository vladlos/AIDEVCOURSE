import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import Timer from "../components/timer";

describe("Timer", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    cleanup();
    vi.useRealTimers();
  });

  it("lets the user set, pause, resume, and reset a countdown", () => {
    render(<Timer />);

    expect(screen.getByText("05:00")).toBeTruthy();
    fireEvent.change(screen.getByLabelText("Хвилини"), {
      target: { value: "0" },
    });
    fireEvent.change(screen.getByLabelText("Секунди"), {
      target: { value: "3" },
    });
    expect(screen.getByText("00:03")).toBeTruthy();

    fireEvent.click(screen.getByRole("button", { name: "Старт" }));
    expect(screen.getByRole("button", { name: "Пауза" })).toBeTruthy();

    act(() => {
      vi.advanceTimersByTime(1000);
    });
    expect(screen.getByText("00:02")).toBeTruthy();

    fireEvent.click(screen.getByRole("button", { name: "Пауза" }));
    act(() => {
      vi.advanceTimersByTime(2000);
    });
    expect(screen.getByText("00:02")).toBeTruthy();

    fireEvent.click(screen.getByRole("button", { name: "Старт" }));
    act(() => {
      vi.advanceTimersByTime(1000);
    });
    act(() => {
      vi.advanceTimersByTime(1000);
    });
    expect(screen.getByText("00:00")).toBeTruthy();
    expect(screen.getByText("Час вийшов")).toBeTruthy();

    fireEvent.click(screen.getByRole("button", { name: "Скинути" }));
    expect(screen.getByText("00:03")).toBeTruthy();
    expect(screen.getByRole("button", { name: "Старт" })).toBeTruthy();
  });
});
