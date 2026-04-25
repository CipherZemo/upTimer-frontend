import { Card, CardContent } from '@/components/ui/card';
import { LineChart } from 'lucide-react';

export function EmptyChartState({ title, message }) {
  return (
    <Card>
      <CardContent className="flex flex-col items-center justify-center py-12">
        <LineChart className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold mb-2">{title || 'No Data Available'}</h3>
        <p className="text-sm text-muted-foreground text-center max-w-sm">
          {message || 'This check hasn\'t been monitored yet. Data will appear once the worker performs health checks.'}
        </p>
      </CardContent>
    </Card>
  );
}