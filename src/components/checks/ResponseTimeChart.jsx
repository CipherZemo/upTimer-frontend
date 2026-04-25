import { useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { format } from 'date-fns';
import { EmptyChartState } from './EmptyChartState';

export function ResponseTimeChart({ results }) {
  const chartData = useMemo(() => {
    if (!results || results.length === 0) return [];

    // Only include successful checks for response time
    return results
      .filter(r => r.status === 'success')
      .map(result => ({
        timestamp: new Date(result.timestamp).getTime(),
        responseTime: result.responseTime,
        date: format(new Date(result.timestamp), 'MMM dd, HH:mm'),
      }))
      .reverse(); // Show oldest to newest
  }, [results]);

  if (chartData.length === 0) {
    return (
      <EmptyChartState
        title="No Response Time Data"
        message="Response time data will appear once successful health checks are performed."
      />
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Response Time</CardTitle>
        <CardDescription>
          Average response time over the selected period
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis
              dataKey="date"
              className="text-xs"
              tick={{ fill: 'hsl(var(--muted-foreground))' }}
            />
            <YAxis
              className="text-xs"
              tick={{ fill: 'hsl(var(--muted-foreground))' }}
              label={{ value: 'ms', angle: -90, position: 'insideLeft' }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
              }}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="responseTime"
              stroke="hsl(var(--primary))"
              strokeWidth={2}
              dot={{ fill: 'hsl(var(--primary))' }}
              name="Response Time (ms)"
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}