"use client";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import AnalyticsCharts, { AnalyticsData } from "./AnalyticsCharts";
import {
  format,
  startOfDay,
  endOfDay,
  subDays,
  eachDayOfInterval,
  startOfHour,
  endOfHour,
  addHours,
} from "date-fns";
import { Download } from "lucide-react";

import { DistractionEvent } from "@/store/distractionSlice";

interface AnalyticsDashboardProps {
  events: DistractionEvent[];
}

export default function AnalyticsDashboard({
  events,
}: AnalyticsDashboardProps) {
  const [timeframe, setTimeframe] = useState("7d");

  // Process data for charts
  const getFilteredEvents = () => {
    const now = new Date();
    const days = timeframe === "7d" ? 7 : timeframe === "30d" ? 30 : 90;
    const startDate = startOfDay(subDays(now, days - 1));
    return events.filter((event) => event.timestamp >= startDate.getTime());
  };

  const processData = (): AnalyticsData => {
    const filteredEvents = getFilteredEvents();
    const now = new Date();
    const days = timeframe === "7d" ? 7 : timeframe === "30d" ? 30 : 90;
    const startDate = startOfDay(subDays(now, days - 1));

    // Daily trends
    const dailyTrends = eachDayOfInterval({
      start: startDate,
      end: endOfDay(now),
    }).map((date) => ({
      date: date.toISOString(),
      count: filteredEvents.filter(
        (event) =>
          event.timestamp >= startOfDay(date).getTime() &&
          event.timestamp <= endOfDay(date).getTime()
      ).length,
    }));

    // By reason
    const byReason = Object.entries(
      filteredEvents.reduce((acc: Record<string, number>, event) => {
        acc[event.reason] = (acc[event.reason] || 0) + 1;
        return acc;
      }, {})
    ).map(([name, value]) => ({ name, value: value as number }));

    // By impact
    const byImpact = Object.entries(
      filteredEvents.reduce((acc: Record<string, number>, event) => {
        acc[event.impact || "medium"] =
          (acc[event.impact || "medium"] || 0) + 1;
        return acc;
      }, {})
    ).map(([name, value]) => ({ name, value: value as number }));

    // Hourly distribution
    const hours = Array.from({ length: 24 }, (_, i) => {
      const hour = format(addHours(startOfDay(now), i), "ha");
      const count = filteredEvents.filter((event) => {
        const eventHour = new Date(event.timestamp).getHours();
        return eventHour === i;
      }).length;
      return { hour, count };
    });

    return {
      dailyTrends,
      byReason,
      byImpact,
      hourlyDistribution: hours,
    };
  };

  const handleExport = () => {
    const filteredEvents = getFilteredEvents();
    const csvContent = [
      ["Date", "Time", "Reason", "Impact", "Duration", "Notes"].join(","),
      ...filteredEvents.map((event) =>
        [
          format(new Date(event.timestamp), "yyyy-MM-dd"),
          format(new Date(event.timestamp), "HH:mm:ss"),
          event.reason,
          event.impact || "medium",
          event.duration || "",
          `"${event.notes || ""}"`,
        ].join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `distractions_${timeframe}_${format(
      new Date(),
      "yyyy-MM-dd"
    )}.csv`;
    link.click();
  };

  const data = processData();

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Analytics Dashboard</CardTitle>
        <div className="flex items-center gap-4">
          <Tabs value={timeframe} onValueChange={setTimeframe}>
            <TabsList>
              <TabsTrigger value="7d">7D</TabsTrigger>
              <TabsTrigger value="30d">30D</TabsTrigger>
              <TabsTrigger value="90d">90D</TabsTrigger>
            </TabsList>
          </Tabs>
          <Button variant="outline" size="sm" onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mt-4 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold">{events.length}</div>
                <p className="text-xs text-muted-foreground">
                  Total Distractions
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold">
                  {data.byReason[0]?.name || "N/A"}
                </div>
                <p className="text-xs text-muted-foreground">
                  Most Common Reason
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold">
                  {format(
                    new Date(
                      data.dailyTrends.sort((a, b) => b.count - a.count)[0]
                        ?.date || new Date()
                    ),
                    "MMM d"
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  Most Distracting Day
                </p>
              </CardContent>
            </Card>
          </div>

          <AnalyticsCharts data={data} />
        </div>
      </CardContent>
    </Card>
  );
}
