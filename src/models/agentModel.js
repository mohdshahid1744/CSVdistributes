import mongoose from "mongoose";
import bcrypt from "bcrypt";

const agentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    mobile: {
      type: String,
      required: [true, "Mobile number is required"],
      unique: true,
      match: [/^\+\d{1,3}\d{7,15}$/, "Invalid mobile number format"], 
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
    },
    assignedItems: {
        type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Item" }],
        default: [], 
        required: true, 
      },
  },
  { timestamps: true }
);
agentSchema.pre("save", function (next) {
    if (!this.assignedItems) {
      this.assignedItems = [];
    }
    next();
  });

agentSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

const Agent = mongoose.models.Agent || mongoose.model("Agent", agentSchema);

export default Agent;
