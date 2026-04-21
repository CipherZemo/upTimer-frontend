import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { CheckList } from "@/components/checks/CheckList";
import { CheckListSkeleton } from "@/components/checks/CheckListSkeleton";
import { CreateCheckModal } from "@/components/checks/CreateCheckModal";
import { DeleteCheckDialog } from "@/components/checks/DeleteCheckDialog";
import { useChecks } from "@/hooks/useChecks";

export function Checks() {
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [checkToDelete, setCheckToDelete] = useState(null);

  const { data, isLoading, isError, error } = useChecks();

  const handleDeleteClick = (check) => {
    setCheckToDelete(check);
    setDeleteDialogOpen(true);
  };

  if (isError) {
    return (
      <div className="text-center py-12">
        <p className="text-destructive">
          Error loading checks: {error.message}
        </p>
        <Button onClick={() => window.location.reload()} className="mt-4">
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Checks</h1>
          <p className="text-muted-foreground mt-1">
            Manage and monitor your API endpoints
          </p>
        </div>
        <Button onClick={() => setCreateModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Create Check
        </Button>
      </div>

      {/* Check List */}
      {isLoading ? (
        <CheckListSkeleton />
      ) : (
        <CheckList checks={data?.checks} onDelete={handleDeleteClick} />
      )}

      {/* Modals */}
      <CreateCheckModal
        open={createModalOpen}
        onOpenChange={setCreateModalOpen}
      />

      {checkToDelete && (
        <DeleteCheckDialog
          check={checkToDelete}
          open={deleteDialogOpen}
          onOpenChange={setDeleteDialogOpen}
        />
      )}
    </div>
  );
}
