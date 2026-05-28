import { useRef, useState } from "react";

type FileUploaderProps = {
  onUpload: (file: File) => void;
  loading?: boolean;
};

export default function FileUploader({ onUpload, loading = false }: FileUploaderProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);

  const handleFile = (selectedFile?: File) => {
    if (!selectedFile) return;

    setFile(selectedFile);
  };

  return (
    <section className="app-card p-4 sm:p-6">
      <div
        className={[
          "relative flex min-h-[240px] cursor-pointer flex-col items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed px-4 py-9 text-center transition",
          dragActive
            ? "border-sky-500 bg-sky-50"
            : "border-slate-300 bg-slate-50/50 hover:border-sky-400 hover:bg-sky-50/60",
        ].join(" ")}
        onClick={() => inputRef.current?.click()}
        onDragOver={(event) => event.preventDefault()}
        onDragEnter={() => setDragActive(true)}
        onDragLeave={() => setDragActive(false)}
        onDrop={(event) => {
          event.preventDefault();
          setDragActive(false);
          handleFile(event.dataTransfer.files[0]);
        }}
      >
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-sky-500/10 via-white/20 to-indigo-500/10" />
        <input
          ref={inputRef}
          type="file"
          className="hidden"
          accept=".pdf,.png,.jpg,.jpeg,.webp,.txt"
          onChange={(event) => handleFile(event.target.files?.[0])}
        />

        <div className="relative grid h-14 w-14 place-items-center rounded-2xl bg-white text-2xl font-black text-sky-700 shadow-sm ring-1 ring-slate-200">
          PDF
        </div>
        <h2 className="relative mt-4 text-xl font-black text-slate-950 sm:text-2xl">
          Upload a booking confirmation
        </h2>
        <p className="relative mt-2 max-w-lg text-sm leading-6 text-slate-600">
          Drop a PDF, image, or text file here. Travel AI will extract the booking
          details and create a shareable itinerary.
        </p>
        <p className="relative mt-3 text-xs font-semibold text-slate-500">
          PDF, JPG/PNG/WEBP, or TXT - Max 1 file
        </p>

        {file && (
          <div className="relative mt-6 w-full max-w-lg rounded-2xl border border-slate-200 bg-white/90 px-4 py-3 text-left shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-slate-900">
                  {file.name}
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>

              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  setFile(null);
                }}
                className="shrink-0 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Remove
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
        <p className="min-w-0 flex-1 text-xs font-semibold text-slate-500">
          Tip: screenshots work best if the text is sharp.
        </p>
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="app-button-secondary w-full sm:w-auto"
        >
          Choose file
        </button>
        <button
          type="button"
          disabled={!file || loading}
          onClick={() => file && onUpload(file)}
          className="app-button-primary w-full disabled:cursor-not-allowed disabled:bg-slate-300 sm:w-auto"
        >
          {loading ? "Processing..." : "Create itinerary"}
        </button>
      </div>
    </section>
  );
}
