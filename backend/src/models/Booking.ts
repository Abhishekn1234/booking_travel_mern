import mongoose, {
  Document,
  Schema,
} from "mongoose";

export interface IBooking extends Document {
  user: mongoose.Types.ObjectId;

  fileUrl: string;

  extractedText: string;

  extractedData: object;
}

const bookingSchema = new Schema<IBooking>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },

    fileUrl: String,

    extractedText: String,

    extractedData: Object,
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IBooking>(
  "Booking",
  bookingSchema
);