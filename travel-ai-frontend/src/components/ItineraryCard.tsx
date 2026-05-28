import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { formatDate } from "../utils/formatDate";
import { getTripSummary, getTripTitle } from "../utils/trip";
import { copyText } from "../utils/clipboard";

export type ItineraryRecord = {
  _id: string;
  shareId: string;
  itinerary?: Record<string, unknown>;
  createdAt?: string;
  updatedAt?: string;
};

const getDayCount = (trip?: Record<string, unknown>) => {
  const days = trip?.days;

  if (Array.isArray(days)) return days.length;

  return 0;
};

type ItineraryCardProps = {
  itinerary: ItineraryRecord;
};

export default function ItineraryCard({ itinerary }: ItineraryCardProps) {
  const trip = itinerary.itinerary;
  const dayCount = getDayCount(trip);
  const shareUrl = `${window.location.origin}/share/${itinerary.shareId}`;

  return (
    <article className="app-card group flex h-full flex-col p-5 transition hover:-translate-y-0.5 hover:border-slate-200 hover:bg-white">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h3 className="truncate text-lg font-bold text-slate-950">
            {getTripTitle(trip)}
          </h3>
          <p className="mt-1 text-sm text-slate-500">
            Created {formatDate(itinerary.createdAt)}
          </p>
        </div>

        <span className="shrink-0 rounded-full bg-indigo-50 px-3 py-1 text-xs font-bold text-indigo-700">
          {dayCount || 1} day{dayCount === 1 ? "" : "s"}
        </span>
      </div>

      <p className="mt-4 line-clamp-3 text-sm leading-6 text-slate-600">
        {getTripSummary(trip)}
      </p>

      <div className="mt-5 flex flex-col gap-2 sm:flex-row">
        <Link
          to={`/itineraries/${itinerary._id}`}
          className="inline-flex flex-1 items-center justify-center rounded-xl bg-slate-950 px-3 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-300"
        >
          View
        </Link>

        <button
          type="button"
          onClick={() => {
            copyText(shareUrl)
              .then(() => toast.success("Share link copied"))
              .catch(() => toast.error("Copy failed. Try manually selecting the URL."));
          }}
          className="inline-flex flex-1 items-center justify-center rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-800 shadow-sm transition hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-200"
        >
          Copy share link
        </button>
      </div>
    </article>
  );
}
