import { useRef, useState, useEffect } from 'react';
import { cn } from '@swap-web/common/lib/utils';
import LoadingSpinner from '@swap-web/common/components/LoadingSpinner';
import CategoryThumbnail from '@swap-web/common/components/CategoryThumbnail';
import { usePresignUrl, useConfirmUpload } from '../hooks/useUpload';
import type { Category } from '@swap-web/common/lib/category-palette';

export interface UploadedPhoto {
  clientId: string;
  itemImageId: string | null;
  previewUrl: string;
  uploading: boolean;
  error: boolean;
}

interface ImageUploaderProps {
  photos: UploadedPhoto[];
  onChange: (photos: UploadedPhoto[]) => void;
  category: string;
}

interface UploadThumbProps {
  photo: UploadedPhoto;
  isPrimary: boolean;
  category: string;
  onSetPrimary: (clientId: string) => void;
  onRemove: (clientId: string) => void;
  onRetry: (clientId: string) => void;
}

function UploadThumb({ photo, isPrimary, category, onSetPrimary, onRemove, onRetry }: UploadThumbProps) {
  return (
    <div
      onClick={() => {
        if (photo.error) {
          onRetry(photo.clientId);
        } else if (!isPrimary && !photo.uploading) {
          onSetPrimary(photo.clientId);
        }
      }}
      className={cn(
        'relative aspect-square rounded-[6px] overflow-hidden cursor-pointer transition-all duration-[120ms]',
        isPrimary
          ? 'border-2 border-primary shadow-[0_0_0_3px_var(--primary-tint)]'
          : photo.error
            ? 'border-2 border-destructive'
            : 'border-[1.5px] border-border hover:shadow-[0_4px_12px_rgba(0,0,0,0.08)]',
      )}
    >
      {photo.previewUrl && !photo.uploading ? (
        <img src={photo.previewUrl} className="w-full h-full object-cover" />
      ) : (
        <CategoryThumbnail category={(category || 'other') as Category} hideLabel />
      )}

      {photo.uploading && (
        <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
          <LoadingSpinner size={16} className="text-white" />
        </div>
      )}

      {photo.error && !photo.uploading && (
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
            <path d="M1 4v6h6M23 20v-6h-6" />
            <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4-4.64 4.36A9 9 0 0 1 3.51 15" />
          </svg>
        </div>
      )}

      {isPrimary && !photo.uploading && !photo.error && (
        <span className="absolute bottom-1 left-1 bg-primary text-white text-[9px] font-bold px-[5px] py-[2px] rounded-[3px] uppercase tracking-[0.4px]">
          Primary
        </span>
      )}

      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onRemove(photo.clientId);
        }}
        className="absolute top-1 right-1 w-[22px] h-[22px] rounded-full bg-[rgba(26,26,26,0.78)] text-white flex items-center justify-center"
      >
        <svg width="11" height="11" viewBox="0 0 11 11" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="1" y1="1" x2="10" y2="10" />
          <line x1="10" y1="1" x2="1" y2="10" />
        </svg>
      </button>
    </div>
  );
}

export default function ImageUploader({ photos, onChange, category }: ImageUploaderProps) {
  const [drag, setDrag] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const presignMutation = usePresignUrl();
  const confirmMutation = useConfirmUpload();

  useEffect(() => {
    return () => {
      photos.forEach((p) => URL.revokeObjectURL(p.previewUrl));
    };
  }, []);

  async function uploadFile(file: File, clientId: string, currentPhotos: UploadedPhoto[]) {
    try {
      const presign = await presignMutation.mutateAsync({
        filename: file.name,
        contentType: file.type,
        context: 'item_image',
      });
      const { objectKey, uploadUrl, publicUrl } = presign.data;

      await fetch(uploadUrl, {
        method: 'PUT',
        body: file,
        headers: { 'Content-Type': file.type },
      });

      const confirm = await confirmMutation.mutateAsync({
        objectKey,
        publicUrl,
        contentType: file.type,
        sizeBytes: file.size,
        context: 'item_image',
      });

      onChange(
        currentPhotos.map((p) =>
          p.clientId === clientId ? { ...p, itemImageId: confirm.data.id, uploading: false } : p,
        ),
      );
    } catch {
      onChange(currentPhotos.map((p) => (p.clientId === clientId ? { ...p, uploading: false, error: true } : p)));
    }
  }

  function handleFiles(files: FileList) {
    const remaining = 5 - photos.length;
    const toUpload = Array.from(files).slice(0, remaining);
    const newPhotos: UploadedPhoto[] = toUpload.map((file) => ({
      clientId: crypto.randomUUID(),
      itemImageId: null,
      previewUrl: URL.createObjectURL(file),
      uploading: true,
      error: false,
    }));

    const next = [...photos, ...newPhotos];
    onChange(next);

    toUpload.forEach((file, i) => uploadFile(file, newPhotos[i].clientId, next));
  }

  function handleRemove(clientId: string) {
    const photo = photos.find((p) => p.clientId === clientId);
    if (photo) URL.revokeObjectURL(photo.previewUrl);
    onChange(photos.filter((p) => p.clientId !== clientId));
  }

  function handleSetPrimary(clientId: string) {
    const picked = photos.find((p) => p.clientId === clientId);
    if (!picked) return;
    onChange([picked, ...photos.filter((p) => p.clientId !== clientId)]);
  }

  function handleRetry(clientId: string) {
    const photo = photos.find((p) => p.clientId === clientId);
    if (!photo) return;
    const updated = photos.map((p) => (p.clientId === clientId ? { ...p, uploading: true, error: false } : p));
    onChange(updated);
    fetch(photo.previewUrl)
      .then((r) => r.blob())
      .then((blob) => {
        const file = new File([blob], 'retry.jpg', { type: blob.type || 'image/jpeg' });
        uploadFile(file, clientId, updated);
      });
  }

  const disabled = photos.length >= 5;

  return (
    <div className="flex flex-col gap-3">
      <button
        type="button"
        disabled={disabled}
        onDragOver={(e) => {
          e.preventDefault();
          setDrag(true);
        }}
        onDragLeave={() => setDrag(false)}
        onDrop={(e) => {
          e.preventDefault();
          handleFiles(e.dataTransfer.files);
          setDrag(false);
        }}
        onClick={() => !drag && fileInputRef.current?.click()}
        className={cn(
          'w-full flex flex-col items-center gap-[10px] rounded-lg p-[36px_16px] border-[1.5px] border-dashed transition-colors',
          drag ? 'bg-primary/5 border-primary' : 'border-border hover:bg-muted/50',
          disabled && 'cursor-not-allowed opacity-60',
        )}
      >
        <div className="w-[52px] h-[52px] rounded-full bg-primary/10 flex items-center justify-center">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="1.8">
            <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
            <circle cx="12" cy="13" r="4" />
          </svg>
        </div>
        <div className="flex flex-col items-center gap-1">
          <span className="text-[14.5px] font-semibold text-foreground">
            {photos.length > 0 ? `Add photos (${photos.length}/5)` : 'Add photos (up to 5)'}
          </span>
          <span className="text-[13px] text-muted-foreground">Drag &amp; drop or click to upload · JPG, PNG, HEIC</span>
        </div>
      </button>

      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/jpeg,image/png,image/heic,image/webp"
        className="hidden"
        onChange={(e) => e.target.files && handleFiles(e.target.files)}
      />

      {photos.length > 0 && (
        <div className="grid grid-cols-5 gap-2">
          {photos.map((photo, i) => (
            <UploadThumb
              key={photo.clientId}
              photo={photo}
              isPrimary={i === 0}
              category={category}
              onSetPrimary={handleSetPrimary}
              onRemove={handleRemove}
              onRetry={handleRetry}
            />
          ))}
          {photos.length < 5 && (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="aspect-square bg-white border-[1.5px] border-dashed border-border-strong rounded-[6px] text-muted-foreground text-[24px] font-light flex items-center justify-center cursor-pointer hover:bg-muted/50 transition-colors"
            >
              +
            </button>
          )}
        </div>
      )}

      {photos.length > 0 && (
        <p className="text-[12px] text-muted-foreground">
          Click a thumbnail to set as primary. First photo is the cover.
        </p>
      )}
    </div>
  );
}
