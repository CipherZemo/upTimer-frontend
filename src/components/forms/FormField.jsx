import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

export function FormField({ label, error, className, ...props }) {
  return (
    <div className={cn('space-y-2', className)}>
      {label && <Label htmlFor={props.id}>{label}</Label>}
      <Input
        className={cn(error && 'border-destructive focus-visible:ring-destructive')}
        {...props}
      />
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}