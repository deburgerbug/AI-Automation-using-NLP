import { useState, useEffect, useMemo } from 'react';
import { format, formatDistanceToNow } from 'date-fns';
import {CheckCircle,XCircle,Clock,Play,Download,ChevronRight,RotateCcw,} from 'lucide-react';
import { Card, CardContent} from '../../components/ui/Card';
import { cn } from '../../utils/cn';
import { Button } from '../../components/ui/Button';
interface ExecutionRecord {
  id: string;
  testId: string;
  testName: string;
  status: 'PASSED' | 'FAILED' | 'TIMEOUT';
  duration: number;
  startedAt: Date;
  endedAt: Date;
  screenshots: string[];
  videoUrl?: string;
  errorMessage?: string;
}

const EXECUTION_STATUS_CONFIG = {
  PASSED: {
    icon: CheckCircle,
    bgClass: 'bg-green-50 dark:bg-green-900/20',
    borderClass: 'border-green-200 dark:border-green-800',
    badgeClass: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400',
    textClass: 'text-green-700 dark:text-green-400',
  },
  FAILED: {
    icon: XCircle,
    bgClass: 'bg-red-50 dark:bg-red-900/20',
    borderClass: 'border-red-200 dark:border-red-800',
    badgeClass: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400',
    textClass: 'text-red-700 dark:text-red-400',
  },
  TIMEOUT: {
    icon: Clock,
    bgClass: 'bg-orange-50 dark:bg-orange-900/20',
    borderClass: 'border-orange-200 dark:border-orange-800',
    badgeClass: 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400',
    textClass: 'text-orange-700 dark:text-orange-400',
  },
} as const;

export function ExecutionHistory() {
  const [executions, setExecutions] = useState<ExecutionRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState<'ALL' | 'PASSED' | 'FAILED' | 'TIMEOUT'>('ALL');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    loadExecutions();
  }, []);

  const loadExecutions = async () => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Mock data
      const now = new Date();
      setExecutions([
        {
          id: '1',
          testId: '1',
          testName: 'Login Flow Test',
          status: 'PASSED',
          duration: 3421,
          startedAt: new Date(now.getTime() - 3600000),
          endedAt: new Date(now.getTime() - 3600000 + 3421),
          screenshots: ['https://via.placeholder.com/300x200'],
          videoUrl: 'https://example.com/video.mp4',
        },
        {
          id: '2',
          testId: '2',
          testName: 'Form Submission Test',
          status: 'FAILED',
          duration: 5123,
          startedAt: new Date(now.getTime() - 7200000),
          endedAt: new Date(now.getTime() - 7200000 + 5123),
          screenshots: ['https://via.placeholder.com/300x200'],
          errorMessage: 'Element not found: .submit-button',
        },
        {
          id: '3',
          testId: '1',
          testName: 'Login Flow Test',
          status: 'PASSED',
          duration: 3100,
          startedAt: new Date(now.getTime() - 86400000),
          endedAt: new Date(now.getTime() - 86400000 + 3100),
          screenshots: ['https://via.placeholder.com/300x200'],
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredExecutions = useMemo(() => {
    if (selectedStatus === 'ALL') return executions;
    return executions.filter(e => e.status === selectedStatus);
  }, [executions, selectedStatus]);

  const stats = useMemo(() => ({
    total: executions.length,
    passed: executions.filter(e => e.status === 'PASSED').length,
    failed: executions.filter(e => e.status === 'FAILED').length,
    timeout: executions.filter(e => e.status === 'TIMEOUT').length,
    avgDuration: executions.length
      ? Math.round(executions.reduce((sum, e) => sum + e.duration, 0) / executions.length)
      : 0,
  }), [executions]);

  const passRate = executions.length
    ? Math.round((stats.passed / stats.total) * 100)
    : 0;

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="space-y-4 animate-pulse">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-32 bg-gray-200 dark:bg-gray-800 rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Execution History
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Track all test executions and results
          </p>
        </div>
        <Button
          variant="outline"
          onClick={loadExecutions}
        >
          <RotateCcw className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <StatsCard
          label="Total Runs"
          value={stats.total}
          icon="📊"
        />
        <StatsCard
          label="Passed"
          value={stats.passed}
          icon="✅"
          color="green"
        />
        <StatsCard
          label="Failed"
          value={stats.failed}
          icon="❌"
          color="red"
        />
        <StatsCard
          label="Pass Rate"
          value={`${passRate}%`}
          icon="📈"
          color="blue"
        />
        <StatsCard
          label="Avg Duration"
          value={`${(stats.avgDuration / 1000).toFixed(1)}s`}
          icon="⏱️"
        />
      </div>

      {/* Filter Buttons */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-2">
            <FilterButton
              label="All"
              count={stats.total}
              isActive={selectedStatus === 'ALL'}
              onClick={() => setSelectedStatus('ALL')}
            />
            <FilterButton
              label="Passed"
              count={stats.passed}
              isActive={selectedStatus === 'PASSED'}
              onClick={() => setSelectedStatus('PASSED')}
              color="green"
            />
            <FilterButton
              label="Failed"
              count={stats.failed}
              isActive={selectedStatus === 'FAILED'}
              onClick={() => setSelectedStatus('FAILED')}
              color="red"
            />
            <FilterButton
              label="Timeout"
              count={stats.timeout}
              isActive={selectedStatus === 'TIMEOUT'}
              onClick={() => setSelectedStatus('TIMEOUT')}
              color="orange"
            />
          </div>
        </CardContent>
      </Card>

      {/* Execution Records */}
      {filteredExecutions.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center">
            <Play className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
              No executions yet
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              Run a test to see execution history here
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {filteredExecutions.map(execution => (
            <ExecutionCard
              key={execution.id}
              execution={execution}
              isExpanded={expandedId === execution.id}
              onToggleExpand={() =>
                setExpandedId(expandedId === execution.id ? null : execution.id)
              }
            />
          ))}
        </div>
      )}
    </div>
  );
}

// Sub-components
interface StatsCardProps {
  label: string;
  value: string | number;
  icon: string;
  color?: 'green' | 'red' | 'blue';
}

function StatsCard({ label, value, icon, color }: StatsCardProps) {
  const colorClass = {
    green: 'bg-green-50 dark:bg-green-900/20',
    red: 'bg-red-50 dark:bg-red-900/20',
    blue: 'bg-blue-50 dark:bg-blue-900/20',
  };

  return (
    <Card>
      <CardContent className={cn('p-4', color && colorClass[color])}>
        <div className="text-3xl mb-2">{icon}</div>
        <p className="text-xs text-gray-600 dark:text-gray-400">{label}</p>
        <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          {value}
        </p>
      </CardContent>
    </Card>
  );
}

interface FilterButtonProps {
  label: string;
  count: number;
  isActive: boolean;
  onClick: () => void;
  color?: 'green' | 'red' | 'orange';
}

function FilterButton({
  label,
  count,
  isActive,
  onClick,
  color,
}: FilterButtonProps) {
  const activeColorClass = {
    green: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-green-300 dark:border-green-700',
    red: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 border-red-300 dark:border-red-700',
    orange: 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 border-orange-300 dark:border-orange-700',
  };

  return (
    <button
      onClick={onClick}
      className={cn(
        'px-4 py-2 rounded-lg border-2 font-medium transition-all',
        isActive && color && activeColorClass[color],
        !isActive && 'border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-gray-400'
      )}
    >
      {label} <span className="ml-1 opacity-70">({count})</span>
    </button>
  );
}

interface ExecutionCardProps {
  execution: ExecutionRecord;
  isExpanded: boolean;
  onToggleExpand: () => void;
}

function ExecutionCard({
  execution,
  isExpanded,
  onToggleExpand,
}: ExecutionCardProps) {
  const config = EXECUTION_STATUS_CONFIG[execution.status];
  const StatusIcon = config.icon;

  return (
    <Card>
      <CardContent className="p-0">
        <button
          onClick={onToggleExpand}
          className={cn(
            'w-full p-6 flex items-start justify-between hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors',
            isExpanded && 'bg-gray-50 dark:bg-gray-800/50'
          )}
        >
          <div className="flex items-start gap-4 flex-1 text-left">
            <div className={cn('p-3 rounded-lg', config.bgClass)}>
              <StatusIcon className={cn('w-6 h-6', config.textClass)} />
            </div>

            <div className="flex-1">
              <div className="flex items-center gap-3 mb-1">
                <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                  {execution.testName}
                </h3>
                <span className={cn('px-2 py-1 text-xs font-medium rounded', config.badgeClass)}>
                  {execution.status}
                </span>
              </div>

              <p className="text-sm text-gray-600 dark:text-gray-400">
                {formatDistanceToNow(execution.startedAt, { addSuffix: true })}
              </p>

              <div className="flex items-center gap-4 mt-2 text-xs text-gray-500 dark:text-gray-400">
                <span>
                  Duration: {(execution.duration / 1000).toFixed(2)}s
                </span>
                <span>
                  {format(execution.startedAt, 'MMM d, yyyy HH:mm:ss')}
                </span>
              </div>
            </div>
          </div>

          <ChevronRight
            className={cn(
              'w-5 h-5 text-gray-400 transition-transform flex-shrink-0',
              isExpanded && 'rotate-90'
            )}
          />
        </button>

        {isExpanded && (
          <div className="border-t border-gray-200 dark:border-gray-800 p-6 space-y-4">
            {execution.errorMessage && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                <p className="text-sm font-semibold text-red-700 dark:text-red-400 mb-1">
                  Error Message
                </p>
                <code className="text-xs text-red-600 dark:text-red-400 font-mono block whitespace-pre-wrap">
                  {execution.errorMessage}
                </code>
              </div>
            )}

            {execution.screenshots.length > 0 && (
              <div>
                <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3">
                  Screenshots ({execution.screenshots.length})
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {execution.screenshots.map((url, idx) => (
                    <a
                      key={idx}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group relative overflow-hidden rounded-lg"
                    >
                      <img
                        src={url}
                        alt={`Screenshot ${idx + 1}`}
                        className="w-full h-32 object-cover rounded-lg transition-transform group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors rounded-lg" />
                    </a>
                  ))}
                </div>
              </div>
            )}

            {execution.videoUrl && (
              <div>
                <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  Video Recording
                </p>
                
                <a
                  href={execution.videoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  Download Video
                </a>
              </div>
            )}

            <div className="pt-4 flex gap-2">
              <Button variant="primary" size="sm">
                <Play className="w-4 h-4 mr-2" />
                Re-run Test
              </Button>
              <Button variant="outline" size="sm">
                View Details
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}