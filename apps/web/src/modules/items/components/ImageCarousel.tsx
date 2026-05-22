interface ImageCarouselProps {
  images: string[];
}

export default function ImageCarousel({ images }: ImageCarouselProps) {
  const image = images?.[0] || null;

  return (
    <div className="w-full bg-gray-200 rounded h-64 flex items-center justify-center">
      {image ? (
        <img src={image} alt="Item" className="w-full h-full object-cover rounded" />
      ) : (
        <p className="text-gray-500">No image</p>
      )}
    </div>
  );
}
