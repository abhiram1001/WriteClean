import React from 'react';
import { SentimentData } from '../types';
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';

interface SentimentCardProps {
  sentiment: SentimentData;
}

const SentimentCard: React.FC<SentimentCardProps> = ({ sentiment }) => {
  const getScoreColor = (label: string) => {
    switch (label) {
      case 'Very Good': return '#10b981'; // emerald-500
      case 'Good': return '#34d399'; // emerald-400
      case 'Neutral': return '#94a3b8'; // slate-400
      case 'Bad': return '#f87171'; // red-400
      case 'Very Bad': return '#ef4444'; // red-500
      default: return '#94a3b8';
    }
  };

  const scorePercentage = ((sentiment.score + 1) / 2) * 100; // Normalize -1..1 to 0..100
  const color = getScoreColor(sentiment.label);

  const data = [
    { name: 'Score', value: scorePercentage, color: color },
    { name: 'Remaining', value: 100 - scorePercentage, color: '#e2e8f0' },
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-slate-800 text-lg">Sentiment Analysis</h3>
        <span 
          className="px-3 py-1 rounded-full text-sm font-bold text-white"
          style={{ backgroundColor: color }}
        >
          {sentiment.label}
        </span>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Gauge Chart */}
        <div className="w-full md:w-1/3 h-40 relative flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  startAngle={180}
                  endAngle={0}
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={0}
                  dataKey="value"
                  stroke="none"
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute top-[60%] left-0 right-0 text-center">
               <span className="text-2xl font-bold text-slate-700">{sentiment.score.toFixed(2)}</span>
               <p className="text-xs text-slate-400">Polarity</p>
            </div>
        </div>

        {/* Details */}
        <div className="w-full md:w-2/3 flex flex-col gap-4">
          <p className="text-slate-600 italic">"{sentiment.explanation}"</p>
          
          {sentiment.slangDetected.length > 0 && (
            <div>
              <h4 className="text-xs font-semibold uppercase text-slate-400 tracking-wider mb-2">Gen Z Slang Detected</h4>
              <div className="flex flex-wrap gap-2">
                {sentiment.slangDetected.map((slang, i) => (
                  <span key={i} className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-md font-medium border border-purple-200">
                    {slang}
                  </span>
                ))}
              </div>
            </div>
          )}

           {sentiment.emojiSentiment.length > 0 && (
            <div>
              <h4 className="text-xs font-semibold uppercase text-slate-400 tracking-wider mb-2">Emoji Context</h4>
              <div className="flex flex-wrap gap-2">
                 {sentiment.emojiSentiment.map((emoji, i) => (
                  <span key={i} className="px-2 py-1 bg-yellow-50 text-yellow-700 text-xs rounded-md font-medium border border-yellow-200">
                    {emoji}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      
      {sentiment.emotionalSentences.length > 0 && (
        <div className="mt-6 p-4 bg-red-50 rounded-lg border border-red-100">
          <h4 className="text-sm font-semibold text-red-800 mb-2">Emotionally Charged Sentences</h4>
          <ul className="list-disc list-inside text-sm text-red-700 space-y-1">
            {sentiment.emotionalSentences.map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SentimentCard;
