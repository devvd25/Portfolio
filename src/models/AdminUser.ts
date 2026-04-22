import { type InferSchemaType, Schema, model, models } from "mongoose";

const adminUserSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    passwordHash: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["admin"],
      default: "admin",
    },
  },
  {
    timestamps: true,
  },
);

export type AdminUserRecord = InferSchemaType<typeof adminUserSchema>;

export const AdminUserModel =
  models.AdminUser || model("AdminUser", adminUserSchema);
