import mongoose, { Schema, Document, Model } from "mongoose";
import bcryptjs from "bcryptjs";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
  matchPassword(enteredPassword: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: [true, "Please add a name"] },
    email: {
      type: String,
      required: [true, "Please add an email"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String, required: [true, "Please add a password"] },
  },
  { timestamps: true },
);

userSchema.pre<IUser>("save", async function () {
  if (!this.isModified("password")) {
    return;
  }

  this.password = await bcryptjs.hash(this.password, 10);
});

userSchema.methods.matchPassword = async function (
  enteredPassword: string,
): Promise<boolean> {
  return await bcryptjs.compare(enteredPassword, this.password);
};

const User: Model<IUser> = mongoose.model<IUser>("User", userSchema);
export default User;
