import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useQueryClient } from '@tanstack/react-query';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@swap-web/common/components/ui/dialog';
import { Button } from '@swap-web/common/components/ui/button';
import { Input } from '@swap-web/common/components/ui/input';
import { Textarea } from '@swap-web/common/components/ui/textarea';
import LoadingSpinner from '@swap-web/common/components/LoadingSpinner';
import UserAvatar from '@swap-web/common/components/UserAvatar';
import { useConversations } from '@swap-web/modules/conversations/hooks/useConversations';
import { useCreateTransaction } from '@swap-web/modules/transactions/hooks/useTransactions';
import { useUpdateItem } from '@swap-web/modules/items/hooks/useItems';
import type { ItemWithDetails } from '@swap/types';

interface MarkAsSoldModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: ItemWithDetails;
}

export default function MarkAsSoldModal({ isOpen, onClose, item }: MarkAsSoldModalProps) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { conversations } = useConversations();
  const createTransaction = useCreateTransaction();
  const updateItem = useUpdateItem();

  const itemConvs = conversations.filter((c) => c.itemId === item.id);

  const [selectedConvId, setSelectedConvId] = useState<string | null>(null);
  const [finalPrice, setFinalPrice] = useState(item.price);
  const [note, setNote] = useState('');

  const isPending = createTransaction.isPending || updateItem.isPending;

  const selectedConv = itemConvs.find((c) => c.id === selectedConvId);
  const canConfirm = itemConvs.length === 0 || selectedConvId !== null;

  function handleConfirm() {
    if (itemConvs.length > 0 && selectedConv) {
      createTransaction.mutate(
        {
          itemId: item.id,
          buyerId: selectedConv.otherUser.id,
          finalPrice,
          note: note || undefined,
          conversationId: selectedConv.id,
        },
        {
          onSuccess: () => {
            onClose();
            navigate({ to: '/profile' });
            queryClient.invalidateQueries({ queryKey: ['item', item.id] });
          },
        },
      );
    } else {
      updateItem.mutate(
        { id: item.id, data: { status: 'sold' } },
        {
          onSuccess: () => {
            onClose();
            navigate({ to: '/profile' });
            queryClient.invalidateQueries({ queryKey: ['item', item.id] });
          },
        },
      );
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Mark as Sold</DialogTitle>
        </DialogHeader>

        <div className="text-[13px] text-muted-foreground border border-border rounded-lg px-3 py-2 bg-muted/30">
          <span className="font-medium text-foreground">{item.title}</span> · ฿{item.price.toLocaleString()}
        </div>

        <div className="flex flex-col gap-4 mt-1">
          <div>
            <p className="text-[13px] font-semibold mb-2">Who are you selling to?</p>
            {itemConvs.length > 0 ? (
              <div className="relative">
                <select
                  value={selectedConvId ?? ''}
                  onChange={(e) => setSelectedConvId(e.target.value || null)}
                  className="w-full h-10 rounded-md border border-input bg-background px-3 text-[13px] appearance-none pr-8 focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="">Select a buyer…</option>
                  {itemConvs.map((conv) => (
                    <option key={conv.id} value={conv.id}>
                      {conv.otherUser.fullName}
                    </option>
                  ))}
                </select>
                {selectedConv && (
                  <div className="mt-2 flex items-center gap-2 px-1">
                    <UserAvatar user={selectedConv.otherUser} size={24} />
                    <span className="text-[13px] font-medium">{selectedConv.otherUser.fullName}</span>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex gap-2 rounded-lg border border-border bg-muted/30 p-3 text-[13px] text-muted-foreground">
                <span>ℹ</span>
                <span>
                  No Swap conversations for this item. The item will be marked sold without recording a buyer.
                </span>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[13px] font-semibold">Final sale price</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[13px] text-muted-foreground">฿</span>
              <Input
                type="number"
                value={finalPrice}
                onChange={(e) => setFinalPrice(Number(e.target.value))}
                className="pl-6"
                min={0}
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[13px] font-semibold">Note (optional)</label>
            <Textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={3}
              placeholder="Any notes about the sale…"
            />
          </div>
        </div>

        <div className="flex gap-2 mt-2">
          <Button variant="outline" onClick={onClose} className="flex-1" disabled={isPending}>
            Cancel
          </Button>
          <Button onClick={handleConfirm} className="flex-1" disabled={!canConfirm || isPending}>
            {isPending ? (
              <span className="flex items-center gap-2">
                <LoadingSpinner size={14} /> Confirming…
              </span>
            ) : (
              'Confirm Sale'
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
