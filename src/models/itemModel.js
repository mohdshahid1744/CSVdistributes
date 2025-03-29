import mongoose from "mongoose";

const itemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  mobile: { type: String, required: true,unique:true },
  details: { type: String, required: true },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "Agent" }, 
});

const Item = mongoose.models.Item || mongoose.model("Item", itemSchema);

export default Item;
