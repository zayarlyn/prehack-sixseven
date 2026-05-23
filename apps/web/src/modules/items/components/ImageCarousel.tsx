import { useState } from 'react';
import type { ItemCategory } from '@swap/types';
import CategoryThumbnail from '@swap-web/common/components/CategoryThumbnail';
import type { Category } from '@swap-web/common/lib/category-palette';
import { cn } from '@swap-web/common/lib/utils';

interface ImageCarouselProps {
  images: { url: string }[];
  category: ItemCategory;
}

function ChevronLeft() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path
        d="M11 4.5L6.5 9L11 13.5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ChevronRight() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path
        d="M7 4.5L11.5 9L7 13.5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function ImageCarousel({ images, category }: ImageCarouselProps) {
  const [idx, setIdx] = useState(0);
  const categoryKey = (category.charAt(0).toUpperCase() + category.slice(1)) as Category;
  const hasMultiple = images.length > 1;

  function prev() {
    setIdx((i) => (i - 1 + images.length) % images.length);
  }

  function next() {
    setIdx((i) => (i + 1) % images.length);
  }

  return (
    <div>
      {/* Main image */}
      <div className="relative w-full aspect-square rounded-xl overflow-hidden border border-border bg-[#f1f1f1]">
        {images.length > 0 ? (
          <img src={images[idx].url} alt="" className="w-full h-full object-cover" />
        ) : (
          <CategoryThumbnail category={categoryKey} hideLabel />
        )}

        {hasMultiple && (
          <>
            <button
              onClick={prev}
              className="absolute left-[14px] top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/90 backdrop-blur-sm shadow flex items-center justify-center hover:bg-white transition-colors"
              aria-label="Previous image"
            >
              <ChevronLeft />
            </button>
            <button
              onClick={next}
              className="absolute right-[14px] top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/90 backdrop-blur-sm shadow flex items-center justify-center hover:bg-white transition-colors"
              aria-label="Next image"
            >
              <ChevronRight />
            </button>
            <span className="absolute bottom-[14px] right-[14px] bg-[rgba(26,26,26,0.78)] text-white text-[12px] font-semibold px-2.5 py-1 rounded-full">
              {idx + 1}/{images.length}
            </span>
          </>
        )}
      </div>

      {/* Thumbnail strip */}
      {images.length > 0 && (
        <div className="flex gap-2.5 mt-3">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => setIdx(i)}
              className={cn(
                'flex-1 aspect-square max-w-[110px] rounded-lg overflow-hidden cursor-pointer transition-all',
                i === idx
                  ? 'border-2 border-primary shadow-[0_0_0_3px_var(--od-primary-tint)]'
                  : 'border-[1.5px] border-border',
              )}
              aria-label={`Image ${i + 1}`}
            >
              <img src={img.url} alt="" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
