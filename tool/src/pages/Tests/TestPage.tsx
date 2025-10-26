import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
// import { Input } from '../../components/ui/Input';
import { Card, CardContent } from '../../components/ui/Card';
import { Plus, Search, Play, Edit, Trash2,CheckCircle, XCircle, Clock} from 'lucide-react';
import { cn } from '../../utils/cn';
import { ROUTES } from '../../utils/constants';

interface Test {
    id: string,
    name: string,
    description: string,
    status: 'DRAFT' | 'READY' | 'DEPRECATED';
    lastRun?: {
        status: 'PASS' | 'FAIL',
        date: string
    };
    createdAt: string;
}
export function TestsPage() {
  const navigate = useNavigate();
  const [tests, setTests] = useState<Test[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadTests();
  }, []);

  const loadTests = async () => {
    setIsLoading(true);
    try {
      // TODO: Load from API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock data
      setTests([
        {
          id: '1',
          name: 'Login Flow Test',
          description: 'Tests user login functionality with valid credentials',
          status: 'READY',
          lastRun: {
            status: 'PASS',
            date: '2 hours ago',
          },
          createdAt: '2024-01-15',
        },
        {
          id: '2',
          name: 'Form Submission Test',
          description: 'Tests contact form submission and validation',
          status: 'READY',
          lastRun: {
            status: 'FAIL',
            date: '1 day ago',
          },
          createdAt: '2024-01-14',
        },
        {
          id: '3',
          name: 'Navigation Test',
          description: 'Tests main navigation and routing',
          status: 'DRAFT',
          createdAt: '2024-01-13',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredTests = tests.filter(test =>
    test.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    test.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleEdit = (testId: string) => {
    navigate(`${ROUTES.EDITOR}/${testId}`);
  };

  const handleRun = async (testId: string) => {
    // TODO: Implement test execution
    console.log('Running test:', testId);
  };

  const handleDelete = async (testId: string) => {
    if (!confirm('Are you sure you want to delete this test?')) return;
    
    // TODO: Delete from API
    setTests(tests.filter(t => t.id !== testId));
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="animate-pulse space-y-4">
          <div className="h-10 bg-gray-200 dark:bg-gray-800 rounded w-1/3"></div>
          <div className="h-40 bg-gray-200 dark:bg-gray-800 rounded"></div>
          <div className="h-40 bg-gray-200 dark:bg-gray-800 rounded"></div>
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
            My Tests
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            {tests.length} test{tests.length !== 1 ? 's' : ''} in your library
          </p>
        </div>
        <Button
          variant="primary"
          onClick={() => navigate(ROUTES.EDITOR)}
        >
          <Plus className="w-4 h-4 mr-2" />
          New Test
        </Button>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search tests..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </CardContent>
      </Card>

      {/* Tests List */}
      {filteredTests.length === 0 ? (
        <Card>
          <CardContent className="py-16">
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                No tests found
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mb-6">
                {searchQuery ? 'Try a different search term' : 'Create your first test to get started'}
              </p>
              {!searchQuery && (
                <Button variant="primary" onClick={() => navigate(ROUTES.EDITOR)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Test
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {filteredTests.map((test) => (
            <Card key={test.id}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                        {test.name}
                      </h3>
                      <span
                        className={cn(
                          'px-2 py-1 text-xs font-medium rounded-full',
                          test.status === 'READY' && 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400',
                          test.status === 'DRAFT' && 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400',
                          test.status === 'DEPRECATED' && 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-400'
                        )}
                      >
                        {test.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                      {test.description}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        Created {test.createdAt}
                      </span>
                      {test.lastRun && (
                        <span className="flex items-center gap-1">
                          {test.lastRun.status === 'PASS' ? (
                            <CheckCircle className="w-3 h-3 text-green-600" />
                          ) : (
                            <XCircle className="w-3 h-3 text-red-600" />
                          )}
                          Last run: {test.lastRun.date}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 ml-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRun(test.id)}
                    >
                      <Play className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(test.id)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(test.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}