import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { getSharedItinerary } from "../api/itinerary.api";
import type { ItineraryRecord } from "../components/ItineraryCard";
import Loading from "../components/Loading";
import { formatDate } from "../utils/formatDate";
import { getTripSummary, getTripTitle } from "../utils/trip";
import { copyText } from "../utils/clipboard";

const labelFromKey = (key: string) =>
  key
    .replace(/([A-Z])/g, " $1")
    .replace(/[_-]/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());

const renderValue = (value: unknown): string => {
  if (value === null || value === undefined || value === "") return "Not provided";
  if (typeof value === "string" || typeof value === "number") return String(value);
  if (typeof value === "boolean") return value ? "Yes" : "No";

  return JSON.stringify(value, null, 2);
};

const renderObject = (data: Record<string, unknown>) => {
  const entries = Object.entries(data).filter(([key]) => key !== "days");

  if (!entries.length) return null;

  return (
    <section className="grid gap-3 md:grid-cols-2">
      {entries.map(([key, value]) => (
        <div
          key={key}
          className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm"
        >
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">
            {labelFromKey(key)}
          </p>
          <pre className="mt-2 whitespace-pre-wrap break-words font-sans text-sm leading-6 text-slate-800">
            {renderValue(value)}
          </pre>
        </div>
      ))}
    </section>
  );
};

const renderList = (label: string, value: unknown) => {
  const items = Array.isArray(value)
    ? value.filter((item) => String(item).trim().length > 0)
    : [];

  if (!items.length) return null;

  return (
    <div className="min-w-0 text-wrap-anywhere">
      <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">
        {label}
      </p>
      <ul className="mt-2 space-y-2 text-sm leading-6 text-slate-700">
        {items.map((item, index) => (
          <li key={index}>{String(item)}</li>
        ))}
      </ul>
    </div>
  );
};

const renderDay = (day: unknown) => {
  if (!day || typeof day !== "object") {
    return renderValue(day);
  }

  const record = day as Record<string, unknown>;
  const sections = [
    renderList("Activities", record.activities),
    renderList("Food", record.food),
    renderList("Tips", record.tips),
  ].flatMap((section) => (section ? [section] : []));

  if (!sections.length) {
    return renderValue(day);
  }

  return (
    <div className="mt-3 space-y-4">
      {Boolean(record.date) && (
        <p className="text-sm font-semibold text-emerald-700">
          {String(renderValue(record.date))}
        </p>
      )}
      {sections}
    </div>
  );
};

export default function Share() {
  const { shareId } = useParams();
  const [itinerary, setItinerary] = useState<ItineraryRecord | null>(null);
  const [loading, setLoading] = useState(Boolean(shareId));

  useEffect(() => {
    if (!shareId) {
      return;
    }

    getSharedItinerary(shareId)
      .then(setItinerary)
      .catch(() => {
        toast.error("Shared itinerary was not found");
        setItinerary(null);
      })
      .finally(() => setLoading(false));
  }, [shareId]);

  if (loading) return <Loading label="Loading shared itinerary" />;

  if (!itinerary) {
    return (
      <section className="rounded-lg border border-slate-200 bg-white p-8 text-center shadow-sm">
        <h1 className="text-2xl font-black text-slate-950">Trip not found</h1>
        <p className="mt-2 text-sm text-slate-600">
          This public itinerary link is missing or no longer available.
        </p>
        <Link
          to="/"
          className="mt-5 inline-flex rounded-md bg-emerald-600 px-4 py-2 text-sm font-bold text-white"
        >
          Go home
        </Link>
      </section>
    );
  }

  const trip = itinerary.itinerary ?? {};
  const days = Array.isArray(trip.days) ? trip.days : [];
  const shareUrl = `${window.location.origin}/share/${String(shareId ?? "")}`;

  return (
    <div className="space-y-6 print-doc">
      {/* Print-only booking style header */}
      <section className="print-only hidden">
        <div className="print-header">
          <div className="print-title">Travel Itinerary Confirmation</div>
          <div className="print-subtitle">
            Document ID: {itinerary.shareId} - Generated {formatDate(itinerary.createdAt)}
          </div>
        </div>

        <div className="print-grid">
          <div className="print-box">
            <div className="print-label">Trip title</div>
            <div className="print-value">{getTripTitle(trip)}</div>
          </div>
          <div className="print-box">
            <div className="print-label">Destination / Route</div>
            <div className="print-value">{String(trip.destination ?? "Not provided")}</div>
          </div>
          <div className="print-box">
            <div className="print-label">Travel dates</div>
            <div className="print-value">
              {String(trip.startDate ?? "-")} to {String(trip.endDate ?? "-")}
            </div>
          </div>
          <div className="print-box">
            <div className="print-label">Traveler</div>
            <div className="print-value">{String(trip.traveler ?? "Not provided")}</div>
          </div>
        </div>

        <div className="print-section">
          <div className="print-section-title">Summary</div>
          <div className="print-box">
            <div className="print-value" style={{ fontWeight: 600 }}>
              {getTripSummary(trip)}
            </div>
          </div>
        </div>

        {days.length > 0 && (
          <div className="print-section">
            <div className="print-section-title">Trip schedule</div>
            <div className="print-days">
              {days.map((day, index) => {
                const record = day && typeof day === "object" ? (day as Record<string, unknown>) : {};
                const activities = Array.isArray(record.activities) ? record.activities : [];
                const tips = Array.isArray(record.tips) ? record.tips : [];
                const food = Array.isArray(record.food) ? record.food : [];

                return (
                  <div className="print-day" key={index}>
                    <div className="print-day-title">
                      <h3>Day {index + 1}</h3>
                      {record.date ? (
                        <div className="print-day-date">{String(record.date)}</div>
                      ) : (
                        <div className="print-day-date" />
                      )}
                    </div>

                    {activities.length > 0 && (
                      <>
                        <div className="print-label">Activities / Bookings</div>
                        <ul className="print-list">
                          {activities.map((item, idx) => (
                            <li key={idx}>{String(item)}</li>
                          ))}
                        </ul>
                      </>
                    )}

                    {food.length > 0 && (
                      <>
                        <div className="print-label" style={{ marginTop: 10 }}>
                          Meals
                        </div>
                        <ul className="print-list">
                          {food.map((item, idx) => (
                            <li key={idx}>{String(item)}</li>
                          ))}
                        </ul>
                      </>
                    )}

                    {tips.length > 0 && (
                      <>
                        <div className="print-label" style={{ marginTop: 10 }}>
                          Notes
                        </div>
                        <ul className="print-list">
                          {tips.map((item, idx) => (
                            <li key={idx}>{String(item)}</li>
                          ))}
                        </ul>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </section>

      {/* Screen UI */}
      <section className="app-card overflow-hidden screen-only">
        <div className="bg-gradient-to-r from-sky-600 via-indigo-500 to-emerald-500 p-[1px]">
          <div className="bg-white px-5 py-6 sm:px-8 sm:py-7">
            <p className="text-xs font-black uppercase tracking-[0.26em] text-sky-700">
              Shared itinerary
            </p>
            <div className="mt-3 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div className="min-w-0">
                <h1 className="text-wrap-anywhere text-3xl font-black text-slate-950 sm:text-5xl">
                  {getTripTitle(trip)}
                </h1>
                <p className="text-wrap-anywhere mt-3 max-w-3xl text-sm leading-6 text-slate-600">
                  {getTripSummary(trip)}
                </p>
                <p className="mt-3 text-xs font-semibold text-slate-500">
                  Created {formatDate(itinerary.createdAt)}
                </p>
              </div>

              <div className="no-print flex w-full flex-col gap-2 md:w-auto md:flex-row md:flex-wrap md:justify-end">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="app-button-secondary w-full md:w-auto"
                >
                  Export PDF
                </button>
                <button
                  type="button"
                  onClick={() => {
                    copyText(shareUrl)
                      .then(() => toast.success("Share link copied"))
                      .catch(() => toast.error("Copy failed. Try manually selecting the URL."));
                  }}
                  className="app-button-primary w-full md:w-auto"
                >
                  Copy link
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {days.length > 0 && (
        <section className="space-y-3 screen-only">
          <h2 className="text-2xl font-black text-slate-950">Trip days</h2>
          <div className="grid gap-4">
            {days.map((day, index) => (
              <article
                key={index}
                className="app-card p-5"
              >
                <h3 className="text-lg font-black text-slate-950">
                  Day {index + 1}
                </h3>
                {renderDay(day)}
              </article>
            ))}
          </div>
        </section>
      )}

      <div className="screen-only">{renderObject(trip)}</div>
    </div>
  );
}
