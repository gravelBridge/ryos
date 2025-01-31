import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useRef } from "react";

interface ConfirmDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  title: string;
  description: string;
}

export function ConfirmDialog({
  isOpen,
  onOpenChange,
  onConfirm,
  title,
  description,
}: ConfirmDialogProps) {
  const confirmButtonRef = useRef<HTMLButtonElement>(null);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent
        className="bg-system7-window-bg border-2 border-black rounded-lg shadow-[2px_2px_0px_0px_rgba(0,0,0,0.5)]"
        onOpenAutoFocus={(e) => {
          e.preventDefault();
          confirmButtonRef.current?.focus();
        }}
      >
        <DialogHeader>{title}</DialogHeader>
        <div className="p-4 px-6">
          <div className="flex gap-3 items-start">
            <img
              src="/icons/warn.png"
              alt="Warning"
              className="w-[32px] h-[32px] mt-0.5 [image-rendering:pixelated]"
            />
            <p className="text-gray-900 mb-2 leading-tight">{description}</p>
          </div>
          <DialogFooter className="mt-4 flex flex-col gap-1 sm:flex-row">
            <Button
              variant="retro"
              onClick={() => onOpenChange(false)}
              className="order-last sm:order-first"
            >
              Cancel
            </Button>
            <Button variant="retro" onClick={onConfirm} ref={confirmButtonRef}>
              Confirm
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
