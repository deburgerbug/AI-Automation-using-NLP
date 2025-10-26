import { useState, useEffect, useMemo } from 'react';
import { LineChart, Line, PieChart, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Pie } from 'recharts';

import { TrendingUp, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Card, CardContent, CardHeader } from '../../components/ui/Card';
import { cn } from '../../utils/cn';


interface AnalyticsData {
    date: string;
    passed: number;
    failed: number;
    timeout: number;
}

interface TestMetrics {
    testName: string;
    totalRuns: number;
    passRate: number;
    avgDuration: number;
    lastRun: string;
    trend: 'up' | 'down' | 'stable';
}

export function AnalyticsPage() {
    const [analytics, setAnalytics] = useState<AnalyticsData[]>([]);
    const [metrics, setMetrics] = useState<TestMetrics[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadAnalytics();
    }, []);

    const loadAnalytics = async () => {
        setIsLoading(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Mock analytics data
            setAnalytics([
                { date: 'Mon', passed: 12, failed: 2, timeout: 1 },
                { date: 'Tue', passed: 15, failed: 1, timeout: 0 },
                { date: 'Wed', passed: 14, failed: 3, timeout: 2 },
                { date: 'Thu', passed: 18, failed: 1, timeout: 1 },
                { date: 'Fri', passed: 20, failed: 2, timeout: 0 },
                { date: 'Sat', passed: 8, failed: 2, timeout: 0 },
                { date: 'Sun', passed: 10, failed: 1, timeout: 1 },
            ]);

            // Mock test metrics
            setMetrics([
                {
                    testName: 'Login Flow Test',
                    totalRuns: 45,
                    passRate: 95,
                    avgDuration: 3.2,
                    lastRun: '2 hours ago',
                    trend: 'up',
                },
                {
                    testName: 'Form Submission',
                    totalRuns: 38,
                    passRate: 87,
                    avgDuration: 4.1,
                    lastRun: '1 day ago',
                    trend: 'down',
                },
                {
                    testName: 'Navigation Test',
                    totalRuns: 52,
                    passRate: 92,
                    avgDuration: 2.8,
                    lastRun: '3 hours ago',
                    trend: 'stable',
                },
            ]);
        } finally {
            setIsLoading(false);
        }
    };

    const aggregatedStats = useMemo(() => {
        const total = analytics.reduce(
            (acc, d) => ({
                passed: acc.passed + d.passed,
                failed: acc.failed + d.failed,
                timeout: acc.timeout + d.timeout,
            }),
            { passed: 0, failed: 0, timeout: 0 }
        );

        const sum = total.passed + total.failed + total.timeout;
        return {
            ...total,
            total: sum,
            passRate: sum > 0 ? ((total.passed / sum) * 100).toFixed(1) : 0,
        };
    }, [analytics]);

    const pieData = [
        { name: 'Passed', value: aggregatedStats.passed, color: '#10b981' },
        { name: 'Failed', value: aggregatedStats.failed, color: '#ef4444' },
        { name: 'Timeout', value: aggregatedStats.timeout, color: '#f59e0b' },
    ].filter(d => d.value > 0);

    const topPerformers = metrics.sort((a, b) => b.passRate - a.passRate).slice(0, 3);
    const needsAttention = metrics.filter(m => m.passRate < 90).sort((a, b) => a.passRate - b.passRate);

    if (isLoading) {
        return (
            <div className="max-w-7xl mx-auto space-y-6 animate-pulse">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="h-80 bg-gray-200 dark:bg-gray-800 rounded-lg" />
                ))}
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                    Analytics Dashboard
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                    Insights into your test execution patterns and performance
                </p>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <MetricCard
                    label="Total Executions"
                    value={aggregatedStats.total}
                    icon="📊"
                />
                <MetricCard
                    label="Pass Rate"
                    value={`${aggregatedStats.passRate}%`}
                    icon="✅"
                    highlight="green"
                />
                <MetricCard
                    label="Failed Tests"
                    value={aggregatedStats.failed}
                    icon="❌"
                    highlight={aggregatedStats.failed > 0 ? 'red' : 'gray'}
                />
                <MetricCard
                    label="Avg Tests/Day"
                    value={Math.round(aggregatedStats.total / 7)}
                    icon="⚡"
                />
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
                {/* Execution Trend */}
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <TrendingUp className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                                Weekly Execution Trend
                            </h2>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={analytics}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                <XAxis dataKey="date" stroke="#6b7280" />
                                <YAxis stroke="#6b7280" />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: '#1f2937',
                                        border: 'none',
                                        borderRadius: '8px',
                                        color: '#f3f4f6',
                                    }}
                                />
                                <Legend />
                                <Line type="monotone" dataKey="passed" stroke="#10b981" strokeWidth={2} dot={{ r: 4 }} />
                                <Line type="monotone" dataKey="failed" stroke="#ef4444" strokeWidth={2} dot={{ r: 4 }} />
                                <Line type="monotone" dataKey="timeout" stroke="#f59e0b" strokeWidth={2} dot={{ r: 4 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* Pass Rate Distribution */}
                <Card>
                    <CardHeader>
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                            Result Distribution
                        </h2>
                    </CardHeader>
                    <CardContent className="flex items-center justify-center">
                        {pieData.length > 0 ? (
                            <ResponsiveContainer width="100%" height={250}>
                                <PieChart>
                                    <Pie
                                        data={pieData}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        label={(props) => `${props.name}: ${props.value}`}
                                        outerRadius={80}
                                        fill="#8884d8"
                                        dataKey="value"
                                    >
                                        {pieData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        ) : (
                            <p className="text-gray-500">No data available</p>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Test Performance Metrics */}
            <Card>
                <CardHeader>
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                        Test Performance Metrics
                    </h2>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3">
                        {metrics.map(metric => (
                            <div key={metric.testName} className="flex items-start justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                                <div className="flex-1">
                                    <p className="font-medium text-gray-900 dark:text-gray-100">
                                        {metric.testName}
                                    </p>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        {metric.totalRuns} runs • Last run {metric.lastRun}
                                    </p>
                                </div>

                                <div className="flex items-center gap-6">
                                    <div className="text-right">
                                        <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                                            {metric.passRate}%
                                        </p>
                                        <p className="text-xs text-gray-500">Pass Rate</p>
                                    </div>

                                    <div className="text-right">
                                        <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                                            {metric.avgDuration}s
                                        </p>
                                        <p className="text-xs text-gray-500">Avg Duration</p>
                                    </div>

                                    <div className={cn(
                                        'px-3 py-1 rounded-full text-xs font-medium',
                                        metric.trend === 'up' && 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400',
                                        metric.trend === 'down' && 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400',
                                        metric.trend === 'stable' && 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-400'
                                    )}>
                                        {metric.trend === 'up' && '📈 Improving'}
                                        {metric.trend === 'down' && '📉 Declining'}
                                        {metric.trend === 'stable' && '➡️ Stable'}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Top Performers & Needs Attention */}
            <div className="grid md:grid-cols-2 gap-6">
                {/* Top Performers */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                                Top Performers
                            </h2>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {topPerformers.map((test, idx) => (
                                <div key={test.testName} className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                                    <span className="text-2xl font-bold text-green-600 dark:text-green-400">
                                        #{idx + 1}
                                    </span>
                                    <div className="flex-1">
                                        <p className="font-medium text-gray-900 dark:text-gray-100">
                                            {test.testName}
                                        </p>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            {test.passRate}% pass rate
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Needs Attention */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <AlertCircle className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                                Needs Attention
                            </h2>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {needsAttention.length > 0 ? (
                            <div className="space-y-3">
                                {needsAttention.map((test) => (
                                    <div key={test.testName} className="flex items-center gap-3 p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                                        <AlertCircle className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                                        <div className="flex-1">
                                            <p className="font-medium text-gray-900 dark:text-gray-100">
                                                {test.testName}
                                            </p>
                                            <p className="text-sm text-orange-600 dark:text-orange-400">
                                                {test.passRate}% pass rate (below 90%)
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8">
                                <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-3" />
                                <p className="text-gray-600 dark:text-gray-400">
                                    All tests performing well!
                                </p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

// Sub-component
interface MetricCardProps {
    label: string;
    value: string | number;
    icon: string;
    highlight?: 'green' | 'red' | 'gray';
}

function MetricCard({ label, value, icon, highlight }: MetricCardProps) {
    const highlightClass = {
        green: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800',
        red: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800',
        gray: 'bg-gray-50 dark:bg-gray-800/50',
    };

    return (
        <Card className={highlight ? highlightClass[highlight] : ''}>
            <CardContent className="p-4">
                <div className="text-3xl mb-2">{icon}</div>
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">{label}</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    {value}
                </p>
            </CardContent>
        </Card>
    );
}
