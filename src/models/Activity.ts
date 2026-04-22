import { type InferSchemaType, Schema, model, models } from "mongoose";

const activitySchema = new Schema(
  {
    title: {
      vi: { type: String, required: true, trim: true },
      en: { type: String, required: true, trim: true },
    },
    description: {
      vi: { type: String, required: true, trim: true },
      en: { type: String, required: true, trim: true },
    },
    imageUrl: { type: String, default: "", trim: true },
    category: {
      type: String,
      enum: ["community", "workshop", "qualification"],
      required: true,
      default: "community",
    },
    date: { type: String, default: "", trim: true },
    order: { type: Number, required: true, min: 1, default: 1 },
  },
  { timestamps: true },
);

activitySchema.index({ category: 1, order: 1 });

export type ActivityRecord = InferSchemaType<typeof activitySchema>;

export const ActivityModel =
  models.Activity || model("Activity", activitySchema);
