import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useDeleteCheck } from "@/hooks/useChecks";
import { Loader2 } from "lucide-react";

export function DeleteCheckDialog({ check, open, onOpenChange }) {
  const deleteCheck = useDeleteCheck();

  const handleDelete = async () => {
    await deleteCheck.mutateAsync(check._id);
    onOpenChange(false);
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Check</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete "{check?.name}"? This action cannot
            be undone. All historical data and incidents will be permanently
            deleted.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={deleteCheck.isPending}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={deleteCheck.isPending}
            className="bg-destructive hover:bg-destructive/90"
          >
            {deleteCheck.isPending && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
