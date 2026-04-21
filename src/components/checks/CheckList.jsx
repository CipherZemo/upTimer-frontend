import { CheckListItem } from "./CheckListItem";
import { Card, CardContent } from "@/components/ui/card";
import { Activity } from "lucide-react";

export function CheckList({ checks, onDelete }) {
  if (!checks || checks.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Activity className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No checks yet</h3>
          <p className="text-sm text-muted-foreground text-center max-w-sm">
            Get started by creating your first check to monitor your APIs and
            websites.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {checks.map((check) => (
        <CheckListItem key={check._id} check={check} onDelete={onDelete} />
      ))}
    </div>
  );
}
