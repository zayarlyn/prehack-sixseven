import { useNavigate } from '@tanstack/react-router';
import PreviewCard from './PreviewCard';
import type { UploadedPhoto } from './ImageUploader';

interface SuccessModalProps {
  title: string;
  price: string;
  category: string;
  photos: UploadedPhoto[];
  itemId: string;
  onPostAnother: () => void;
}

export default function SuccessModal({ title, price, category, photos, itemId, onPostAnother }: SuccessModalProps) {
  const navigate = useNavigate();

  return (
    <div
      className="fixed inset-0 bg-black/45 z-50 flex items-center justify-center"
      style={{ animation: 'overlayIn 200ms ease both' }}
    >
      <div
        className="bg-white rounded-[14px] p-[36px_32px] max-w-[400px] w-[90%] flex flex-col items-center gap-4 shadow-[0_16px_48px_rgba(16,24,40,0.18)]"
        style={{ animation: 'scaleIn 220ms ease both' }}
      >
        <div className="w-16 h-16 rounded-full bg-[rgba(16,185,129,0.1)] flex items-center justify-center">
          <svg
            width="30"
            height="30"
            viewBox="0 0 30 30"
            fill="none"
            stroke="var(--success)"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ animation: 'checkPop 360ms cubic-bezier(0.34,1.56,0.64,1) both' }}
          >
            <polyline points="5,15 12,22 25,8" />
          </svg>
        </div>

        <div className="flex flex-col items-center gap-1.5 text-center">
          <h2 className="text-[20px] font-bold tracking-[-0.3px]">Listing posted!</h2>
          <p className="text-[14.5px] text-muted-foreground leading-[1.55]">
            Your item is now live and visible to KMUTT students.
          </p>
        </div>

        <div className="w-full bg-muted rounded-[8px] border border-border overflow-hidden">
          <PreviewCard title={title} price={price} category={category} photos={photos} />
        </div>

        <div className="flex gap-2.5 w-full">
          <button
            onClick={onPostAnother}
            className="flex-1 h-11 rounded-[6px] bg-white border-[1.5px] border-border text-[14px] font-semibold hover:bg-muted transition-colors"
          >
            Post another
          </button>
          <button
            onClick={() => navigate({ to: '/items/$itemId', params: { itemId } })}
            className="flex-1 h-11 rounded-[6px] bg-primary text-white text-[14px] font-semibold hover:bg-primary/90 transition-colors"
          >
            View listing
          </button>
        </div>
      </div>
    </div>
  );
}
