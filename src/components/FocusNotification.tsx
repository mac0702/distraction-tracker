"use client";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../store/store";
import { toast } from "sonner";

const TIPS = [
  "Take a deep breath and refocus.",
  "Try the Pomodoro technique for better focus.",
  "Minimize notifications for 20 minutes.",
  "Stand up and stretch for a minute.",
  "Write down your next goal before resuming.",
];

export default function FocusNotification() {
  const events = useSelector((state: RootState) => state.distraction.events);

  useEffect(() => {
    if (events.length > 0) {
      const tip = TIPS[Math.floor(Math.random() * TIPS.length)];
      toast("Focus Tip", {
        description: tip,
        duration: 4000,
      });
    }
  }, [events.length]);

  return null;
}
