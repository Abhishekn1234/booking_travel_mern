type LoadingProps = {
  label?: string;
};

export default function Loading({ label = "Loading" }: LoadingProps) {
  return (
    <div className="flex min-h-[240px] items-center justify-center">
      <div className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 shadow-sm">
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-emerald-600" />
        {label}
      </div>
    </div>
  );
}
