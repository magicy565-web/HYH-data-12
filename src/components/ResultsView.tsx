
import React, { useState } from 'react';
import { ResearchResult, FormData, Language } from '../types';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell, Legend } from 'recharts';
import { TrendingUp, AlertCircle, Target, Shield, ArrowUpRight, ExternalLink } from 'lucide-react';
import { translations } from '../translations';
import { AddToReportButton } from './AddToReportButton';

interface Props {
  result: ResearchResult;
  formData: FormData;
  language: Language;
}

const COLORS = ['#3b82f6', '#6366f1', '#8b5cf6', '#ec4899', '#f43f5e'];

export const ResultsView: React.FC<Props> = ({ result, formData, language }) => {
  const t = translations[language].results;
  const marketName = translations[language].online.markets[formData.market] || formData.market;
  const [hoveredBarIndex, setHoveredBarIndex] = useState<number | null>(null);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Summary */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 relative">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-slate-900">{t.title}</h2>
          <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium border border-blue-200">{marketName}</span>
        </div>
        <p className="text-slate-700 leading-relaxed">{result.marketSummary}</p>
        <div className="absolute top-6 right-6 hidden md:block">
             <AddToReportButton type="text" title="Market Summary" data={result.marketSummary} language={language} />
        </div>
      </div>

      {/* Competitors (No button here as it's a list) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center"><Target className="w-5 h-5 mr-2 text-blue-600" />{t.competitors}</h3>
          <div className="space-y-4">
            {result.competitors.map((comp, idx) => (
              <div key={idx} className="p-4 border border-slate-100 rounded-lg hover:bg-slate-50 transition-colors">
                <div className="flex justify-between items-start">
                  <div><h4 className="font-medium text-slate-900">{comp.name}</h4><p className="text-sm text-slate-500 mt-1 line-clamp-2">{comp.features}</p></div>
                  {comp.price && <span className="font-semibold text-green-600 whitespace-nowrap ml-2">{comp.price}</span>}
                </div>
                {comp.website && <a href={comp.website} target="_blank" rel="noopener noreferrer" className="mt-2 inline-flex items-center text-xs text-blue-600 hover:underline">{t.visit} <ExternalLink className="w-3 h-3 ml-1" /></a>}
              </div>
            ))}
          </div>
        </div>

        {/* SWOT */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 relative">
          <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-slate-900 flex items-center"><Shield className="w-5 h-5 mr-2 text-indigo-600" />{t.swot}</h3>
              <AddToReportButton type="swot" title="SWOT Analysis" data={result.swot} language={language} />
          </div>
          <div className="grid grid-cols-2 gap-4 h-full">
             <div className="p-4 bg-green-50 rounded-lg border border-green-100"><h4 className="font-semibold text-green-800 mb-2 text-sm">{t.strengths}</h4><ul className="list-disc list-inside text-xs text-green-900 space-y-1">{result.swot.strengths.map((s, i) => <li key={i}>{s}</li>)}</ul></div>
             <div className="p-4 bg-red-50 rounded-lg border border-red-100"><h4 className="font-semibold text-red-800 mb-2 text-sm">{t.weaknesses}</h4><ul className="list-disc list-inside text-xs text-red-900 space-y-1">{result.swot.weaknesses.map((s, i) => <li key={i}>{s}</li>)}</ul></div>
             <div className="p-4 bg-blue-50 rounded-lg border border-blue-100"><h4 className="font-semibold text-blue-800 mb-2 text-sm">{t.opportunities}</h4><ul className="list-disc list-inside text-xs text-blue-900 space-y-1">{result.swot.opportunities.map((s, i) => <li key={i}>{s}</li>)}</ul></div>
             <div className="p-4 bg-amber-50 rounded-lg border border-amber-100"><h4 className="font-semibold text-amber-800 mb-2 text-sm">{t.threats}</h4><ul className="list-disc list-inside text-xs text-amber-900 space-y-1">{result.swot.threats.map((s, i) => <li key={i}>{s}</li>)}</ul></div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Trend */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 relative">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-semibold text-slate-900 flex items-center"><TrendingUp className="w-5 h-5 mr-2 text-emerald-600" />{t.trendTitle}</h3>
            <AddToReportButton type="chart-line" title="Market Trend 5-Year" data={result.chartData.trends} language={language} />
          </div>
          <p className="text-sm text-slate-500 mb-6 h-10 line-clamp-2">{result.fiveYearTrendAnalysis}</p>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={result.chartData.trends}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="year" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} label={{ value: 'Market Index', angle: -90, position: 'insideLeft', fill: '#94a3b8' }} />
                <Tooltip contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0' }} />
                <Line type="monotone" dataKey="marketSize" stroke="#2563eb" strokeWidth={3} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Share */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 relative">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-semibold text-slate-900 flex items-center"><AlertCircle className="w-5 h-5 mr-2 text-purple-600" />{t.shareTitle}</h3>
            <AddToReportButton type="chart-bar" title="Competitor Market Share" data={result.chartData.shares} language={language} />
          </div>
           <p className="text-sm text-slate-500 mb-6 h-10">{t.shareSubtitle}</p>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={result.chartData.shares} layout="vertical" margin={{ left: 40 }} onMouseLeave={() => setHoveredBarIndex(null)}>
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#e2e8f0" />
                <XAxis type="number" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} unit="%" />
                <YAxis dataKey="name" type="category" stroke="#64748b" fontSize={10} width={100} tickLine={false} axisLine={false} />
                <Tooltip cursor={{fill: 'transparent'}} contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0' }} />
                <Bar dataKey="share" radius={[0, 4, 4, 0]} barSize={20} onMouseEnter={(_, index) => setHoveredBarIndex(index)}>
                  {result.chartData.shares.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} fillOpacity={hoveredBarIndex === null || hoveredBarIndex === index ? 1 : 0.3} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
