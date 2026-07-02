import { ReactNode } from "react";

interface CategoryFormCardProps {
  title: string;
  description: string;
  feedback: string | null;
  children: ReactNode;
}

export default function CategoryFormCard({
  title,
  description,
  feedback,
  children,
}: CategoryFormCardProps) {
  return (
    <section className="space-y-4 rounded-2xl border border-violet-100 bg-white p-6 shadow-sm">
      <div className="space-y-1">
        <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
        <p className="text-sm text-slate-500">{description}</p>
      </div>

      {children}

      {feedback ? <p className="text-sm text-slate-500">{feedback}</p> : null}
    </section>
  );
}
