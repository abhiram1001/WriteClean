import React, { useState, useRef } from 'react';
import { analyzeText } from './services/geminiService';
import { AnalysisResult, ViewMode } from './types';
import TokenTable from './components/TokenTable';
import SentimentCard from './components/SentimentCard';
import ComparisonPanel from './components/ComparisonPanel';
import { Loader2, FileText, Upload, Download, Sparkles, AlertCircle } from 'lucide-react';

const App: React.FC = () => {
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>(ViewMode.INPUT);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAnalysis = async () => {
    if (!inputText.trim()) return;
    
    setLoading(true);
    setError(null);
    try {
      const data = await analyzeText(inputText);
      setResult(data);
      setViewMode(ViewMode.ANALYSIS);
    } catch (err: any) {
      setError(err.message || "Something went wrong during analysis.");
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result;
        if (typeof text === 'string') {
          setInputText(text);
        }
      };
      reader.readAsText(file);
    }
  };

  const exportData = (format: 'json' | 'csv') => {
    if (!result) return;
    
    let content = '';
    let mimeType = '';
    const filename = `writeclean_analysis.${format}`;

    if (format === 'json') {
      content = JSON.stringify(result, null, 2);
      mimeType = 'application/json';
    } else {
      // CSV Export logic for tokens
      const headers = ['Word', 'POS', 'Stopword', 'Porter', 'Snowball', 'WordNet', 'SpaCy'];
      const rows = result.tokens.map(t => [
        t.word, t.posTag, t.isStopWord, t.stemPorter, t.stemSnowball, t.lemmaWordNet, t.lemmaSpacy
      ].map(field => `"${field}"`).join(','));
      content = [headers.join(','), ...rows].join('\n');
      mimeType = 'text/csv';
    }

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20">
      {/* Navbar */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center cursor-pointer" onClick={() => setViewMode(ViewMode.INPUT)}>
              <Sparkles className="h-6 w-6 text-indigo-600 mr-2" />
              <span className="font-bold text-xl tracking-tight text-slate-800">WriteClean</span>
            </div>
            {viewMode === ViewMode.ANALYSIS && (
              <div className="flex items-center space-x-2">
                 <button 
                  onClick={() => setViewMode(ViewMode.INPUT)}
                  className="text-sm font-medium text-slate-500 hover:text-slate-800 px-3 py-2"
                >
                  New Analysis
                </button>
                <div className="h-6 w-px bg-slate-200 mx-2"></div>
                <div className="relative group">
                    <button className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                      <Download className="w-4 h-4" /> Export
                    </button>
                    <div className="absolute right-0 mt-2 w-32 bg-white rounded-md shadow-lg border border-slate-100 hidden group-hover:block p-1">
                        <button onClick={() => exportData('json')} className="block w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 rounded-sm">JSON</button>
                        <button onClick={() => exportData('csv')} className="block w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 rounded-sm">CSV</button>
                    </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        
        {/* Error Banner */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3 text-red-700">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <p className="text-sm">{error}</p>
          </div>
        )}

        {viewMode === ViewMode.INPUT ? (
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-10">
              <h1 className="text-4xl font-extrabold text-slate-900 mb-4">
                Refine Your Writing with AI
              </h1>
              <p className="text-lg text-slate-600">
                Normalize text, analyze sentiment with slang detection, and get instant improvements for blogs, assignments, and research.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <div className="mb-4 flex justify-between items-center">
                <label className="block text-sm font-medium text-slate-700">
                  Input Text
                </label>
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="text-sm text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-1"
                >
                  <Upload className="w-4 h-4" /> Upload .txt
                </button>
                <input 
                  type="file" 
                  accept=".txt" 
                  ref={fileInputRef} 
                  onChange={handleFileUpload} 
                  className="hidden" 
                />
              </div>
              
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Paste your text here... (e.g., 'The quick brown fox jumps over the lazy dog', or 'That movie was totally mid, no cap.')"
                className="w-full h-64 p-4 rounded-xl border border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 resize-none transition-all outline-none text-slate-800 placeholder-slate-400"
              />

              <div className="mt-6 flex justify-end">
                <button
                  onClick={handleAnalysis}
                  disabled={loading || !inputText.trim()}
                  className={`
                    flex items-center gap-2 px-8 py-3 rounded-xl font-semibold text-white shadow-lg shadow-indigo-200 transition-all transform hover:-translate-y-0.5
                    ${loading || !inputText.trim() 
                      ? 'bg-slate-300 cursor-not-allowed shadow-none' 
                      : 'bg-indigo-600 hover:bg-indigo-700 hover:shadow-indigo-300'}
                  `}
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" /> Analyzing...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5" /> Analyze Text
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
               <div className="p-4 bg-white rounded-lg border border-slate-100 shadow-sm">
                  <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center mb-3">
                    <FileText className="w-5 h-5 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-slate-800">NLP Pipeline</h3>
                  <p className="text-sm text-slate-500 mt-1">Tokenization, POS tagging, Stemming (Porter/Snowball) & Lemmatization.</p>
               </div>
               <div className="p-4 bg-white rounded-lg border border-slate-100 shadow-sm">
                  <div className="w-10 h-10 bg-purple-50 rounded-full flex items-center justify-center mb-3">
                    <Sparkles className="w-5 h-5 text-purple-600" />
                  </div>
                  <h3 className="font-semibold text-slate-800">Gen Z Sentiment</h3>
                  <p className="text-sm text-slate-500 mt-1">Understands "slang", emojis, and toxic tones with a 5-point polarity scale.</p>
               </div>
               <div className="p-4 bg-white rounded-lg border border-slate-100 shadow-sm">
                  <div className="w-10 h-10 bg-emerald-50 rounded-full flex items-center justify-center mb-3">
                    <Download className="w-5 h-5 text-emerald-600" />
                  </div>
                  <h3 className="font-semibold text-slate-800">Export Ready</h3>
                  <p className="text-sm text-slate-500 mt-1">Download analysis results in JSON or CSV for your research papers.</p>
               </div>
            </div>
          </div>
        ) : (
          /* Analysis Results View */
          <div className="animate-fade-in space-y-6">
            {result && (
              <>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                   <SentimentCard sentiment={result.sentiment} />
                   <ComparisonPanel data={result.improvement} />
                </div>
                
                <TokenTable tokens={result.tokens} />
              </>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
