"use client";

import { useState } from "react";
import Image from "next/image";
import clsx from "clsx";
import type { ProductImage } from "@/lib/types";

export default function ProductGallery({
  images,
  productName,
}: {
  images: ProductImage[];
  productName: string;
}) {
  const list = images.length
    ? images
    : [{ id: "placeholder", url: "/placeholders/generic.svg", alt: productName, product_id: "", sort_order: 0 }];
  const [active, setActive] = useState(0);

  return (
    <div className="flex flex-col-reverse gap-3 sm:flex-row">
      {/* بندانگشتی‌ها */}
      {list.length > 1 && (
        <div className="flex gap-2 overflow-x-auto sm:w-20 sm:flex-col sm:overflow-visible">
          {list.map((img, i) => (
            <button
              key={img.id}
              onClick={() => setActive(i)}
              className={clsx(
                "relative h-16 w-16 shrink-0 overflow-hidden rounded-lg border-2",
                active === i ? "border-brand" : "border-transparent"
              )}
              aria-label={`تصویر ${i + 1}`}
            >
              <Image src={img.url} alt={img.alt ?? productName} fill className="object-cover" />
            </button>
          ))}
        </div>
      )}

      {/* تصویر اصلی */}
      <div className="relative aspect-square flex-1 overflow-hidden rounded-card bg-ivory">
        <Image
          src={list[active].url}
          alt={list[active].alt ?? productName}
          fill
          priority
          className="object-cover transition-transform duration-500 hover:scale-105"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
      </div>
    </div>
  );
}
