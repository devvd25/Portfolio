import { type InferSchemaType, Schema, model, models } from "mongoose";

const researchSchema = new Schema(
  {
    title: {
      vi: { type: String, required: true, trim: true },
      en: { type: String, required: true, trim: true },
    },
    period: {
      vi: { type: String, required: true, trim: true },
      en: { type: String, required: true, trim: true },
    },
    authors: { type: [String], default: [] },
    abstract: {
      vi: { type: String, required: true, trim: true },
      en: { type: String, required: true, trim: true },
    },
    technologies: { type: [String], default: [] },
    achievements: {
      type: [{
        vi: { type: String, required: true, trim: true },
        en: { type: String, required: true, trim: true },
      }],
      default: [],
    },
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
