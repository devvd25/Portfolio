import { type InferSchemaType, Schema, model, models } from "mongoose";

const otherExperienceSchema = new Schema(
  {
    title: {
      vi: { type: String, required: true, trim: true },
      en: { type: String, required: true, trim: true },
    },
    description: {
      vi: { type: String, required: true, trim: true },
      en: { type: String, required: true, trim: true },
    },
    period: {
      vi: { type: String, required: true, trim: true },
      en: { type: String, required: true, trim: true },
    },
    imageUrl: { type: String, default: "", trim: true },
    order: { type: Number, required: true, min: 1, default: 1 },
    isHidden: { type: Boolean, default: false },
  },
  { timestamps: true },
);

otherExperienceSchema.index({ order: 1 });

export type OtherExperienceRecord = InferSchemaType<typeof otherExperienceSchema>;

export const OtherExperienceModel =
  models.OtherExperience || model("OtherExperience", otherExperienceSchema);
