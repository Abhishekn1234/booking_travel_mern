import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { uploadBooking } from "../api/upload.api";
import FileUploader from "../components/FileUploader";

type UploadResponse = {
  itinerary?: {
    shareId?: string;
  };
};

export default function Upload() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleUpload = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    setLoading(true);

    try {
      const response = (await uploadBooking(formData)) as UploadResponse;
      toast.success("Itinerary created");

      if (response.itinerary?.shareId) {
        navigate(`/share/${response.itinerary.shareId}`);
      } else {
        navigate("/itineraries");
      }
    } catch (error) {
      const message =
        axios.isAxiosError(error) && typeof error.response?.data?.message === "string"
          ? error.response.data.message
          : error instanceof Error
            ? error.message
            : "Upload failed";

      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl space-y-5">
      <div className="app-card overflow-hidden">
        <div className="bg-gradient-to-r from-sky-600 via-indigo-500 to-emerald-500 p-[1px]">
          <div className="bg-white px-5 py-6 sm:px-8 sm:py-7">
            <p className="text-xs font-black uppercase tracking-[0.26em] text-sky-700">
              New itinerary
            </p>
            <h1 className="mt-2 text-3xl font-black text-slate-950 sm:text-4xl">
              Upload booking file
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
              Upload a flight, hotel, train, or bus confirmation. We'll extract the booking details and generate a clean itinerary you can share.
            </p>
          </div>
        </div>
      </div>

      <FileUploader loading={loading} onUpload={handleUpload} />
    </div>
  );
}
