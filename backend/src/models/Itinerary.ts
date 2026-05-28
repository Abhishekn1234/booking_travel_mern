import mongoose, {
  Document,
  Schema,
} from "mongoose";

export interface IItinerary extends Document {
  user: mongoose.Types.ObjectId;

  booking: mongoose.Types.ObjectId;

  itinerary: object;

  shareId: string;
}

const itinerarySchema =
  new Schema<IItinerary>(
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: "User",
      },

      booking: {
        type: Schema.Types.ObjectId,
        ref: "Booking",
      },

      itinerary: Object,

      shareId: String,
    },
    {
      timestamps: true,
    }
  );

export default mongoose.model<IItinerary>(
  "Itinerary",
  itinerarySchema
);