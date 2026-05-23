# Item Upload — Implementation Checklist

Design reference: `docs/reference-design/item-upload.html`
Excluded: "Save as Draft" button (no draft item status per project rules).

---

## Backend

Routes, controllers, and services are fully wired. `common/lib/storage.ts` is implemented with Cloudflare R2 using AWS SDK v3.

Endpoints (already wired, no changes needed to routes/controllers):

- `POST /api/uploads/presign` — returns `{ objectKey, uploadUrl, publicUrl }`
- `POST /api/uploads/confirm` — returns `ItemImage` with `id` for `context: 'item_image'`, otherwise the `S3Object`
- `POST /api/items` — accepts `CreateItemPayload` including `itemImageIds`

`CreateItemDto` already includes: `title`, `description`, `price`, `category`, `condition`, `pickupLocation`, `openToOffers`, `itemImageIds`.

---

## Backend — Storage (Cloudflare R2)

R2 exposes an S3-compatible API. Use AWS SDK v3 pointed at the R2 endpoint.

### 1. Install packages

- [ ] In `apps/api/`:
  ```bash
  npm install @aws-sdk/client-s3 @aws-sdk/s3-request-presigner
  ```

### 2. Env vars

- [ ] Add to `apps/api/.env` and `apps/api/.env.example`:
  ```
  R2_ACCOUNT_ID=           # Cloudflare account ID (found in R2 dashboard)
  R2_ACCESS_KEY_ID=        # R2 API token → Access Key ID
  R2_SECRET_ACCESS_KEY=    # R2 API token → Secret Access Key
  R2_BUCKET_NAME=          # bucket name
  R2_PUBLIC_URL=           # public bucket URL, e.g. https://pub-xxxx.r2.dev or custom domain
  ```
  The bucket must have **Public access** enabled in the Cloudflare R2 dashboard so `publicUrl` links resolve.

### 3. Implement `apps/api/src/common/lib/storage.ts`

- [ ] Replace the stub:

  ```ts
  import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
  import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

  const client = new S3Client({
    region: 'auto',
    endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: process.env.R2_ACCESS_KEY_ID ?? '',
      secretAccessKey: process.env.R2_SECRET_ACCESS_KEY ?? '',
    },
  });

  export async function generatePresignedUrl(
    objectKey: string,
    contentType: string,
  ): Promise<{ uploadUrl: string; publicUrl: string }> {
    const command = new PutObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME,
      Key: objectKey,
      ContentType: contentType,
    });

    const uploadUrl = await getSignedUrl(client, command, { expiresIn: 300 });
    const publicUrl = `${process.env.R2_PUBLIC_URL}/${objectKey}`;

    return { uploadUrl, publicUrl };
  }
  ```

  - Presigned URL expires in 300 s (5 min) — enough for the browser PUT.
  - `publicUrl` is derived server-side from `R2_PUBLIC_URL` + key; never strip query params from `uploadUrl` to derive it (that gives the private S3 endpoint, not the public R2 URL).

### 4. Return `publicUrl` from the presign endpoint

- [ ] In `apps/api/src/modules/uploads/uploads.service.ts`, update `presign` to return `publicUrl`:

  ```ts
  return {
    objectKey,
    uploadUrl,
    publicUrl, // add this
  };
  ```

  The frontend must use this value when calling confirm — do not let the frontend derive it from `uploadUrl`.

  > **Why:** A presigned `uploadUrl` points at `<accountId>.r2.cloudflarestorage.com` (private endpoint). Stripping query params gives the wrong host. The `publicUrl` (`R2_PUBLIC_URL/<key>`) is a different host entirely.

---

## Types (`apps/web/src/modules/items/`)

Define a local type for an in-progress upload (not in `@swap/types`):

```ts
// Used only within the upload flow — not a shared type
export interface UploadedPhoto {
  clientId: string; // temp local key (e.g. crypto.randomUUID())
  itemImageId: string | null; // set after confirm succeeds; null while uploading
  previewUrl: string; // object URL from File for thumbnail display
  uploading: boolean;
  error: boolean;
}
```

---

## Hooks (`apps/web/src/modules/items/hooks/useUpload.ts`)

Replace `any` with proper types:

- [ ] `usePresignUrl` — typed input/output:
  ```ts
  type PresignInput = { filename: string; contentType: string; context: 'item_image' | 'avatar' };
  type PresignResult = { data: { objectKey: string; uploadUrl: string; publicUrl: string } };
  mutationFn: (data: PresignInput) => axios.post<PresignResult>('/api/uploads/presign', data).then((r) => r.data);
  ```
- [ ] `useConfirmUpload` — typed input/output:
  ```ts
  type ConfirmInput = {
    objectKey: string;
    publicUrl: string;
    contentType: string;
    sizeBytes?: number;
    context: 'item_image' | 'avatar';
  };
  type ConfirmResult = { data: { id: string } };
  mutationFn: (data: ConfirmInput) => axios.post<ConfirmResult>('/api/uploads/confirm', data).then((r) => r.data);
  ```

---

## Hooks (`apps/web/src/modules/items/hooks/useItems.ts`)

- [ ] Type `useCreateItem` — replace `any` with `CreateItemPayload` from `@swap/types`:
  ```ts
  mutationFn: (data: CreateItemPayload) => api.post('/items', data).then((r) => r.data);
  ```
  `CreateItemPayload` already has `itemImageIds?: string[]`.

---

## Constants / mapping

Define in `NewItemPage.tsx` (or a shared `itemConstants.ts` if reused):

```ts
export const CONDITION_OPTIONS = [
  { label: 'Like New', value: 'like_new' },
  { label: 'Good', value: 'good' },
  { label: 'Fair', value: 'fair' },
] as const;

export const CATEGORY_OPTIONS = [
  { label: 'Books', value: 'books' },
  { label: 'Electronics', value: 'electronics' },
  { label: 'Furniture', value: 'furniture' },
  { label: 'Clothing', value: 'clothing' },
  { label: 'Other', value: 'other' },
] as const;
```

Design shows `'For Parts'` — this value is not in the backend enum; omit it.  
Design shows `'Like New'`, `'Good'`, `'Fair'` — map to `like_new`, `good`, `fair`.

---

## `ImageUploader` — full rewrite (`apps/web/src/modules/items/components/ImageUploader.tsx`)

Props:

```ts
interface ImageUploaderProps {
  photos: UploadedPhoto[];
  onChange: (photos: UploadedPhoto[]) => void;
  category: string; // for CategoryThumbnail fallback in thumbs
}
```

- [ ] **Drop zone button** (`w-full`, dashed border, `rounded-lg p-[36px_16px]`, flex-col, gap 10):
  - Disabled when `photos.length >= 5` (`cursor-not-allowed`)
  - Active drag state: primary-tint bg + primary dashed border
  - Camera icon: `52×52` primary-tint circle, `<svg>` camera shape (`stroke="var(--primary)"`)
  - Label text: `"Add photos (n/5)"` when n > 0, `"(up to 5)"` when n === 0 — `text-[14.5px] font-semibold text-foreground`
  - Subtext: `"Drag & drop or click to upload · JPG, PNG, HEIC"` — `text-[13px] text-muted-foreground`
  - `onDragOver`: `e.preventDefault(); setDrag(true)`
  - `onDragLeave`: `setDrag(false)`
  - `onDrop`: read `e.dataTransfer.files` → call upload handler for each; `setDrag(false)`
  - `onClick` (when not dragging): trigger hidden `<input type="file" multiple accept="image/*">`

- [ ] **Hidden file input**: `ref={fileInputRef}`, `type="file"`, `multiple`, `accept="image/jpeg,image/png,image/heic,image/webp"`, `onChange` → upload handler

- [ ] **Upload handler** (`handleFiles(files: FileList)`):
  1. Clamp to remaining slots: `files = Array.from(files).slice(0, 5 - photos.length)`
  2. For each file:
     a. Create `previewUrl = URL.createObjectURL(file)`
     b. Push `{ clientId, previewUrl, itemImageId: null, uploading: true, error: false }` into photos
     c. Call `presignMutation.mutateAsync({ filename: file.name, contentType: file.type, context: 'item_image' })` → destructure `{ objectKey, uploadUrl, publicUrl }`
     d. PUT `file` to `uploadUrl` with `Content-Type: file.type` using `fetch` (not the api instance — presigned URL is direct to R2, not through the backend)
     e. Call `confirmMutation.mutateAsync({ objectKey, publicUrl, contentType: file.type, sizeBytes: file.size, context: 'item_image' })` — use `publicUrl` from the presign response, never derive it from `uploadUrl` (they point at different hosts)
     f. Update photo entry: `{ ...photo, itemImageId: result.data.id, uploading: false }`
     g. On error: `{ ...photo, uploading: false, error: true }`

- [ ] **Thumbnail grid** (when `photos.length > 0`): `grid grid-cols-5 gap-2`
  - Each `UploadThumb` (see below)
  - "+" add slot (when `photos.length < 5`): `aspect-square bg-white border-[1.5px] border-dashed border-border-strong rounded-[6px] text-muted-foreground text-[24px] font-light flex items-center justify-center cursor-pointer`; `onClick` → trigger file input

- [ ] **Hint text**: `"Click a thumbnail to set as primary. First photo is the cover."` — `text-[12px] text-muted-foreground`

### `UploadThumb` (internal component or same file)

- [ ] Wrapper: `relative aspect-square rounded-[6px] overflow-hidden cursor-pointer transition-all duration-[120ms]`
  - Primary: `border-2 border-primary shadow-[0_0_0_3px_var(--primary-tint)]`
  - Non-primary: `border-[1.5px] border-border hover:shadow-[0_4px_12px_rgba(0,0,0,0.08)]`
- [ ] Image: `<img src={photo.previewUrl} className="w-full h-full object-cover" />`; fallback `<CategoryThumbnail>` (`hideLabel`) while `uploading` or if no `previewUrl`
- [ ] While `uploading`: semi-transparent overlay with `<LoadingSpinner size={16} />`
- [ ] `"Primary"` badge (when `isPrimary && !uploading`): `absolute bottom-1 left-1 bg-primary text-white text-[9px] font-bold px-[5px] py-[2px] rounded-[3px] uppercase tracking-[0.4px]`
- [ ] Remove button (top-right): `absolute top-1 right-1 w-[22px] h-[22px] rounded-full bg-[rgba(26,26,26,0.78)] text-white flex items-center justify-center`; `onClick`: stop propagation, call `onRemove(photo.clientId)`; `×` SVG `11×11`
- [ ] `onClick` on wrapper: if `!isPrimary && !uploading`, call `onSetPrimary(photo.clientId)`
- [ ] `onSetPrimary`: move clicked photo to index 0 — `[picked, ...rest.filter(p => p.clientId !== id)]`

---

## `PreviewCard` — new (`apps/web/src/modules/items/components/PreviewCard.tsx`)

Props: `{ title: string; price: string; category: string; photos: UploadedPhoto[] }`

- [ ] Wrapper: `w-full max-w-[240px] mx-auto bg-white rounded-[8px] overflow-hidden shadow-card pointer-events-none`
- [ ] Cover: first photo with `previewUrl` → `<img className="w-full aspect-square object-cover" />`; fallback `<CategoryThumbnail category={category} />` (1:1)
- [ ] Body (`p-[12px_12px_14px] flex flex-col gap-[5px]`):
  - Title: `text-[13.5px] font-medium leading-[1.35] line-clamp-2 min-h-[36px]` — show `"Your listing title"` in muted if empty
  - Price: `text-[17px] font-bold tracking-[-0.2px]` — `฿{Number(price || 0).toLocaleString()}`
  - Footer row (`flex items-center gap-1.5 mt-1 pt-2 border-t border-border`):
    - `<UserAvatar user={user} size={20} />` (from `useAuth`)
    - Seller name: `text-[12px] text-muted-foreground flex-1 truncate`
    - `"· now"` — `text-[12px] text-muted-foreground`

---

## `SuccessModal` — new (`apps/web/src/modules/items/components/SuccessModal.tsx`)

Props: `{ title: string; price: string; category: string; photos: UploadedPhoto[]; itemId: string; onPostAnother: () => void }`

- [ ] Overlay: `fixed inset-0 bg-black/45 z-50 flex items-center justify-center` + `overlayIn` CSS animation
- [ ] Card (`bg-white rounded-[14px] p-[36px_32px] max-w-[400px] w-[90%] flex flex-col items-center gap-4 shadow-[0_16px_48px_rgba(16,24,40,0.18)]`); `scaleIn` animation
- [ ] Green circle: `w-16 h-16 rounded-full bg-[rgba(16,185,129,0.1)] flex items-center justify-center`
  - Check SVG `30×30`, stroke `var(--success)` — apply `checkPop` CSS keyframe (`@keyframes checkPop { 0% { transform: scale(0); } 60% { transform: scale(1.2); } 100% { transform: scale(1); } }`)
- [ ] Heading: `"Listing posted!"` — `text-[20px] font-bold tracking-[-0.3px] text-center`
- [ ] Subtitle: `"Your item is now live and visible to KMUTT students."` — `text-[14.5px] text-muted-foreground text-center leading-[1.55]`
- [ ] Preview container: `w-full bg-muted rounded-[8px] border border-border overflow-hidden`
  - `<PreviewCard title={title} price={price} category={category} photos={photos} />`
- [ ] Buttons row (`flex gap-2.5 w-full`):
  - "Post another": `flex-1 h-11 rounded-[6px] bg-white border-[1.5px] border-border text-[14px] font-semibold`; `onClick={onPostAnother}`
  - "View listing": `flex-1 h-11 rounded-[6px] bg-primary text-white border-none text-[14px] font-semibold`; `onClick`: `navigate({ to: '/app/items/$itemId', params: { itemId } })`

CSS keyframes to add in `globals.css`:

```css
@keyframes checkPop {
  0% {
    transform: scale(0);
  }
  60% {
    transform: scale(1.2);
  }
  100% {
    transform: scale(1);
  }
}
@keyframes overlayIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
@keyframes scaleIn {
  from {
    opacity: 0;
    transform: scale(0.96) translateY(6px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}
```

---

## `NewItemPage` — full rewrite (`apps/web/src/modules/items/pages/NewItemPage.tsx`)

### State

```ts
const [photos, setPhotos] = useState<UploadedPhoto[]>([]);
const [title, setTitle] = useState('');
const [description, setDescription] = useState('');
const [price, setPrice] = useState('');
const [openToOffers, setOpenToOffers] = useState(false);
const [category, setCategory] = useState('');
const [condition, setCondition] = useState('');
const [pickupLocation, setPickupLocation] = useState('');
const [createdItemId, setCreatedItemId] = useState<string | null>(null);
```

### Hooks

```ts
const navigate = useNavigate();
const createItem = useCreateItem();
const { user } = useAuth();
```

### `canPost` logic

```ts
const allUploaded = photos.length > 0 && photos.every((p) => !p.uploading && !p.error && p.itemImageId !== null);
const canPost =
  title.trim().length > 0 && price.trim().length > 0 && category !== '' && condition !== '' && allUploaded;
```

### `handlePost`

```ts
async function handlePost() {
  if (!canPost || createItem.isPending) return;
  const itemImageIds = photos.map((p) => p.itemImageId).filter((id): id is string => id !== null);
  createItem.mutate(
    {
      title: title.trim(),
      description: description.trim() || undefined,
      price: Number(price),
      openToOffers,
      category: category as CreateItemPayload['category'],
      condition: condition as CreateItemPayload['condition'],
      pickupLocation: pickupLocation.trim() || undefined,
      itemImageIds,
    },
    {
      onSuccess: (res) => {
        setCreatedItemId(res.data.id);
      },
    },
  );
}
```

### Layout

- [ ] Page wrapper: `min-h-screen`
- [ ] Main: `max-w-[1120px] mx-auto w-full px-6 py-6 pb-12`
- [ ] **Page header** (`flex items-center gap-3 mb-[22px]`):
  - Back button: `w-10 h-10 rounded-full hover:bg-muted flex items-center justify-center shrink-0`; `onClick: navigate({ to: '/' })`; chevron-left SVG `20×20`
  - Title block:
    - `<h1 className="text-[24px] font-bold tracking-[-0.3px]">Sell an item</h1>`
    - `<p className="text-[13.5px] text-muted-foreground mt-1">Good photos and an honest description sell faster.</p>`

- [ ] **Two-column grid** (`upload-layout` class + inline grid style):
  - `grid gap-6` + CSS `grid-template-columns: minmax(0, 380px) minmax(0, 1fr)` (inline style — non-standard track)
  - Collapses to 1-col at `≤1024px` via `globals.css`: `.upload-layout { grid-template-columns: 1fr !important; }`

- [ ] **Left column** (`flex flex-col gap-4`):
  - Photos section card (see Form Section below):
    - Label: `PHOTOS` + hint `"{n} of 5"`
    - `<ImageUploader photos={photos} onChange={setPhotos} category={category} />`
  - Live preview card:
    - Label: `LIVE PREVIEW` + hint `"Feed view"`
    - `<PreviewCard title={title} price={price} category={category} photos={photos} />`

- [ ] **Right column** (`flex flex-col gap-4`):
  - **Title section**: `<Field label="Title" hint={\`${title.length}/80\`}>`+`<Input>` (`h-[46px]`, focus ring, `maxLength={80}`)
  - **Description section**: `<Field label="Description">` + `<Textarea rows={5}>`
  - **Price section**:
    - `<Field label="Price">` with `฿` prefix input (numeric-only: `value.replace(/[^0-9]/g, '')`)
    - Toggle: label `"Open to offers"`, hint `"Buyers can suggest a lower price."` — `42×24` pill, primary when active
  - **Category + Condition section** (`grid grid-cols-2 gap-[14px]`):
    - `<Field label="Category">` + custom `<Dropdown>` or shadcn `<Select>`; options from `CATEGORY_OPTIONS`
    - `<Field label="Condition">` + same; options from `CONDITION_OPTIONS`
  - **Pickup location section**: `<Field label="Pickup location" optional>` + `<Input>`

### Form Section wrapper (internal `<section>`)

```tsx
// white card, border, rounded-[10px], p-[18px], flex flex-col gap-3
<div className="bg-white border border-border rounded-[10px] p-[18px] flex flex-col gap-3">
  {title && (
    <div className="flex items-baseline justify-between gap-2">
      <span className="text-[11.5px] font-bold text-muted-foreground uppercase tracking-[0.6px]">{title}</span>
      {hint && <span className="text-[12px] text-muted-foreground">{hint}</span>}
    </div>
  )}
  {children}
</div>
```

### Field wrapper (internal)

```tsx
// label row (label + optional hint right), children below
<div className="flex flex-col gap-1.5">
  <div className="flex justify-between items-baseline">
    <label className="text-[13px] font-semibold">
      {label}
      {optional && <span className="font-normal text-muted-foreground ml-1">(optional)</span>}
    </label>
    {hint && <span className="text-[12px] text-muted-foreground">{hint}</span>}
  </div>
  {children}
</div>
```

### Input focus style

All text inputs and dropdowns: `h-[46px] border-[1.5px] rounded-[6px]`; focused state: `border-primary shadow-[0_0_0_4px_rgba(250,70,23,0.09)]`. Use shadcn `Input` with `className` override or replicate with a wrapper div + plain `<input>`.

### Toggle component (`apps/web/src/common/components/Toggle.tsx` — new if not exists)

- [ ] Check if a toggle/switch already exists in `common/components/ui/` (shadcn `Switch`)
- [ ] If not, create `Toggle.tsx`: `42×24` pill (`bg-primary` on / `bg-border-strong` off), `20×20` circle slides `translateX(18px)` when on; label + hint text to the right

### Dropdown (Category / Condition)

- [ ] Use shadcn `<Select>` from `common/components/ui/select` — styled to match `h-[46px]` and focus ring; `onValueChange` sets state; map `CATEGORY_OPTIONS` / `CONDITION_OPTIONS` as `<SelectItem>`

### Bottom action bar

```tsx
<div className="mt-7 pt-5 border-t border-border flex items-center gap-3">
  <button
    onClick={() => navigate({ to: '/' })}
    className="h-11 px-4 rounded-[6px] text-[14px] font-semibold hover:bg-muted transition-colors"
  >
    Cancel
  </button>
  <div className="flex-1" />
  <Button
    onClick={handlePost}
    disabled={!canPost || createItem.isPending}
    className="h-11 px-[22px] text-[14px] font-bold"
  >
    {createItem.isPending && <LoadingSpinner size={16} className="text-white mr-2" />}
    {createItem.isPending ? 'Posting…' : 'Post Listing'}
  </Button>
</div>
```

Disabled state uses shadcn `Button`'s built-in `disabled:opacity-50` or add `bg-primary/50` — match `--primary-disabled` tint from design.

### Success state

```tsx
{
  createdItemId && (
    <SuccessModal
      title={title}
      price={price}
      category={category}
      photos={photos}
      itemId={createdItemId}
      onPostAnother={() => {
        setCreatedItemId(null);
        setPhotos([]);
        setTitle('');
        setDescription('');
        setPrice('');
        setOpenToOffers(false);
        setCategory('');
        setCondition('');
        setPickupLocation('');
      }}
    />
  );
}
```

---

## Responsive

- [ ] `upload-layout`: in `globals.css`:
  ```css
  @media (max-width: 1024px) {
    .upload-layout {
      grid-template-columns: 1fr !important;
    }
  }
  ```
- [ ] Left column (photos + preview) stacks above right column (form) at `≤1024px`

---

## Cleanup

- [ ] Revoke object URLs on unmount or when photo is removed: `URL.revokeObjectURL(photo.previewUrl)` in the remove handler and `useEffect` cleanup.
- [ ] Error photo state: show red border on `UploadThumb` + retry icon if `photo.error === true`; clicking retry re-triggers upload for that slot.

---

## Summary of new/changed files

| File                                                      | Action                                                                              |
| --------------------------------------------------------- | ----------------------------------------------------------------------------------- |
| `apps/web/src/modules/items/pages/NewItemPage.tsx`        | Full rewrite                                                                        |
| `apps/web/src/modules/items/components/ImageUploader.tsx` | Full rewrite                                                                        |
| `apps/web/src/modules/items/components/PreviewCard.tsx`   | New                                                                                 |
| `apps/web/src/modules/items/components/SuccessModal.tsx`  | New                                                                                 |
| `apps/web/src/modules/items/hooks/useUpload.ts`           | Type `any` → proper types                                                           |
| `apps/web/src/modules/items/hooks/useItems.ts`            | Type `useCreateItem` mutationFn                                                     |
| `apps/web/src/common/components/Toggle.tsx`               | New (if shadcn Switch is unsuitable)                                                |
| `apps/web/src/index.css` (globals)                        | Add `checkPop`, `overlayIn`, `scaleIn` keyframes + `.upload-layout` responsive rule |
