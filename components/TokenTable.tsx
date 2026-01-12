import React, { useState } from 'react';
import { TokenData } from '../types';

interface TokenTableProps {
  tokens: TokenData[];
}

const TokenTable: React.FC<TokenTableProps> = ({ tokens }) => {
  const [filter, setFilter] = useState<'all' | 'keywords' | 'stopwords'>('all');

  const filteredTokens = tokens.filter(t => {
    if (filter === 'keywords') return !t.isStopWord;
    if (filter === 'stopwords') return t.isStopWord;
    return true;
  });

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
        <h3 className="font-semibold text-slate-800">Tokenization & Normalization</h3>
        <div className="flex gap-2 text-sm">
          <button 
            onClick={() => setFilter('all')}
            className={`px-3 py-1 rounded-full transition-colors ${filter === 'all' ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-600 hover:bg-slate-300'}`}
          >
            All
          </button>
          <button 
            onClick={() => setFilter('keywords')}
            className={`px-3 py-1 rounded-full transition-colors ${filter === 'keywords' ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-600 hover:bg-slate-300'}`}
          >
            Keywords
          </button>
          <button 
            onClick={() => setFilter('stopwords')}
            className={`px-3 py-1 rounded-full transition-colors ${filter === 'stopwords' ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-600 hover:bg-slate-300'}`}
          >
            Stop Words
          </button>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200">
            <tr>
              <th className="px-4 py-3">Token</th>
              <th className="px-4 py-3">POS Tag</th>
              <th className="px-4 py-3">Is Stopword?</th>
              <th className="px-4 py-3 bg-indigo-50/50 text-indigo-900 border-l border-indigo-100">Porter Stem</th>
              <th className="px-4 py-3 bg-indigo-50/50 text-indigo-900">Snowball Stem</th>
              <th className="px-4 py-3 bg-emerald-50/50 text-emerald-900 border-l border-emerald-100">WordNet Lemma</th>
              <th className="px-4 py-3 bg-emerald-50/50 text-emerald-900">spaCy Lemma</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredTokens.map((token, idx) => (
              <tr key={idx} className="hover:bg-slate-50 transition-colors">
                <td className="px-4 py-3 font-medium text-slate-900">{token.word}</td>
                <td className="px-4 py-3">
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-800 border border-slate-300">
                    {token.posTag}
                  </span>
                </td>
                <td className="px-4 py-3 text-slate-500">
                  {token.isStopWord ? (
                    <span className="text-amber-600 font-medium text-xs">Yes</span>
                  ) : (
                    <span className="text-slate-400 text-xs">No</span>
                  )}
                </td>
                <td className="px-4 py-3 bg-indigo-50/30 font-mono text-indigo-700">{token.stemPorter}</td>
                <td className="px-4 py-3 bg-indigo-50/30 font-mono text-indigo-700">{token.stemSnowball}</td>
                <td className="px-4 py-3 bg-emerald-50/30 font-mono text-emerald-700">{token.lemmaWordNet}</td>
                <td className="px-4 py-3 bg-emerald-50/30 font-mono text-emerald-700">{token.lemmaSpacy}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TokenTable;
