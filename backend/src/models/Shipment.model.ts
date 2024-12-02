import { Schema, model } from "mongoose";

const EventPositionSchema = new Schema({
  status: { type: String, required: true },
  comments: { type: String, default: "" },
  city: { type: String, required: true },
  country: { type: String, required: true },
});

const ShipmentEventSchema = new Schema({
  eventDateTime: { type: Date, required: true },
  shipmentIsDelayed: { type: Number, default: 0 },
  eventPosition: { type: EventPositionSchema, required: true },
});

const shipmentSchema = new Schema(
  {
    events: { type: [ShipmentEventSchema], required: true },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: true,
  }
);

export default model("Shipment", shipmentSchema);