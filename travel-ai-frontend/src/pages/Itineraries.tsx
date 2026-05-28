import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { getMyItineraries } from "../api/itinerary.api";
import EmptyState from "../components/EmptyState";
import ItineraryCard, { type ItineraryRecord } from "../components/ItineraryCard";
import Loading from "../components/Loading";

export default function Itineraries() {
  const [itineraries, setItineraries] = useState<ItineraryRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMyItineraries()
      .then(setItineraries)
      .catch(() => {
        toast.error("Unable to load itineraries");
        setItineraries([]);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loading label="Loading trips" />;

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-sky-700">
            Saved trips
          </p>
          <h1 className="mt-2 text-3xl font-black text-slate-950 sm:text-4xl">
            My itineraries
          </h1>
        </div>

        <Link
          to="/upload"
          className="app-button-primary"
        >
          Upload booking
        </Link>
      </div>

      {itineraries.length ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {itineraries.map((itinerary) => (
            <ItineraryCard key={itinerary._id} itinerary={itinerary} />
          ))}
        </div>
      ) : (
        <EmptyState
          title="No saved trips"
          message="Your uploaded booking confirmations will become saved itineraries here."
          action={
            <Link
              to="/upload"
              className="app-button-primary"
            >
              Upload booking
            </Link>
          }
        />
      )}
    </div>
  );
}
