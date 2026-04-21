import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CheckForm } from "./CheckForm";
import { useCreateCheck } from "@/hooks/useChecks";

export function CreateCheckModal({ open, onOpenChange }) {
  const createCheck = useCreateCheck();

  const handleSubmit = async (data) => {
    await createCheck.mutateAsync(data);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Check</DialogTitle>
          <DialogDescription>
            Add a new endpoint to monitor. We'll check it at your specified
            interval.
          </DialogDescription>
        </DialogHeader>
        <CheckForm onSubmit={handleSubmit} isLoading={createCheck.isPending} />
      </DialogContent>
    </Dialog>
  );
}
