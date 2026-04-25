import { useState, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ExternalLink } from 'lucide-react';
import { useCheck, useCheckResults, useCheckIncidents } from '@/hooks/useChecks';
import { CheckDetailsStats } from '@/components/checks/CheckDetailsStats';
import { ResponseTimeChart } from '@/components/checks/ResponseTimeChart';
import { UptimeTimeline } from '@/components/checks/UptimeTimeline';
import { IncidentsList } from '@/components/checks/IncidentsList';
import { DateRangeFilter, getDateRangeFromPreset } from '@/components/checks/DateRangeFilter';
import { StatusBadge } from '@/components/checks/StatusBadge';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';

export function CheckDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [dateRange, setDateRange] = useState('7d');

  // Fetch check details
  const { data: checkData, isLoading: checkLoading } = useCheck(id);
  const check = checkData?.check;

  // Fetch results and incidents
  const { data: resultsData, isLoading: resultsLoading } = useCheckResults(id, {
    limit: 1000,
  });
  const { data: incidentsData, isLoading: incidentsLoading } = useCheckIncidents(id, {
    limit: 100,
  });

  const results = resultsData?.results || [];
  const incidents = incidentsData?.incidents || [];

  // Filter data by date range
  const { filteredResults, filteredIncidents } = useMemo(() => {
    const { start } = getDateRangeFromPreset(dateRange);
    
    if (!start) {
      return { filteredResults: results, filteredIncidents: incidents };
    }

    const startTime = start.getTime();

    return {
      filteredResults: results.filter(r => new Date(r.timestamp).getTime() >= startTime),
      filteredIncidents: incidents.filter(i => new Date(i.startedAt).getTime() >= startTime),
    };
  }, [results, incidents, dateRange]);

  // Calculate stats using useMemo
  const stats = useMemo(() => {
    if (filteredResults.length === 0) {
      return {
        avgResponseTime: 0,
        totalIncidents: filteredIncidents.length,
        period: dateRange === '24h' ? '24 hours' : dateRange === '7d' ? '7 days' : dateRange === '30d' ? '30 days' : '90 days',
      };
    }

    const successfulResults = filteredResults.filter(r => r.status === 'success');
    const totalResponseTime = successfulResults.reduce((sum, r) => sum + r.responseTime, 0);

    return {
      avgResponseTime: successfulResults.length > 0 
        ? Math.round(totalResponseTime / successfulResults.length)
        : 0,
      totalIncidents: filteredIncidents.length,
      period: dateRange === '24h' ? '24 hours' : dateRange === '7d' ? '7 days' : dateRange === '30d' ? '30 days' : '90 days',
    };
  }, [filteredResults, filteredIncidents, dateRange]);

  if (checkLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-64" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <Skeleton className="h-20" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!check) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-4">Check Not Found</h2>
        <Button onClick={() => navigate('/checks')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Checks
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/checks')}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Checks
          </Button>
          
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold">{check.name}</h1>
            <StatusBadge status={check.status} />
          </div>
          
          <div className="flex items-center gap-2 text-muted-foreground">
            <ExternalLink className="h-4 w-4" />
            
             <a href={check.url}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline"
            >
              {check.url}
            </a>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <CheckDetailsStats check={check} stats={stats} />

      {/* Date Range Filter */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Analytics</h2>
        <DateRangeFilter value={dateRange} onChange={setDateRange} />
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-1">
        <ResponseTimeChart results={filteredResults} />
        <UptimeTimeline results={filteredResults} />
      </div>

      {/* Incidents List */}
      <IncidentsList incidents={filteredIncidents} />
    </div>
  );
}