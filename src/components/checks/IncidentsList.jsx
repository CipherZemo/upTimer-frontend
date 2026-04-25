import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { format, formatDistanceStrict } from 'date-fns';
import { AlertCircle, CheckCircle2, Clock } from 'lucide-react';

export function IncidentsList({ incidents }) {
  if (!incidents || incidents.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Incidents</CardTitle>
          <CardDescription>Downtime events and recovery logs</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8">
            <CheckCircle2 className="h-12 w-12 text-green-500 mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Incidents</h3>
            <p className="text-sm text-muted-foreground text-center">
              Great! This check has had no downtime in the selected period.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Incidents ({incidents.length})</CardTitle>
        <CardDescription>Downtime events and recovery logs</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {incidents.map((incident) => (
            <div
              key={incident._id}
              className="border rounded-lg p-4 hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold">Service Down</h4>
                    <p className="text-sm text-muted-foreground">
                      {format(new Date(incident.startedAt), 'PPpp')}
                    </p>
                  </div>
                </div>
                <Badge
                  variant={incident.status === 'resolved' ? 'default' : 'destructive'}
                  className={incident.status === 'resolved' ? 'bg-green-500' : ''}
                >
                  {incident.status}
                </Badge>
              </div>

              {incident.failureReason && (
                <div className="mb-3">
                  <p className="text-sm">
                    <span className="font-medium">Reason:</span>{' '}
                    <span className="text-muted-foreground">{incident.failureReason}</span>
                  </p>
                  {incident.errorType && (
                    <p className="text-sm">
                      <span className="font-medium">Type:</span>{' '}
                      <span className="text-muted-foreground capitalize">{incident.errorType}</span>
                    </p>
                  )}
                </div>
              )}

              {incident.status === 'resolved' && incident.resolvedAt && (
                <div className="flex items-center gap-4 text-sm border-t pt-3">
                  <div className="flex items-center gap-1 text-green-600">
                    <CheckCircle2 className="h-4 w-4" />
                    <span>Recovered</span>
                  </div>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>
                      Duration: {formatDistanceStrict(
                        new Date(incident.startedAt),
                        new Date(incident.resolvedAt)
                      )}
                    </span>
                  </div>
                  <span className="text-muted-foreground">
                    {format(new Date(incident.resolvedAt), 'PPpp')}
                  </span>
                </div>
              )}

              {incident.status === 'open' && (
                <div className="flex items-center gap-2 text-sm text-destructive border-t pt-3">
                  <AlertCircle className="h-4 w-4" />
                  <span>Still ongoing</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}