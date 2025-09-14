import mongoose from "mongoose";

export interface IDistractionEvent {
  reason: string;
  timestamp: number;
  notes?: string;
  duration?: number;
  category?: string;
  impact?: "low" | "medium" | "high";
  userId?: string; // Will be used when we add authentication
}

const distractionEventSchema = new mongoose.Schema<IDistractionEvent>(
  {
    reason: { type: String, required: true },
    timestamp: { type: Number, required: true },
    notes: { type: String },
    duration: { type: Number }, // Duration in minutes
    category: { type: String },
    impact: { type: String, enum: ["low", "medium", "high"] },
    userId: { type: String }, // Will be used when we add authentication
  },
  {
    timestamps: true, // Adds createdAt and updatedAt
  }
);

// Create indexes for better query performance
distractionEventSchema.index({ timestamp: -1 });
distractionEventSchema.index({ userId: 1, timestamp: -1 });

export const DistractionEvent =
  mongoose.models.DistractionEvent ||
  mongoose.model<IDistractionEvent>("DistractionEvent", distractionEventSchema);
