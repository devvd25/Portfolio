import { type InferSchemaType, Schema, model, models } from "mongoose";

const portfolioProfileSchema = new Schema(
  {
    key: {
      type: String,
      required: true,
      unique: true,
      default: "main",
      trim: true,
    },
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    headline: {
      vi: { type: String, required: true, trim: true },
      en: { type: String, required: true, trim: true },
    },
    location: {
      vi: { type: String, required: true, trim: true },
      en: { type: String, required: true, trim: true },
    },
    bio: {
      vi: { type: String, required: true, trim: true },
      en: { type: String, required: true, trim: true },
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    githubUrl: {
      type: String,
      default: "",
      trim: true,
    },
    linkedinUrl: {
      type: String,
      default: "",
      trim: true,
    },
    avatarUrl: {
      type: String,
      default: "",
      trim: true,
    },
    cvUrl: {
      type: String,
      default: "",
      trim: true,
    },
  },
  {
    timestamps: true,
  },
);

export type PortfolioProfileRecord = InferSchemaType<typeof portfolioProfileSchema>;

export const PortfolioProfileModel =
  models.PortfolioProfile || model("PortfolioProfile", portfolioProfileSchema);
