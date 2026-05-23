import { useState, type ReactNode } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Input } from '@swap-web/common/components/ui/input';
import { Textarea } from '@swap-web/common/components/ui/textarea';
import { Button } from '@swap-web/common/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@swap-web/common/components/ui/select';
import { cn } from '@swap-web/common/lib/utils';
import LoadingSpinner from '@swap-web/common/components/LoadingSpinner';
import Toggle from '@swap-web/common/components/Toggle';
import ImageUploader, { type UploadedPhoto } from '../components/ImageUploader';
import PreviewCard from '../components/PreviewCard';
import SuccessModal from '../components/SuccessModal';
import { useCreateItem } from '../hooks/useItems';
import type { CreateItemPayload } from '@swap/types';

const CATEGORY_OPTIONS = [
  { label: 'Books', value: 'books' },
  { label: 'Electronics', value: 'electronics' },
  { label: 'Furniture', value: 'furniture' },
  { label: 'Clothing', value: 'clothing' },
  { label: 'Other', value: 'other' },
] as const;

const CONDITION_OPTIONS = [
  { label: 'Like New', value: 'like_new' },
  { label: 'Good', value: 'good' },
  { label: 'Fair', value: 'fair' },
] as const;

interface SectionProps {
  title?: string;
  hint?: string;
  children: ReactNode;
}

function Section({ title, hint, children }: SectionProps) {
  return (
    <div className="bg-white border border-border rounded-[10px] p-[18px] flex flex-col gap-3">
      {title && (
        <div className="flex items-baseline justify-between gap-2">
          <span className="text-[11.5px] font-bold text-muted-foreground uppercase tracking-[0.6px]">{title}</span>
          {hint && <span className="text-[12px] text-muted-foreground">{hint}</span>}
        </div>
      )}
      {children}
    </div>
  );
}

interface FieldProps {
  label: string;
  hint?: string;
  optional?: boolean;
  error?: string;
  children: ReactNode;
}

function Field({ label, hint, optional, error, children }: FieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex justify-between items-baseline">
        <label className="text-[13px] font-semibold">
          {label}
          {optional && <span className="font-normal text-muted-foreground ml-1">(optional)</span>}
        </label>
        {hint && <span className="text-[12px] text-muted-foreground">{hint}</span>}
      </div>
      {children}
      {error && <p className="text-[12px] text-destructive">{error}</p>}
    </div>
  );
}

interface Errors {
  photos?: string;
  title?: string;
  description?: string;
  price?: string;
  category?: string;
  condition?: string;
}

export default function NewItemPage() {
  const navigate = useNavigate();
  const createItem = useCreateItem();

  const [photos, setPhotos] = useState<UploadedPhoto[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [openToOffers, setOpenToOffers] = useState(false);
  const [category, setCategory] = useState('');
  const [condition, setCondition] = useState('');
  const [pickupLocation, setPickupLocation] = useState('');
  const [createdItemId, setCreatedItemId] = useState<string | null>(null);
  const [errors, setErrors] = useState<Errors>({});
  const [submitted, setSubmitted] = useState(false);

  function validate(): Errors {
    const e: Errors = {};
    const allUploaded = photos.length > 0 && photos.every((p) => !p.uploading && !p.error && p.itemImageId !== null);
    const uploading = photos.some((p) => p.uploading);

    if (photos.length === 0) e.photos = 'At least one photo is required.';
    else if (uploading) e.photos = 'Please wait for photos to finish uploading.';
    else if (!allUploaded) e.photos = 'Some photos failed to upload. Please retry or remove them.';

    if (!title.trim()) e.title = 'Title is required.';
    if (!description.trim()) e.description = 'Description is required.';
    if (!price.trim() || Number(price) <= 0) e.price = 'Price must be greater than 0.';
    if (!category) e.category = 'Please select a category.';
    if (!condition) e.condition = 'Please select a condition.';
    return e;
  }

  function handlePost() {
    if (createItem.isPending) return;
    setSubmitted(true);
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length > 0) return;

    const itemImageIds = photos.map((p) => p.itemImageId).filter((id): id is string => id !== null);
    createItem.mutate(
      {
        title: title.trim(),
        description: description.trim(),
        price: Number(price),
        openToOffers,
        category: category as CreateItemPayload['category'],
        condition: condition as CreateItemPayload['condition'],
        pickupLocation: pickupLocation.trim() || undefined,
        itemImageIds,
      },
      {
        onSuccess: (res: { data: { id: string } }) => {
          setCreatedItemId(res.data.id);
        },
      },
    );
  }

  function handleChange<T>(setter: (v: T) => void, field: keyof Errors) {
    return (v: T) => {
      setter(v);
      if (submitted) setErrors((prev) => ({ ...prev, [field]: undefined }));
    };
  }

  function handlePhotosChange(next: UploadedPhoto[]) {
    setPhotos(next);
    if (submitted) setErrors((prev) => ({ ...prev, photos: undefined }));
  }

  function handlePostAnother() {
    setCreatedItemId(null);
    setPhotos([]);
    setTitle('');
    setDescription('');
    setPrice('');
    setOpenToOffers(false);
    setCategory('');
    setCondition('');
    setPickupLocation('');
    setErrors({});
    setSubmitted(false);
  }

  const inputClass =
    'h-[46px] border-[1.5px] rounded-[6px] focus-visible:ring-0 focus-visible:border-primary focus-visible:shadow-[0_0_0_4px_rgba(250,70,23,0.09)]';
  const inputError =
    'border-destructive focus-visible:border-destructive focus-visible:shadow-[0_0_0_4px_rgba(239,68,68,0.09)]';

  return (
    <div className="min-h-screen">
      <main className="max-w-[500px] md:max-w-[1120px] mx-auto px-6 py-6 pb-12">
        <div className="flex items-center gap-3 mb-[22px]">
          <button
            type="button"
            onClick={() =>
              navigate({
                to: '/',
                search: {
                  q: undefined,
                  category: undefined,
                  sort: undefined,
                  minPrice: undefined,
                  maxPrice: undefined,
                },
              })
            }
            className="w-10 h-10 rounded-full hover:bg-muted flex items-center justify-center shrink-0 transition-colors"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="12,4 6,10 12,16" />
            </svg>
          </button>
          <div>
            <h1 className="text-[24px] font-bold tracking-[-0.3px]">Sell an item</h1>
            <p className="text-[13.5px] text-muted-foreground mt-1">
              Good photos and an honest description sell faster.
            </p>
          </div>
        </div>

        <div className="upload-layout grid gap-6" style={{ gridTemplateColumns: 'minmax(0, 380px) minmax(0, 1fr)' }}>
          {/* Left column */}
          <div className="flex flex-col gap-4">
            <div
              className={cn(
                'bg-white border rounded-[10px] p-[18px] flex flex-col gap-3',
                errors.photos ? 'border-destructive' : 'border-border',
              )}
            >
              <div className="flex items-baseline justify-between gap-2">
                <span className="text-[11.5px] font-bold text-muted-foreground uppercase tracking-[0.6px]">PHOTOS</span>
                <span className="text-[12px] text-muted-foreground">{photos.length} of 5</span>
              </div>
              <ImageUploader photos={photos} onChange={handlePhotosChange} category={category} />
              {errors.photos && <p className="text-[12px] text-destructive">{errors.photos}</p>}
            </div>

            <Section title="LIVE PREVIEW" hint="Feed view">
              <PreviewCard title={title} price={price} category={category} photos={photos} />
            </Section>
          </div>

          {/* Right column */}
          <div className="flex flex-col gap-4">
            <Section>
              <Field label="Title" hint={`${title.length}/80`} error={errors.title}>
                <Input
                  value={title}
                  onChange={(e) => handleChange(setTitle, 'title')(e.target.value)}
                  maxLength={80}
                  placeholder="e.g. Calculus textbook 10th edition"
                  className={cn(inputClass, errors.title && inputError)}
                />
              </Field>

              <Field label="Description" error={errors.description}>
                <Textarea
                  value={description}
                  onChange={(e) => handleChange(setDescription, 'description')(e.target.value)}
                  rows={5}
                  placeholder="Describe the condition, included accessories, reason for selling…"
                  className="border-[1.5px] rounded-[6px] resize-none focus-visible:ring-0 focus-visible:border-primary focus-visible:shadow-[0_0_0_4px_rgba(250,70,23,0.09)]"
                />
              </Field>
            </Section>

            <Section>
              <Field label="Price" error={errors.price}>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[14px] text-muted-foreground select-none">
                    ฿
                  </span>
                  <Input
                    value={price}
                    onChange={(e) => handleChange(setPrice, 'price')(e.target.value.replace(/[^0-9]/g, ''))}
                    placeholder="0"
                    className={cn(inputClass, 'pl-7', errors.price && inputError)}
                    inputMode="numeric"
                  />
                </div>
              </Field>
              <Toggle
                checked={openToOffers}
                onChange={setOpenToOffers}
                label="Open to offers"
                hint="Buyers can suggest a lower price."
              />
            </Section>

            <Section>
              <div className="grid grid-cols-2 gap-[14px]">
                <Field label="Category" error={errors.category}>
                  <Select value={category} onValueChange={handleChange(setCategory, 'category')}>
                    <SelectTrigger className={cn(inputClass, errors.category && inputError)}>
                      <SelectValue placeholder="Select…" />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORY_OPTIONS.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>

                <Field label="Condition" error={errors.condition}>
                  <Select value={condition} onValueChange={handleChange(setCondition, 'condition')}>
                    <SelectTrigger className={cn(inputClass, errors.condition && inputError)}>
                      <SelectValue placeholder="Select…" />
                    </SelectTrigger>
                    <SelectContent>
                      {CONDITION_OPTIONS.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>
              </div>
            </Section>

            <Section>
              <Field label="Pickup location" optional>
                <Input
                  value={pickupLocation}
                  onChange={(e) => setPickupLocation(e.target.value)}
                  placeholder="e.g. KMUTT King Mongkut library"
                  className={inputClass}
                />
              </Field>
            </Section>

            <div className="mt-7 pt-5 border-t border-border flex items-center gap-3">
              <button
                type="button"
                onClick={() =>
                  navigate({
                    to: '/',
                    search: {
                      q: undefined,
                      category: undefined,
                      sort: undefined,
                      minPrice: undefined,
                      maxPrice: undefined,
                    },
                  })
                }
                className="h-11 px-4 rounded-[6px] text-[14px] font-semibold hover:bg-muted transition-colors"
              >
                Cancel
              </button>
              <div className="flex-1" />
              <Button
                onClick={handlePost}
                disabled={createItem.isPending}
                className="h-11 px-[22px] text-[14px] font-bold"
              >
                {createItem.isPending && <LoadingSpinner size={16} className="text-white mr-2" />}
                {createItem.isPending ? 'Posting…' : 'Post Listing'}
              </Button>
            </div>
          </div>
        </div>
      </main>

      {createdItemId && (
        <SuccessModal
          title={title}
          price={price}
          category={category}
          photos={photos}
          itemId={createdItemId}
          onPostAnother={handlePostAnother}
        />
      )}
    </div>
  );
}
