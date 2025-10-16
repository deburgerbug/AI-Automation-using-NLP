import { useState } from 'react';
import { Copy, Check, Download } from 'lucide-react';
import { Button } from  '../../components/ui/Button';
import { cn } from '../../utils/cn';


interface CodePreviewProps {
  code: string;
  isGenerating: boolean;
}

export function CodePreview({ code, isGenerating }: CodePreviewProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!code) return;
    
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const handleDownload = () => {
    if (!code) return;
    
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'test.spec.ts';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Loading skeleton
  if (isGenerating) {
    return (
      <div className="space-y-3">
        <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
          <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <span>Generating Playwright code...</span>
        </div>
        
        <div className="space-y-2">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="h-4 bg-gray-200 dark:bg-gray-800 rounded animate-pulse"
              style={{ width: `${60 + Math.random() * 40}%` }}
            />
          ))}
        </div>
      </div>
    );
  }

  // Empty state
  if (!code) {
    return (
      <div className="flex flex-col items-center justify-center h-80 text-center">
        <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
          <svg
            className="w-8 h-8 text-gray-400 dark:text-gray-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
            />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
          No code generated yet
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 max-w-xs">
          Describe your test in the input field and click "Generate Code" to see the Playwright code here.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Actions */}
      <div className="flex items-center justify-between">
        <span className="text-xs text-gray-500 dark:text-gray-400">
          test.spec.ts
        </span>
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCopy}
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 mr-2 text-green-600" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 mr-2" />
                Copy
              </>
            )}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDownload}
          >
            <Download className="w-4 h-4 mr-2" />
            Download
          </Button>
        </div>
      </div>

      {/* Code Display */}
      <div className="relative">
        <pre className={cn(
          "p-4 rounded-lg overflow-x-auto",
          "bg-gray-900 dark:bg-gray-950",
          "border border-gray-800",
          "text-sm leading-relaxed"
        )}>
          <code className="text-gray-100">
            {code}
          </code>
        </pre>
      </div>

      {/* Stats */}
      <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
        <span>{code.split('\n').length} lines</span>
        <span>{code.length} characters</span>
      </div>
    </div>
  );
}