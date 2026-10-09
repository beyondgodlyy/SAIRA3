import Link from "next/link";

export default function EmptyState({
  title,
  description,
  ctaLabel,
  ctaHref,
}: {
  title: string;
  description?: string;
  ctaLabel?: string;
  ctaHref?: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-card border border-dashed border-ink/15 bg-white/50 px-6 py-16 text-center">
      <p className="font-display text-lg font-medium text-ink">{title}</p>
      {description && <p className="max-w-xs text-sm text-ink-muted">{description}</p>}
      {ctaLabel && ctaHref && (
        <Link href={ctaHref} className="btn-primary mt-2">
          {ctaLabel}
        </Link>
      )}
    </div>
  );
}
