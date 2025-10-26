import { useState, useEffect } from 'react';
import { useNavigate,useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { ArrowLeft, Save, Play, Trash2, FileText } from 'lucide-react';
import { Card, CardContent, CardHeader } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { NLPInput } from '../HomePage/NLPInput';
import { CodePreviewMonaco } from '../HomePage/CodePreviewMonaco';
import { ROUTES } from '../../utils/constants';

export function TestEditor() {
  const navigate = useNavigate();
  const { testId } = useParams();
  const isEditMode = !!testId;

  const [testName, setTestName] = useState('');
  const [testDescription, setTestDescription] = useState('');
  const [nlpInput, setNlpInput] = useState('');
  const [generatedCode, setGeneratedCode] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isExecuting, setIsExecuting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Load test if editing
  useEffect(() => {
    if (isEditMode) {
      // TODO: Load test from API
      // For now, mock data
      setTestName('Sample Login Test');
      setTestDescription('Test user login functionality');
      setNlpInput('Go to login page\nEnter credentials\nClick submit');
      setGeneratedCode('// Generated code would be here');
    }
  }, [isEditMode, testId]);

  const handleGenerate = async () => {
    if (!nlpInput.trim()) {
      toast.error('Please enter test description');
      return;
    }
    
    setIsGenerating(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const mockCode = `import { test, expect } from '@playwright/test';

test('${testName || 'Generated test'}', async ({ page }) => {
  // ${nlpInput.split('\n')[0] || 'Test description'}
  await page.goto('https://example.com');
  
  // Perform test actions
  await page.click('button:has-text("Login")');
  await page.fill('input[type="email"]', 'test@example.com');
  await page.fill('input[type="password"]', 'password123');
  await page.click('button[type="submit"]');
  
  // Verify results
  await expect(page.locator('text=Welcome')).toBeVisible();
});`;
      
      setGeneratedCode(mockCode);
      toast.success('Code generated successfully!');
    } catch {
      toast.error('Failed to generate code');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleRun = async () => {
    if (!generatedCode) return;
    
    setIsExecuting(true);
    toast.info('Executing test...');
    
    try {
      await new Promise(resolve => setTimeout(resolve, 3000));
      toast.success('Test executed successfully!', {
        description: 'All assertions passed',
      });
    } catch{
      toast.error('Test execution failed');
    } finally {
      setIsExecuting(false);
    }
  };

  const handleSave = async () => {
    if (!testName.trim()) {
      toast.error('Please enter test name');
      return;
    }

    if (!nlpInput.trim() && !generatedCode.trim()) {
      toast.error('Please generate test code first');
      return;
    }

    setIsSaving(true);

    try {
      // TODO: Save to API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success(isEditMode ? 'Test updated!' : 'Test saved!');
      
      // Navigate to tests list after save
      setTimeout(() => {
        navigate(ROUTES.TESTS);
      }, 1000);
    } catch {
      toast.error('Failed to save test');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this test?')) {
      return;
    }

    try {
      // TODO: Delete from API
      await new Promise(resolve => setTimeout(resolve, 500));
      
      toast.success('Test deleted');
      navigate(ROUTES.TESTS);
    } catch {
      toast.error('Failed to delete test');
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {isEditMode ? 'Edit Test' : 'Create New Test'}
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {isEditMode ? 'Update your test configuration' : 'Build a new automated test'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isEditMode && (
            <Button
              variant="destructive"
              size="sm"
              onClick={handleDelete}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </Button>
          )}
          <Button
            variant="secondary"
            size="sm"
            onClick={handleSave}
            isLoading={isSaving}
            disabled={isSaving}
          >
            <Save className="w-4 h-4 mr-2" />
            {isSaving ? 'Saving...' : 'Save Test'}
          </Button>
        </div>
      </div>

      {/* Test Metadata */}
      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Test Information
          </h2>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <Input
              label="Test Name"
              placeholder="e.g., User Login Flow"
              value={testName}
              onChange={(e) => setTestName(e.target.value)}
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Description (Optional)
              </label>
              <textarea
                placeholder="Describe what this test does..."
                value={testDescription}
                onChange={(e) => setTestDescription(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Test Editor */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Left: NLP Input */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  Test Steps
                </h2>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <NLPInput
              value={nlpInput}
              onChange={setNlpInput}
              onGenerate={handleGenerate}
              isGenerating={isGenerating}
            />
          </CardContent>
        </Card>

        {/* Right: Code Preview */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Generated Code
              </h2>
              {generatedCode && (
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleRun}
                  isLoading={isExecuting}
                  disabled={isExecuting}
                >
                  <Play className="w-4 h-4 mr-2" />
                  {isExecuting ? 'Running...' : 'Run Test'}
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <CodePreviewMonaco
              code={generatedCode}
              isGenerating={isGenerating}
              language="typescript"
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}