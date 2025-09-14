"use client";

import DistractionLogger from "../components/DistractionLogger";
import Dashboard from "../components/Dashboard";
import FocusNotification from "../components/FocusNotification";
import AnalyticsDashboard from "../components/analytics/AnalyticsDashboard";
import { useAppSelector } from "../store/hooks";
import { Toaster } from "../components/ui/sonner";

export default function Home() {
  const events = useAppSelector((state) => state.distraction.events);
  return (
    <div className="container py-8 space-y-8">
      <div className="flex flex-col items-center space-y-4">
        <h1 className="text-4xl font-bold tracking-tight text-center">
          Track Your Focus
        </h1>
        <p className="text-lg text-muted-foreground text-center max-w-2xl">
          Monitor distractions, analyze patterns, and improve your productivity
        </p>
      </div>

      <div className="grid gap-8 mt-8">
        <div className="grid gap-8 md:grid-cols-2">
          <DistractionLogger />
          <Dashboard />
        </div>
        <AnalyticsDashboard events={events} />
      </div>

      <FocusNotification />
      <Toaster position="bottom-center" />
    </div>
  );
}
