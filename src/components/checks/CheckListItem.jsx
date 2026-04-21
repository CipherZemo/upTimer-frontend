import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StatusBadge, UptimeBadge } from './StatusBadge';
import { Trash2, ExternalLink, Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export function CheckListItem({ check, onDelete }) {
  const formatLastChecked = (date) => {
    if (!date) return 'Never';
    try {
      return formatDistanceToNow(new Date(date), { addSuffix: true });
    } catch {
      return 'Unknown';
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            {/* Name and Status */}
            <div className="flex items-center gap-3 mb-2">
              <h3 className="text-lg font-semibold truncate">{check.name}</h3>
              <StatusBadge status={check.status} />
            </div>

            {/* URL */}
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
              <ExternalLink className="h-4 w-4 flex-shrink-0" />
              
                href={check.url}
                target="_blank"
                rel="noopener noreferrer"
                className="truncate hover:underline"
              >
                {check.url}
              </a>
            </div>

            {/* Metadata */}
            <div className="flex flex-wrap items-center gap-4 text-sm">
              <div className="flex items-center gap-1 text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>Every {check.interval} min</span>
              </div>

              {check.lastCheckedAt && (
                <div className="text-muted-foreground">
                  Last checked {formatLastChecked(check.lastCheckedAt)}
                </div>
              )}

              <UptimeBadge uptime={check.uptime} />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 ml-4">
            <Button
              variant="outline"
              size="icon"
              onClick={() => onDelete(check)}
              className="text-destructive hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}