import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const PRESETS = [
  { label: '24 Hours', value: '24h', hours: 24 },
  { label: '7 Days', value: '7d', hours: 24 * 7 },
  { label: '30 Days', value: '30d', hours: 24 * 30 },
  { label: '90 Days', value: '90d', hours: 24 * 90 },
];

export function DateRangeFilter({ value, onChange }) {
  return (
    <div className="flex flex-wrap gap-2">
      {PRESETS.map((preset) => (
        <Button
          key={preset.value}
          variant={value === preset.value ? 'default' : 'outline'}
          size="sm"
          onClick={() => onChange(preset.value)}
          className={cn(
            value === preset.value && 'pointer-events-none'
          )}
        >
          {preset.label}
        </Button>
      ))}
    </div>
  );
}

export function getDateRangeFromPreset(preset) {
  const now = new Date();
  const presetConfig = PRESETS.find(p => p.value === preset);
  
  if (!presetConfig) {
    return { start: null, end: null };
  }

  const start = new Date(now.getTime() - presetConfig.hours * 60 * 60 * 1000);
  return { start, end: now };
}