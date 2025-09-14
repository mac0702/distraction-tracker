"use client";
import { useEffect } from "react";
import { useAppSelector, useAppDispatch } from "../store/hooks";
import { fetchDistractionsAsync } from "../store/distractionSlice";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
  CardDescription,
} from "./ui/card";
import { Skeleton } from "./ui/skeleton";

export default function Dashboard() {
  const dispatch = useAppDispatch();
  const { events, loading, error } = useAppSelector(
    (state) => state.distraction
  );

  useEffect(() => {
    dispatch(fetchDistractionsAsync());
  }, [dispatch]);

  const total = events.length;
  const byReason: Record<string, number> = {};
  const byImpact: Record<string, number> = { low: 0, medium: 0, high: 0 };

  events.forEach((e) => {
    byReason[e.reason] = (byReason[e.reason] || 0) + 1;
    if (e.impact) {
      byImpact[e.impact]++;
    }
  });

  if (loading) {
    return (
      <Card className="w-full max-w-md">
        <CardHeader>
          <Skeleton className="h-8 w-[200px]" />
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-24 w-full" />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="w-full max-w-md border-destructive">
        <CardHeader>
          <CardTitle className="text-destructive">Error Loading Data</CardTitle>
          <CardDescription>{error}</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Distraction Analytics</CardTitle>
        <CardDescription>
          Your distraction patterns and insights
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-6">
        <div className="space-y-4">
          <h3 className="text-sm font-medium">Overview</h3>
          <div className="flex items-center justify-between px-2 py-1 bg-muted rounded-lg">
            <span>Total Distractions</span>
            <span className="font-semibold text-lg">{total}</span>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-sm font-medium">By Reason</h3>
          <div className="space-y-2">
            {Object.entries(byReason).map(([reason, count]) => (
              <div
                key={reason}
                className="flex items-center justify-between text-sm px-2"
              >
                <span>{reason}</span>
                <span className="font-medium">{count}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-sm font-medium">By Impact</h3>
          <div className="grid grid-cols-3 gap-2">
            {Object.entries(byImpact).map(([impact, count]) => (
              <div
                key={impact}
                className="flex flex-col items-center p-2 bg-muted rounded-lg"
              >
                <span className="text-xs uppercase">{impact}</span>
                <span className="font-semibold">{count}</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col items-start gap-2">
        <p className="text-xs text-muted-foreground">
          Data is stored in MongoDB and persists across sessions.
        </p>
        <p className="text-xs text-muted-foreground">
          Last updated: {new Date().toLocaleTimeString()}
        </p>
      </CardFooter>
    </Card>
  );
}
