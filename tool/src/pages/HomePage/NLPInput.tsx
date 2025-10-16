import { useState, useRef, useEffect} from 'react'; //KeyboardEvent
import { Sparkles, FileText, X, Info } from 'lucide-react';
import { Button } from '../../components/ui/Button'
import { cn } from '../../utils/cn';

interface NLPInputProps {
    value: string;
    onChange: (value: string) => void;
    onGenerate: () => void;
    isGenerating: boolean;
}

const MAX_CHARS = 5000;

const EXAMPLE_TEMPLATES = [
    {
        name: 'login test',
        description: 'Basic login flow',
        icon: '🔐',
        content: `go to https://udemy.com/login'
Click the login Button
Type "luffy@gmail.com" in email field
Type "PirateKing28" in password field
Click the submit button
Verify the page shows "Welcome back"`
    }, {
        name: 'Form Submission',
        description: 'fill and submit the contact form',
        icon: '📝',
        content: `Navigate to the https://udemy.com/contact
Fill "John Banega Don" in the name field
Fill "john@furfuri.com" in the email field
Type "Hello, Inspector Chingum is here with test message" in the message textarea
Click the submit button
Verify Success message "Thank you" appears`,
    }, {
        name: 'E-commerce Flow',
        description: 'Add product to cart and checkout',
        icon: '🛒',
        content: `Go to https://amazon.com/products
Click on the first product card
Click the "Add to cart" button
Click the cart icon in the header 
Verify cart contain 1 item
Click "Proceed to Checkout"
Verify checkout page loads`,
    }, {
        name: 'Search and Filter',
        description: 'Search and filter results',
        icon: '🔍',
        content: `Go to https://amazon.com/filter
Click on the search icon button
Type PS5 in the search box
Wait for results to load
Click the "Price: Low to High" filter
Verify results are sorted correctly`,
    }
];

export function NLPInput({ value, onChange, onGenerate, isGenerating }: NLPInputProps) {
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const [charCount, setCharCount] = useState(0);
    const [showTemplates, setShowTemplates] = useState(false);

    useEffect(() => {
        setCharCount(value.length)
    }, [value]);

    //Auto-resize text-area as user types
    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
        }
    }, [value])

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const newValue = e.target.value;
        if (newValue.length <= MAX_CHARS) {
            onChange(newValue);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
            e.preventDefault();
            if (value.trim() && !isGenerating) {
                onGenerate();
            }
        }
    };

    const handleTemplateSelect = (template: typeof EXAMPLE_TEMPLATES[0]) => {
        onChange(template.content)
        setShowTemplates(false);
        textareaRef.current?.focus();
    };

    const isNearLimit = charCount > MAX_CHARS * 0.9;
    const atLimit = charCount >= MAX_CHARS;

    return (
        <div className="space-y-4" >
            {/* Textarea */}
            <div className="relative" >
                <textarea ref={textareaRef} value={value} onChange={handleChange} onKeyDown={handleKeyDown} placeholder='Describe your test in plain English'
                    className={cn(
                        "w-full px-4 py-3 rounded-lg border resize-none transition-all",
                        "bg-white dark:bg-gray-900",
                        "text-gray-900 dark:text-gray-100",
                        "placeholder:text-gray-400 dark:placeholder:text-gray-500",
                        "focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-950",
                        "font-mono text-sm  leading-relaxed",

                        //Border colors
                        atLimit
                            ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                            : "border-gray-300 dark:border-gray-700 focus-border-blue-500 focus:ring-blue-500",

                        //disabled state
                        isGenerating && "opacity-50 cursor-not-allowed")}
                    rows={12}
                    disabled={isGenerating}
                    spellCheck={false} />

                {/* character counter */}
                <div className="absolute bottom-3 right-3">
                    <span className={cn("text-xs font-medium px-2 py-1 rounded",
                        atLimit
                            ? "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400"
                            : isNearLimit
                                ? "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400"
                                : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400"
                    )} >
                        {charCount.toLocaleString()} / {MAX_CHARS.toLocaleString()}
                    </span>
                </div>
            </div>
            {/* Quick Actions Bar */}
            <div className="flex items-center justify-between gap-4" >
                {/* left side templates */}
                <div className="relative flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={() => setShowTemplates(!showTemplates)} disabled={isGenerating}>
                        <FileText className="w-4 h-4 mr-2" />
                        Templates
                    </Button>

                    {/* Templates Dropdown */}
                    {showTemplates && (
                        <>
                            {/* Backdrop */}
                            <div className="fixed inset-0 z-10" onClick={() => setShowTemplates(false)} />
                            {/* Dropdown Menu */}
                            <div className="absolute left-zero top-full mt-2 w-96 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg shadow-xl z-20 overflow-hidden">
                                <div className="p-3 border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100"> Quick start Templates</h3>
                                        <button onClick={() => setShowTemplates(false)} className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors">
                                            <X className="w-4 h-4 text-gray-500" />
                                        </button>
                                    </div>
                                </div>
                                <div className="max-h-96 overflow0y-auto">
                                    {EXAMPLE_TEMPLATES.map((template, index) => (
                                        <button key={index} onClick={() => handleTemplateSelect(template)} className={cn(
                                            "w-full px-4 py-3 text-left transition-colors",
                                            "hover:bg-gray-50 dark:hover:bg-gray-800",
                                            "border-b border-gray-100 dark:border-gray-800 last:border-0",
                                            "focus:outline-none focus:bg-gray-50 dark:focus:bg-gray-800"
                                        )}>
                                            <div className="flex items-start space-x-3">
                                                <span className="text-2xl">{template.icon}</span>
                                                <div className="flex-1 min-w-0">
                                                    <div className="font-medium text-sm text-gray-900 dark:text-gray-100">
                                                        {template.name}
                                                    </div>
                                                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                                        {template.description}
                                                    </div>
                                                </div>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </>
                    )}
                    {/* Keyboard Shortcut Hint */}
                    <span className="text-xs text-gray-400 dark:text-gray-600 hidden md:flex items-center gap-1">
                        <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded text-xs font-mono">
                            {navigator.platform.includes('Mac') ? '⌘' : 'Ctrl'}
                        </kbd>
                        <span>+</span>
                        <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded text-xs font-mono">
                            ↵
                        </kbd>
                        <span className="ml-1">to generate</span>
                    </span>
                </div>
                {/* Right Side: Generate Button */}
                <Button
                    variant="primary"
                    onClick={onGenerate}
                    isLoading={isGenerating}
                    disabled={!value.trim() || isGenerating}
                    size="md"
                >
                    <Sparkles className="w-4 h-4 mr-2" />
                    {isGenerating ? 'Generating...' : 'Generate Code'}
                </Button>
            </div>
            {/* Help Section */}
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                    <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                        <h4 className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-2">
                        💡 Tips for better test generation
                        </h4>
                        <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1.5">
                            <li className="flex items-start">
                                <span className="mr-2">•</span>
                                <span>Use clear, action-oriented language (e.g., "Click", "Type", "Verify")</span>
                            </li>
                            <li className="flex items-start">
                                <span className="mr-2">•</span>
                                <span>Specify exact element text or placeholders in quotes</span>
                            </li>
                            <li className="flex items-start">
                                <span className="mr-2">•</span>
                                <span>Include verification steps to check test results</span>
                            </li>
                            <li className="flex items-start">
                                <span className="mr-2">•</span>
                                <span>One action per line works best for clarity</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );

}
