import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@swap-web/common/components/ui/dialog';
import { Button as ShadcnButton } from '@swap-web/common/components/ui/button';

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  itemTitle: string;
}

export default function ConfirmDeleteModal({ isOpen, onClose, onConfirm, itemTitle }: ConfirmDeleteModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Item</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete &ldquo;{itemTitle}&rdquo;? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2">
          <ShadcnButton variant="outline" onClick={onClose}>
            Cancel
          </ShadcnButton>
          <ShadcnButton variant="destructive" onClick={onConfirm}>
            Delete
          </ShadcnButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
