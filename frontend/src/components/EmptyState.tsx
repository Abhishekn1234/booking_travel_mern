import type { ReactNode } from "react";

type EmptyStateProps = {
  title: string;
  message: string;
  action?: ReactNode;
};

export default function EmptyState({ title, message, action }: EmptyStateProps) {
  return (
    <section className="rounded-lg border border-dashed border-slate-300 bg-white px-5 py-10 text-center">
      <div className="mx-auto flex max-w-md flex-col items-center gap-4">
        <div className="grid h-12 w-12 place-items-center rounded-full bg-emerald-50 text-2xl">
          +
        </div>
        <div>
          <h2 className="text-xl font-semibold text-slate-950">{title}</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">{message}</p>
        </div>
        {action}
      </div>
    </section>
  );
}
