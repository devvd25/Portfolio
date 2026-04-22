import { type InferSchemaType, Schema, model, models } from "mongoose";

const experienceSchema = new Schema(
  {
    company: { type: String, required: true, trim: true },
    role: {
      vi: { type: String, required: true, trim: true },
      en: { type: String, required: true, trim: true },
    },
    period: {
      vi: { type: String, required: true, trim: true },
      en: { type: String, required: true, trim: true },
    },
    tasks: {
      type: [{
        vi: { type: String, required: true, trim: true },
        en: { type: String, required: true, trim: true },
      }],
      default: [],
    },
    techStack: { type: [String], default: [] },
    companyImageUrl: { type: String, default: "", trim: true },
    environmentImageUrl: { type: String, default: "", trim: true },
    order: { type: Number, required: true, min: 1, default: 1 },
    isHidden: { type: Boolean, default: false },
  },
  { timestamps: true },
);

experienceSchema.index({ order: 1 });

export type ExperienceRecord = InferSchemaType<typeof experienceSchema>;

export const ExperienceModel =
  models.Experience || model("Experience", experienceSchema);
