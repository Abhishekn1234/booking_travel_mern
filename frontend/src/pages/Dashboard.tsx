import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getMyItineraries } from "../api/itinerary.api";
import EmptyState from "../components/EmptyState";
import ItineraryCard, { type ItineraryRecord } from "../components/ItineraryCard";
import Loading from "../components/Loading";
import { useAuthStore } from "../store/auth.store";

export default function Dashboard() {
  const user = useAuthStore((state) => state.user);
  const [itineraries, setItineraries] = useState<ItineraryRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMyItineraries()
      .then(setItineraries)
      .catch(() => setItineraries([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loading label="Loading dashboard" />;

  const latest = itineraries.slice(0, 3);

  return (
    <div className="space-y-6">
      <section className="rounded-lg bg-slate-950 p-5 text-white sm:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-semibold text-emerald-300">
              Welcome{user?.name ? `, ${user.name}` : ""}
            </p>
            <h1 className="mt-3 text-3xl font-black leading-tight sm:text-4xl">
              Your travel plans, parsed and ready.
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300">
              Upload booking confirmations, let the backend extract travel
              details, and share the final itinerary with anyone.
            </p>
          </div>

          <Link
            to="/upload"
            className="inline-flex items-center justify-center rounded-md bg-emerald-500 px-4 py-3 text-sm font-bold text-slate-950 transition hover:bg-emerald-400"
          >
            Upload booking
          </Link>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-semibold text-slate-500">Trips</p>
          <p className="mt-2 text-3xl font-black text-slate-950">
            {itineraries.length}
          </p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-semibold text-slate-500">Share links</p>
          <p className="mt-2 text-3xl font-black text-slate-950">
            {itineraries.filter((item) => item.shareId).length}
          </p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-semibold text-slate-500">Latest upload</p>
          <p className="mt-2 text-lg font-black text-slate-950">
            {itineraries[0]?.createdAt
              ? new Date(itineraries[0].createdAt).toLocaleDateString()
              : "None yet"}
          </p>
        </div>
      </section>

      <section>
        <div className="mb-4 flex items-center justify-between gap-4">
          <h2 className="text-2xl font-black text-slate-950">Recent trips</h2>
          <Link
            to="/itineraries"
            className="text-sm font-bold text-emerald-700 hover:text-emerald-800"
          >
            View all
          </Link>
        </div>

        {latest.length ? (
          <div className="grid gap-4 md:grid-cols-3">
            {latest.map((itinerary) => (
              <ItineraryCard key={itinerary._id} itinerary={itinerary} />
            ))}
          </div>
        ) : (
          <EmptyState
            title="No itineraries yet"
            message="Upload a booking confirmation and your first AI-generated itinerary will land here."
            action={
              <Link
                to="/upload"
                className="rounded-md bg-emerald-600 px-4 py-2 text-sm font-bold text-white"
              >
                Upload now
              </Link>
            }
          />
        )}
      </section>
    </div>
  );
}
