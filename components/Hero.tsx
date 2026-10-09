import Image from "next/image";
import Link from "next/link";
import type { HomepageContent } from "@/lib/types";

export default function Hero({ content }: { content: HomepageContent }) {
  return (
    <section className="relative flex min-h-[70vh] items-center overflow-hidden bg-ink">
      <Image
        src={content.hero_image_url ?? "/placeholders/hero.svg"}
        alt={content.hero_title}
        fill
        priority
        className="object-cover opacity-90"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />
      <div className="container-page relative z-10 flex flex-col items-center gap-4 py-24 text-center text-white">
        <h1 className="font-display max-w-2xl text-3xl font-bold leading-relaxed sm:text-5xl">
          {content.hero_title}
        </h1>
        <p className="max-w-md text-sm text-white/85 sm:text-base">
          {content.hero_subtitle}
        </p>
        <Link
          href={content.hero_cta_url}
          className="mt-4 rounded-full bg-ivory px-8 py-3 text-sm font-medium text-ink transition-transform hover:scale-105"
        >
          {content.hero_cta_label}
        </Link>
      </div>
    </section>
  );
}
