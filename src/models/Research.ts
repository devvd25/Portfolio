import { type InferSchemaType, Schema, model, models } from "mongoose";

const researchSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    period: { type: String, required: true, trim: true },
    authors: { type: [String], default: [] },
    abstract: { type: String, required: true, trim: true },
    technologies: { type: [String], default: [] },
    achievements: { type: [String], default: [] },
    demoUrl: { type: String, default: "", trim: true },
    documentUrl: { type: String, default: "", trim: true },
    order: { type: Number, required: true, min: 1, default: 1 },
  },
  { timestamps: true },
);

researchSchema.index({ order: 1 });

export type ResearchRecord = InferSchemaType<typeof researchSchema>;

export const ResearchModel =
  models.Research || model("Research", researchSchema);
