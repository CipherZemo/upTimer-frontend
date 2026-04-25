import { useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { format, startOfHour, endOfHour } from 'date-fns';
import { EmptyChartState } from './EmptyChartState';

export function UptimeTimeline({ results }) {
  const timelineData = useMemo(() => {
    if (!results || results.length === 0) return [];

    // Group results by hour
    const hourlyData = new Map();

    results.forEach(result => {
      const hourStart = startOfHour(new Date(result.timestamp));
      const hourKey = hourStart.getTime();

      if (!hourlyData.has(hourKey)) {
        hourlyData.set(hourKey, {
          timestamp: hourKey,
          hour: format(hourStart, 'MMM dd, HH:00'),
          total: 0,
          success: 0,
          failure: 0,
        });
      }

      const data = hourlyData.get(hourKey);
      data.total++;
      if (result.status === 'success') {
        data.success++;
      } else {
        data.failure++;
      }
    });

    // Calculate uptime percentage for each hour
    return Array.from(hourlyData.values())
      .map(data => ({
        ...data,
        uptime: (data.success / data.total) * 100,
      }))
      .sort((a, b) => a.timestamp - b.timestamp);
  }, [results]);

  if (timelineData.length === 0) {
    return (
      <EmptyChartState
        title="No Uptime Data"
        message="Uptime timeline will appear once health checks are performed."
      />
    );
  }

  const getBarColor = (uptime) => {
    if (uptime >= 99) return 'hsl(var(--chart-1))'; // Green
    if (uptime >= 95) return 'hsl(var(--chart-3))'; // Yellow
    return 'hsl(var(--destructive))'; // Red
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Uptime Timeline</CardTitle>
        <CardDescription>
          Hourly uptime percentage visualization
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={timelineData}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis
              dataKey="hour"
              className="text-xs"
              tick={{ fill: 'hsl(var(--muted-foreground))' }}
            />
            <YAxis
              className="text-xs"
              tick={{ fill: 'hsl(var(--muted-foreground))' }}
              label={{ value: 'Uptime %', angle: -90, position: 'insideLeft' }}
              domain={[0, 100]}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
              }}
              formatter={(value) => `${value.toFixed(2)}%`}
            />
            <Bar dataKey="uptime" name="Uptime %">
              {timelineData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={getBarColor(entry.uptime)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
        <div className="flex items-center justify-center gap-6 mt-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-green-500" />
            <span className="text-muted-foreground">≥99% Uptime</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-yellow-500" />
            <span className="text-muted-foreground">95-99% Uptime</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-red-500" />
            <span className="text-muted-foreground">&lt;95% Uptime</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}