import { useState, useRef } from 'react';
import { Copy, Download, Check, Maximize2, Minimize2, } from 'lucide-react';
import Editor from '@monaco-editor/react';
import { Button } from '../../components/ui/Button';
import { cn } from '../../utils/cn';

interface CodePreviewMonacoProps {
    code: string,
    isGenerating: boolean,
    language: string;
}

export function CodePreviewMonaco({ code, isGenerating, language = 'typescript' }: CodePreviewMonacoProps) {
    const [copied, setCopied] = useState(false);
    const [isFullScreen, setIsFullScreen] = useState(false);
    const editorRef = useRef<unknown>(null)

    const handleCopy = async () => {
        if (!code) return;

        try {
            await navigator.clipboard.writeText(code)
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (error) {
            console.error("Failed to copy:", error)
        }

    }
    const handleDownload = () => {
        if (!code) return;

        const blob = new Blob([code], { type: 'type/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `test-${Date.now()}.spec.ts`;
        document.body.appendChild(link);
        link.click()
        document.body.removeChild(link)
        URL.revokeObjectURL(url);
    };

    const handleEditorDidMount = (editor: unknown) => {
        editorRef.current = editor;
    }

    const toggleFullScreen = () => {
        setIsFullScreen(!isFullScreen)
    }

    //Loading skeleton

    if (isGenerating) {
        return (
            <div className="space-y-4" >
                <div className="flex items-center space-x-2 text-sm text-blue-600 dark: text-blue-400" >
                    <div className="w-4 h-4 border-2 border-blue-600  dark:border-blue-400 hardet-t-transparent rounded-full animate-spin" />
                    <span className="font-medium" > Generating Playwright code</span>
                </div>
                <div className="space-y-2" >
                    {[...Array(10)].map((_, i) => (
                        <div key={i} className="h-4 ng-gray-200 dark:bg-gray-800 rounded animate-pulse" style={{
                            width: `${Math.random() * 30 + 60}%`,
                            animationDelay: `${i * 0.05}s`
                        }} />
                    ))}
                </div>

                <div className="test-xs text-gray-500 dark:text-gray-400" >
                    How was your day ?
                </div>
            </div>
        );
    }

    //Empty State

    if (!code) {
        return (
            <div className="flex flex-col items-center justify-center py-16 text-center" >
                <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 rounded-2xl flex items-center justify-center mb-6 " >
                    <svg className="w-10 h-10 text-gray-400 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                        d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                    </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2" >
                    No code generated yet
                </h3>
                <p className="text-sm text-gray-500 text-gray-400 max-w-sm mb-6" >
                    Describe your test scenario in the input field and click "Generate Code" to see the Playwright test code here.
                </p>
                <div className="flex flex-col gap-2 text-xs text-gray-500 dark:text-gray-400 ">
                    <div className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-green-400 rounded-full "></span>
                        <span>Production ready code</span>
                    </div>
                    <div className="flex items-center gap-2" >
                        <span className="w-2 h-2 bg-purple-500 rounded-full " ></span>
                        <span>Best practices included</span>
                    </div>
                </div>
            </div>
        );
    }

    const lineCount = code.split('\n').length;
    const charCount = code.length;

    return (
        <div className={cn(
            "space-y-3",
            isFullScreen && "fixed inset-0 z-60 bg-white dark:bg-gray-900 p-6 flex dlex-col"
        )} >
            {/* Header actions */}
            <div className="flex items-center justify-between" >
                <div className="flex items-center gap-2" >
                    <span className="text-xs font-mono text-gray-500 dark:text-gray-400 bg-gra-100 dark:bg-gray-800 px-2 py-1 rounded " > text.spec.ts </span>
                    <span className="text-xs text-gray-400 dark:text-gray-600" > Typescript </span>
                </div>
                <div className="flex items-center gap-2" >
                    <Button variant="ghost" size='sm' onClick={toggleFullScreen} className="text-xs" >
                        {isFullScreen ? (
                            <>
                                <Minimize2 className="w-4 h-4 mr-1.5" />
                                Exit Fullscreen
                            </>
                        ) : (
                            <>
                                <Maximize2 className="w-4 h-4 mar-1-5" />
                                Fullscreen
                            </>
                        )}
                    </Button>
                    <Button variant='ghost' size='sm' onClick={handleCopy} className="text-xs" >
                        {copied ? (
                            <>
                                <Check className="w-4 h-4 mr-1.5 text-green-600 dark:text-green-400" />
                                Copied!
                            </>
                        ) : (
                            <>
                                <Copy className="w-4 h-4 mr-1.5" />
                                Copy
                            </>
                        )}
                    </Button>
                    <Button variant='ghost' size='sm' onClick={handleDownload} className="text-xs" >
                        <Download className='w-4 h-4 mr-1.5' />
                        Download
                    </Button>
                </div>
            </div>
            {/* Monaco Editor */}

            <div className={cn("border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden", isFullScreen ? "flex-1" : "h-[500px]")} >
                <Editor
                    height={isFullScreen ? "100%" : "500px"}
                    defaultLanguage={language}
                    value={code}
                    theme="vs-dark"
                    onMount={handleEditorDidMount}
                    options={{
                        readOnly: true,
                        minimap: { enabled: isFullScreen },
                        fontSize: 14,
                        lineNumbers: 'on',
                        scrollBeyondLastLine: false,
                        automaticLayout: true,
                        tabSize: 2,
                        wordWrap: 'on',
                        padding: { top: 16, bottom: 16 },
                        scrollbar: {
                            vertical: 'visible',
                            horizontal: 'visible',
                            verticalScrollbarSize: 10,
                            horizontalScrollbarSize: 10
                        },
                    }}
                />
            </div>
            {/* Footer status */}
            {!isFullScreen && (
                <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-4 text-gray-500 dark:text-gray-400">
                        <span className="flex items-center gap-1">
                            <span className="font-semibold">{lineCount}</span> lines
                        </span>
                        <span className="flex items-center gap-1">
                            <span className="font-semibold">{charCount.toLocaleString()}</span> characters
                        </span>
                        <span className="flex items-center gap-1">
                            <span className="font-semibold">{(charCount / 1024).toFixed(1)}</span> KB
                        </span>
                    </div>
                    <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                        <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                        <span>Ready to execute</span>
                    </div>
                </div>
            )}
        </div>
    )
};

