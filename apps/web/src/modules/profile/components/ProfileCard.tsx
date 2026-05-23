import { useState, useRef, useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { cn } from '@swap-web/common/lib/utils';
import CategoryThumbnail from '@swap-web/common/components/CategoryThumbnail';
import ConfirmDeleteModal from '@swap-web/common/components/ConfirmDeleteModal';
import { CATEGORY_PALETTE } from '@swap-web/common/lib/category-palette';
import { useMarkItemSold, useDeleteItem } from '../hooks/useProfile';

type CategoryKey = keyof typeof CATEGORY_PALETTE;

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function formatDate(date: Date | string | null | undefined): string {
  if (!date) return '';
  return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export interface ProfileCardItem {
  id: string;
  title: string;
  price: number;
  category: string;
  itemImages: { url?: string }[];
  soldAt?: Date | string | null;
}

interface StatusPillProps {
  status: 'active' | 'sold' | 'purchased';
}

function StatusPill({ status }: StatusPillProps) {
  if (status === 'active') {
    return (
      <span
        style={{
          position: 'absolute',
          top: 8,
          left: 8,
          fontSize: 10.5,
          fontWeight: 700,
          color: 'var(--od-primary)',
          background: '#fff',
          padding: '3px 8px',
          borderRadius: 999,
          letterSpacing: 0.4,
          textTransform: 'uppercase',
          boxShadow: '0 1px 2px rgba(0,0,0,0.08)',
          display: 'inline-flex',
          alignItems: 'center',
          gap: 5,
        }}
      >
        <span
          style={{
            width: 5,
            height: 5,
            borderRadius: '50%',
            background: 'var(--od-primary)',
            flexShrink: 0,
          }}
        />
        Active
      </span>
    );
  }
  if (status === 'sold') {
    return (
      <span
        style={{
          position: 'absolute',
          top: 8,
          left: 8,
          fontSize: 10.5,
          fontWeight: 700,
          color: '#fff',
          background: 'var(--od-success)',
          padding: '3px 8px',
          borderRadius: 999,
          letterSpacing: 0.4,
          textTransform: 'uppercase',
        }}
      >
        Sold
      </span>
    );
  }
  return (
    <span
      style={{
        position: 'absolute',
        top: 8,
        left: 8,
        fontSize: 10.5,
        fontWeight: 700,
        color: 'var(--od-text)',
        background: '#fff',
        padding: '3px 8px',
        borderRadius: 999,
        letterSpacing: 0.4,
        textTransform: 'uppercase',
        boxShadow: '0 1px 2px rgba(0,0,0,0.08)',
      }}
    >
      Purchased
    </span>
  );
}

interface CardMenuProps {
  onClose: () => void;
  onEdit: () => void;
  onMarkSold: () => void;
  onDelete: () => void;
}

function CardMenu({ onClose, onEdit, onMarkSold, onDelete }: CardMenuProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [onClose]);

  return (
    <div
      ref={ref}
      onClick={(e) => e.stopPropagation()}
      style={{
        position: 'absolute',
        top: 46,
        right: 8,
        background: '#fff',
        borderRadius: 8,
        boxShadow: 'var(--od-shadow-popover)',
        border: '1px solid var(--od-border)',
        padding: 4,
        minWidth: 172,
        zIndex: 20,
      }}
    >
      <MenuRow
        label="View listing"
        color="var(--od-text)"
        hoverBg="var(--od-surface-alt)"
        onClick={onEdit}
        icon={
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8Z" stroke="currentColor" strokeWidth="2" />
            <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" />
          </svg>
        }
      />
      <MenuRow
        label="Mark as Sold"
        color="var(--od-primary)"
        hoverBg="var(--od-primary-tint)"
        onClick={onMarkSold}
        icon={
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
            <path
              d="M5 12.5l4.5 4.5L19 7"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        }
      />
      <div style={{ height: 1, background: 'var(--od-border)', margin: '4px 6px' }} />
      <MenuRow
        label="Delete listing"
        color="var(--od-error)"
        hoverBg="var(--od-error-tint)"
        onClick={onDelete}
        icon={
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
            <path
              d="M5 7h14M10 7V5a2 2 0 0 1 2-2h0a2 2 0 0 1 2 2v2M7 7l1 12a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2l1-12"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        }
      />
    </div>
  );
}

interface MenuRowProps {
  label: string;
  color: string;
  hoverBg: string;
  onClick: () => void;
  icon: React.ReactNode;
}

function MenuRow({ label, color, hoverBg, onClick, icon }: MenuRowProps) {
  const [hover, setHover] = useState(false);
  return (
    <button
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onClick={onClick}
      style={{
        background: hover ? hoverBg : 'transparent',
        border: 'none',
        textAlign: 'left',
        padding: '9px 12px',
        cursor: 'pointer',
        color,
        fontSize: 13.5,
        fontWeight: 500,
        borderRadius: 6,
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        transition: 'background 100ms ease',
        width: '100%',
        fontFamily: 'inherit',
      }}
    >
      <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 16 }}>{icon}</span>
      {label}
    </button>
  );
}

interface ProfileCardProps {
  item: ProfileCardItem;
  status: 'active' | 'sold' | 'purchased';
  showMenu: boolean;
  date?: Date | string | null;
}

export default function ProfileCard({ item, status, showMenu, date }: ProfileCardProps) {
  const navigate = useNavigate();
  const [hover, setHover] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const categoryKey = capitalize(item.category) as CategoryKey;
  const imageUrl = item.itemImages[0]?.url;

  const { mutate: markSold } = useMarkItemSold();
  const { mutate: deleteItem } = useDeleteItem();

  const displayDate = date ?? item.soldAt;

  return (
    <>
      <article
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        onClick={() => navigate({ to: '/items/$itemId', params: { itemId: item.id } })}
        className={cn('relative overflow-hidden rounded-lg bg-white cursor-pointer')}
        style={{
          boxShadow: hover ? 'var(--od-shadow-card-hover)' : 'var(--od-shadow-card)',
          transform: hover ? 'translateY(-1px)' : 'none',
          transition: 'box-shadow 160ms ease, transform 160ms ease',
        }}
      >
        <div style={{ position: 'relative' }}>
          {imageUrl ? (
            <div style={{ position: 'relative', width: '100%', aspectRatio: '1 / 1', overflow: 'hidden' }}>
              <img src={imageUrl} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
          ) : (
            <CategoryThumbnail category={categoryKey} tag={item.title} />
          )}
          <StatusPill status={status} />
          {showMenu && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setMenuOpen((v) => !v);
              }}
              aria-label="More options"
              style={{
                position: 'absolute',
                top: 8,
                right: 8,
                width: 32,
                height: 32,
                borderRadius: '50%',
                background: 'rgba(255,255,255,0.94)',
                border: 'none',
                cursor: 'pointer',
                color: 'var(--od-text)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <circle cx="5" cy="12" r="1.6" fill="currentColor" />
                <circle cx="12" cy="12" r="1.6" fill="currentColor" />
                <circle cx="19" cy="12" r="1.6" fill="currentColor" />
              </svg>
            </button>
          )}
          {menuOpen && (
            <CardMenu
              onClose={() => setMenuOpen(false)}
              onEdit={() => {
                setMenuOpen(false);
                navigate({ to: '/items/$itemId', params: { itemId: item.id } });
              }}
              onMarkSold={() => {
                setMenuOpen(false);
                markSold(item.id);
              }}
              onDelete={() => {
                setMenuOpen(false);
                setDeleteOpen(true);
              }}
            />
          )}
        </div>

        <div style={{ padding: '11px 12px 14px' }}>
          <h3
            className="line-clamp-2"
            style={{
              margin: 0,
              fontSize: 13.5,
              fontWeight: 500,
              lineHeight: 1.35,
              minHeight: 36,
              color: 'var(--od-text)',
            }}
          >
            {item.title}
          </h3>
          <div
            style={{
              fontSize: 16,
              fontWeight: 700,
              letterSpacing: -0.2,
              marginTop: 6,
              color: status === 'sold' ? 'var(--od-text-secondary)' : 'var(--od-text)',
              textDecoration: status === 'sold' ? 'line-through' : 'none',
            }}
          >
            ฿{item.price.toLocaleString()}
          </div>
          {displayDate && (
            <div
              style={{
                marginTop: 4,
                fontSize: 11.5,
                color: status === 'sold' ? 'var(--od-success-dark)' : 'var(--od-text-secondary)',
                fontWeight: status === 'sold' ? 600 : 500,
              }}
            >
              {status === 'sold' ? 'Sold' : 'Bought'} {formatDate(displayDate)}
            </div>
          )}
        </div>
      </article>

      <ConfirmDeleteModal
        isOpen={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={() => {
          setDeleteOpen(false);
          deleteItem(item.id);
        }}
        itemTitle={item.title}
      />
    </>
  );
}
