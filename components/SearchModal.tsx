"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Search, X } from "lucide-react";
import { formatPrice } from "@/lib/utils/format";

type SearchResult = {
  id: string;
  name: string;
  slug: string;
  price: number;
  image: string | null;
};

export default function SearchModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) {
      setQuery("");
      setResults([]);
    }
  }, [open]);

  useEffect(() => {
    if (query.trim().length < 2) {
      setResults([]);
      return;
    }
    setLoading(true);
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        const data = await res.json();
        setResults(data.results ?? []);
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [query]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/40 p-4 pt-24">
      <div className="fade-in w-full max-w-lg rounded-card bg-ivory-soft p-4 shadow-soft">
        <div className="flex items-center gap-2 border-b border-ink/10 pb-3">
          <Search size={18} className="text-ink-muted" />
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="جستجوی محصول... مثلاً گردنبند"
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-ink-muted"
          />
          <button onClick={onClose} aria-label="بستن جستجو">
            <X size={18} />
          </button>
        </div>

        <div className="mt-3 max-h-80 overflow-y-auto">
          {loading && <p className="py-4 text-center text-sm text-ink-muted">در حال جستجو...</p>}
          {!loading && query.trim().length >= 2 && results.length === 0 && (
            <p className="py-4 text-center text-sm text-ink-muted">نتیجه‌ای یافت نشد.</p>
          )}
          {results.map((r) => (
            <Link
              key={r.id}
              href={`/product/${r.slug}`}
              onClick={onClose}
              className="flex items-center gap-3 rounded-lg p-2 hover:bg-ink/5"
            >
              <div className="relative h-12 w-12 overflow-hidden rounded-md bg-ivory">
                <Image
                  src={r.image ?? "/placeholders/generic.svg"}
                  alt={r.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <p className="text-sm text-ink">{r.name}</p>
                <p className="text-xs text-ink-muted">{formatPrice(r.price)}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
