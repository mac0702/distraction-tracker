"use client";
import { useState } from "react";
import { useAppDispatch } from "../store/hooks";
import { logDistractionAsync } from "../store/distractionSlice";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Button } from "./ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";
import { toast } from "sonner";

const REASONS = [
  "Phone Notification",
  "Social Media",
  "Colleague Interrupt",
  "Email",
  "Hunger/Thirst",
  "Other",
];

export default function DistractionLogger() {
  const [reason, setReason] = useState("");
  const dispatch = useAppDispatch();

  const handleLog = async () => {
    if (!reason) return;
    try {
      await dispatch(
        logDistractionAsync({
          reason,
          timestamp: Date.now(),
          impact: "medium", // Default impact
        })
      ).unwrap();
      setReason("");
      toast.success("Distraction logged successfully");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to log distraction"
      );
    }
  };

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-center">
          Log a Distraction
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <Select value={reason} onValueChange={setReason}>
          <SelectTrigger>
            <SelectValue placeholder="Select reason..." />
          </SelectTrigger>
          <SelectContent>
            {REASONS.map((r) => (
              <SelectItem key={r} value={r}>
                {r}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button
          className="w-full"
          size="lg"
          variant="default"
          onClick={handleLog}
          disabled={!reason}
        >
          Log Distraction
        </Button>
      </CardContent>
    </Card>
  );
}
