import { useState } from 'react';
import { Link, useNavigate } from '@tanstack/react-router';
import { useQueryClient } from '@tanstack/react-query';
import type { ItemWithDetails } from '@swap/types';
import { Button } from '@swap-web/common/components/ui/button';
import UserAvatar from '@swap-web/common/components/UserAvatar';
import LoadingSpinner from '@swap-web/common/components/LoadingSpinner';
import ConfirmDeleteModal from '@swap-web/common/components/ConfirmDeleteModal';
import { useDeleteItem } from '@swap-web/modules/items/hooks/useItems';
import MarkAsSoldModal from './MarkAsSoldModal';

interface ItemDetailSellerProps {
  item: ItemWithDetails;
}

function relativeTime(date: Date | string): string {
  const now = Date.now();
  const then = new Date(date).getTime();
  const diff = Math.floor((now - then) / 1000);
  if (diff < 60) return 'just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 172800) return 'yesterday';
  return `${Math.floor(diff / 86400)}d ago`;
}

function ShareIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path
        d="M13 6a2 2 0 1 0 0-4 2 2 0 0 0 0 4ZM5 10a2 2 0 1 0 0-4 2 2 0 0 0 0 4ZM13 16a2 2 0 1 0 0-4 2 2 0 0 0 0 4ZM7.13 10.93l3.76 2.14M10.87 7.07 7.13 9.07"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function PinIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M8 1.5a4 4 0 0 1 4 4c0 2.5-4 9-4 9s-4-6.5-4-9a4 4 0 0 1 4-4Z" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="8" cy="5.5" r="1.5" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

function EyeIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path d="M1.5 9S4 3.5 9 3.5 16.5 9 16.5 9 14 14.5 9 14.5 1.5 9 1.5 9Z" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="9" cy="9" r="2.5" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

function ChatIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path
        d="M2 3.5h14a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H5l-4 3V4.5a1 1 0 0 1 1-1Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function ItemDetailSeller({ item }: ItemDetailSellerProps) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const deleteMutation = useDeleteItem();
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [markAsSoldOpen, setMarkAsSoldOpen] = useState(false);

  const categoryLabel = item.category.charAt(0).toUpperCase() + item.category.slice(1);
  const conditionLabel = item.condition.replace('_', ' ');

  function handleCopyLink() {
    navigator.clipboard.writeText(window.location.href);
  }

  function handleDelete() {
    deleteMutation.mutate(item.id, {
      onSuccess: () => {
        navigate({ to: '/profile' });
        queryClient.invalidateQueries({ queryKey: ['items'] });
      },
    });
  }

  return (
    <div className="sticky top-[88px] flex flex-col gap-4">
      {/* Top row — pills + share */}
      <div className="flex items-center gap-2">
        <span className="bg-accent text-primary text-[11.5px] font-semibold px-2.5 py-1 rounded-full">
          {categoryLabel}
        </span>
        <span className="bg-[#f1f1f1] text-muted-foreground text-[11.5px] font-semibold px-2.5 py-1 rounded-full capitalize">
          {conditionLabel}
        </span>
        <button
          onClick={handleCopyLink}
          className="ml-auto p-2 rounded-full hover:bg-muted transition-colors text-muted-foreground"
          aria-label="Copy link"
        >
          <ShareIcon />
        </button>
      </div>

      {/* Title + price */}
      <div>
        <h1 className="text-[24px] font-bold tracking-[-0.4px] leading-[1.25]">{item.title}</h1>
        <p className="text-[36px] font-extrabold tracking-[-0.8px] text-primary mt-1">฿{item.price.toLocaleString()}</p>
        <p className="text-[13px] text-muted-foreground mt-1.5">Posted {relativeTime(item.createdAt)}</p>
      </div>

      {/* Actions block */}
      <div className="bg-white border border-border rounded-lg p-4 flex flex-col gap-3">
        <Button variant="outline" className="w-full" asChild>
          <Link to="/items/new">Edit listing</Link>
        </Button>
        <Button className="w-full h-[50px] text-[15px] font-semibold" onClick={() => setMarkAsSoldOpen(true)}>
          Mark as Sold
        </Button>
        <button
          onClick={() => setDeleteOpen(true)}
          disabled={deleteMutation.isPending}
          className="w-full text-[13.5px] font-medium text-destructive hover:underline py-1 disabled:opacity-50"
        >
          {deleteMutation.isPending ? (
            <span className="flex items-center justify-center gap-2">
              <LoadingSpinner size={14} /> Deleting…
            </span>
          ) : (
            'Delete listing'
          )}
        </button>
      </div>

      {/* Pickup block */}
      <div className="rounded-lg border border-border p-4">
        <p className="text-[11px] font-semibold uppercase tracking-[0.6px] text-muted-foreground mb-3">Pickup</p>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-primary shrink-0">
            <PinIcon />
          </div>
          <p className="text-[14px]">{item.pickupLocation ?? 'Not specified'}</p>
        </div>
      </div>

      {/* Seller block */}
      <div className="rounded-lg border border-border p-4">
        <p className="text-[11px] font-semibold uppercase tracking-[0.6px] text-muted-foreground mb-3">Seller</p>
        <div className="flex items-center gap-3">
          <UserAvatar user={item.seller} size={48} />
          <div>
            <p className="font-semibold text-[14px]">{item.seller.fullName}</p>
            <p className="text-[12px] text-muted-foreground mt-0.5">
              {item.sellerSoldCount} sales · Member since{' '}
              {new Intl.DateTimeFormat('en', { month: 'short', year: 'numeric' }).format(
                new Date(item.seller.createdAt),
              )}
            </p>
          </div>
        </div>
      </div>

      {/* Stats block */}
      <div className="rounded-lg border border-border p-4">
        <p className="text-[11px] font-semibold uppercase tracking-[0.6px] text-muted-foreground mb-3">Listing Stats</p>
        <div className="grid grid-cols-2 gap-px bg-border rounded-lg overflow-hidden">
          <div className="flex flex-col items-center gap-1 p-3 bg-white">
            <EyeIcon />
            <span className="text-[17px] font-bold">{item.viewCount}</span>
            <span className="text-[11.5px] text-muted-foreground">Views</span>
          </div>
          <div className="flex flex-col items-center gap-1 p-3 bg-white">
            <ChatIcon />
            <span className="text-[17px] font-bold">—</span>
            <span className="text-[11.5px] text-muted-foreground">Chats</span>
          </div>
        </div>
      </div>

      <ConfirmDeleteModal
        isOpen={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleDelete}
        itemTitle={item.title}
      />

      <MarkAsSoldModal isOpen={markAsSoldOpen} onClose={() => setMarkAsSoldOpen(false)} item={item} />
    </div>
  );
}
