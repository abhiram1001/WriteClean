import React from 'react';
import { ImprovementData } from '../types';

interface ComparisonPanelProps {
  data: ImprovementData;
}

const ComparisonPanel: React.FC<ComparisonPanelProps> = ({ data }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
      <h3 className="font-semibold text-slate-800 text-lg mb-4 flex items-center gap-2">
        <span className="text-indigo-600">✨</span> AI Improvement Suggestion
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Original */}
        <div className="flex flex-col">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Original Text</span>
          <div className="flex-1 p-4 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 text-sm leading-relaxed whitespace-pre-wrap">
            {data.original}
          </div>
        </div>

        {/* Improved */}
        <div className="flex flex-col">
          <span className="text-xs font-semibold text-emerald-600 uppercase tracking-wide mb-2">Cleaned Version</span>
          <div className="flex-1 p-4 bg-emerald-50/50 border border-emerald-200 rounded-lg text-slate-800 text-sm leading-relaxed whitespace-pre-wrap font-medium">
            {data.improved}
          </div>
        </div>
      </div>

      {data.changes.length > 0 && (
        <div className="mt-6">
          <h4 className="text-sm font-semibold text-slate-700 mb-2">Key Improvements Made:</h4>
          <div className="flex flex-wrap gap-2">
            {data.changes.map((change, idx) => (
              <span key={idx} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                ✓ {change}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ComparisonPanel;
