import { useState } from 'react';
import { Code2, Play, Zap, Shield, Rocket } from 'lucide-react';
import { NLPInput } from './NLPInput';
// import { CodePreview } from './CodePreview';
import {CodePreviewMonaco} from './CodePreviewMonaco'
import { Card, CardContent, CardHeader } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button';

export function HomePage() {
  const [nlpInput, setNlpInput] = useState("");
  const [generatedCode, setGeneratedCode] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isExecuting, setIsExecuting] = useState(false);

  const handleGenerate = async () => {
    if (!nlpInput.trim()) return;

    setIsGenerating(true);

    try {
      // Replac with existing API call 
      // simultating API With delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      const mockCode = `import { test, expect } from '@playwright/test';

test('Generated test from natural language', async ({ page }) => {
  // ${nlpInput.split('\n')[0] || 'Navigate to page'}
  await page.goto('https://example.com');
  
  // Perform actions
  await page.click('button:has-text("Login")');
  await page.fill('input[type="email"]', 'test@email.com');
  await page.fill('input[type="password"]', 'password123');
  
  // Submit form
  await page.click('button[type="submit"]');
  
  // Verify result
  await expect(page.locator('text=Welcome')).toBeVisible();
  
  // Additional assertions
  await expect(page).toHaveURL(/.*dashboard/);
  await expect(page.locator('[data-testid="user-menu"]')).toBeVisible();
});`;
      setGeneratedCode(mockCode)
    } catch (error) {
      console.error('Generation failed:', error)
      alert('failed to generate code. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleRun = async () => {
    if (!generatedCode) return;

    setIsExecuting(true);

    try {
      //replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      alert('Test Executed SUCCEFULLY !!!')
    } catch (error) {
      console.error('Execution failed', error);
      alert('Test execution || failed ||')
    } finally {
      setIsExecuting(false)
    }

  };
  const handleClear = () => {
    if (generatedCode && !confirm('Clear both input and generated code?')) {
      return;
    }
    setNlpInput('');
    setGeneratedCode('');
  }
  return (
    <div className='max w-7x, mx-auto soace y-8'>
      <div className='text-center space-y-4'>
        <h1 className="text-4xl md:text-4xl font-bold text-blue-600 dark-text-blue-100">Text Automation with <span className="bg-gradient-to-r from-blue-600 bg-clip-text text transparent">{' '}Natural Language</span>
        </h1>
        <p className="text-xl text-gray-600 dark:text -gray-400 max-w-2xl mx-auto">Describe your test scenarios in plain English, and we'll generate production-ready Playwright code instantly.</p>
      </div>
      {/* Main Content */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Left Panel: NLP Input */}
        <Card variant="default" >
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  Natural Language Input
                </h2>
              </div>
              <Button variant="ghost" size="sm" onClick={handleClear} disabled={!nlpInput && !generatedCode}>
                Clear
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <NLPInput value={nlpInput} onChange={setNlpInput} onGenerate={handleGenerate} isGenerating={isGenerating} />
          </CardContent>
        </Card>
        {/* Right panel: Code Preview */}
        <Card variant="default">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Code2 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100" >Generated Playwright Code</h2>
              </div>
              {generatedCode && (
                <Button variant="primary" size="sm" onClick={handleRun} isLoading={isExecuting} disabled={isExecuting} >
                  <Play className="w-4 h-4 mr-2" />
                  {isExecuting ? 'Running...' : 'Run test'}
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {/* <CodePreview code={generatedCode} isGenerating={isGenerating} /> */}
            <CodePreviewMonaco  code={generatedCode} isGenerating={isGenerating} language='typescipt' />
          </CardContent>
        </Card>
      </div>
      {/* Feature Cards */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card variant="default">
          <CardContent className="pt-6">
            <div className="text-center space-y-3" >
              <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg mb-2" >
                <Zap className="w-6 h-6 text-b;ue-600 dark:text-blue-400" />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-gray-100" >AI-Powered Generation</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400" >
                Advanced langauge models understand your test intentions and generate precise, executable code
              </p>
            </div>
          </CardContent>
        </Card>
        <Card variant="default">
          <CardContent className="pt-6">
            <div className="text-center space-y-3">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg mb-2">
                <Shield className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                Production Ready
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Generated code follows best practices with proper waits, error handling, and assertions
              </p>
            </div>
          </CardContent>
        </Card>
        <Card variant="default">
          <CardContent className="pt-6">
            <div className="test-center space-y-3">
              <div className="inline=flex items-center justify-center w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg mb-2">
                <Rocket className="w-6 h-6 text-purple-600 dark:text-purple-100" />
              </div>
              <h3 className="font-semibold text-gray-800 dark:text-gray-100" > Instant Execution</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400"> Run tests immediately with VPN de SALE, ScreenShots</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>

  );
}   