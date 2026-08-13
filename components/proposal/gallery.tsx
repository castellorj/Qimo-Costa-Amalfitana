import { EditorialImage } from "@/components/ui/editorial-image";
import type { ImageAsset } from "@/content";

/**
 * Galeria premium — sem JavaScript.
 * Mobile: carrossel horizontal com scroll-snap (roll natural do dedo).
 * Desktop: grid elegante de 3 colunas. Puro CSS = zero custo de runtime.
 */
export function Gallery({ images }: { images: Pick<ImageAsset, "src" | "alt">[] }) {
  return (
    <div className="no-scrollbar flex snap-x snap-mandatory gap-3 overflow-x-auto px-6 pb-2 md:grid md:grid-cols-3 md:gap-4 md:overflow-visible md:px-0">
      {images.map((img, i) => (
        <EditorialImage
          key={img.src + i}
          src={img.src}
          alt={img.alt}
          wrapperClassName="aspect-[4/5] w-[78vw] shrink-0 snap-center rounded-xl sm:w-[52vw] md:aspect-[4/3] md:w-auto"
          sizes="(max-width: 768px) 78vw, 30vw"
        />
      ))}
    </div>
  );
}
