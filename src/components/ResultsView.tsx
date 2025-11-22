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

  // 1. Safety check: If result is null/undefined, don't render (prevents crash)
  if (!result) return null;

  // 2. Safe access to arrays with default empty arrays to prevent map errors
  // Using these variables in JSX is safer than accessing result.competitors directly
  const competitors = result.competitors || [];
  const trendsData = result.chartData?.trends || [];
  const sharesData = result.chartData?.shares || [];
  
  // 3. Deep safe access for SWOT
  const swot = {
    strengths: result.swot?.strengths || [],
    weaknesses: result.swot?.weaknesses || [],
    opportunities: result.swot?.opportunities || [],
    threats: result.swot?.threats || []
  };

  // Format competitor data safely for report
  const competitorReportData = competitors.map((c, i) => 
    `${i+1}. ${c.name || 'Unknown'}\n   Features: ${c.features || '-'}\n   Price: ${c.price || 'N/A'}`
  ).join('\n\n');

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Header Summary */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 relative group">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-slate-900">{t.title}</h2>
          <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium border border-blue-200">
            {marketName}
          </span>
        </div>
        <p className="text-slate-700 leading-relaxed">{result.marketSummary || "No summary available."}</p>
        
        <div className="absolute top-6 right-6">
             <AddToReportButton 
                type="text" 
                title="Market Summary" 
                data={result.marketSummary || ""} 
                language={language} 
            />
        </div>
      </div>

      {/* Top Competitors */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 relative">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-slate-900 flex items-center">
                <Target className="w-5 h-5 mr-2 text-blue-600" />
                {t.competitors}
            </h3>
            <AddToReportButton 
                type="text" 
                title="Top Competitors" 
                data={competitorReportData} 
                language={language} 
            />
          </div>
          <div className="space-y-4">
            {competitors.length > 0 ? competitors.map((comp, idx) => (
              <div key={idx} className="p-4 border border-slate-100 rounded-lg hover:bg-slate-50 transition-colors">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium text-slate-900">{comp.name || "Unknown"}</h4>
                    <p className="text-sm text-slate-500 mt-1 line-clamp-2">{comp.features || ""}</p>
                  </div>
                  {comp.price && <span className="font-semibold text-green-600 whitespace-nowrap ml-2">{comp.price}</span>}
                </div>
                {comp.website && (
                  <a href={comp.website} target="_blank" rel="noopener noreferrer" className="mt-2 inline-flex items-center text-xs text-blue-600 hover:underline">
                    {t.visit} <ExternalLink className="w-3 h-3 ml-1" />
                  </a>
                )}
              </div>
            )) : (
              <p className="text-sm text-slate-400 italic">No competitor data available.</p>
            )}
          </div>
        </div>

        {/* SWOT Analysis */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 relative">
          <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-slate-900 flex items-center">
                <Shield className="w-5 h-5 mr-2 text-indigo-600" />
                {t.swot}
              </h3>
              <AddToReportButton 
                type="swot" 
                title="SWOT Analysis" 
                data={swot} 
                language={language} 
              />
          </div>

          <div className="grid grid-cols-2 gap-4 h-full">
             <div className="p-4 bg-green-50 rounded-lg border border-green-100">
                <h4 className="font-semibold text-green-800 mb-2 text-sm">{t.strengths}</h4>
                <ul className="list-disc list-inside text-xs text-green-900 space-y-1">
                  {swot.strengths.length > 0 ? swot.strengths.map((s, i) => <li key={i}>{s}</li>) : <li>N/A</li>}
                </ul>
             </div>
             <div className="p-4 bg-red-50 rounded-lg border border-red-100">
                <h4 className="font-semibold text-red-800 mb-2 text-sm">{t.weaknesses}</h4>
                 <ul className="list-disc list-inside text-xs text-red-900 space-y-1">
                  {swot.weaknesses.length > 0 ? swot.weaknesses.map((s, i) => <li key={i}>{s}</li>) : <li>N/A</li>}
                </ul>
             </div>
             <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                <h4 className="font-semibold text-blue-800 mb-2 text-sm">{t.opportunities}</h4>
                 <ul className="list-disc list-inside text-xs text-blue-900 space-y-1">
                  {swot.opportunities.length > 0 ? swot.opportunities.map((s, i) => <li key={i}>{s}</li>) : <li>N/A</li>}
                </ul>
             </div>
             <div className="p-4 bg-amber-50 rounded-lg border border-amber-100">
                <h4 className="font-semibold text-amber-800 mb-2 text-sm">{t.threats}</h4>
                 <ul className="list-disc list-inside text-xs text-amber-900 space-y-1">
                  {swot.threats.length > 0 ? swot.threats.map((s, i) => <li key={i}>{s}</li>) : <li>N/A</li>}
                </ul>
             </div>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Trend Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 relative">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-semibold text-slate-900 flex items-center">
                <TrendingUp className="w-5 h-5 mr-2 text-emerald-600" />
                {t.trendTitle}
            </h3>
            <AddToReportButton 
                type="chart-line" 
                title="Market Trend 5-Year" 
                data={trendsData} 
                language={language} 
            />
          </div>
          <p className="text-sm text-slate-500 mb-6 h-10 line-clamp-2">{result.fiveYearTrendAnalysis}</p>
          <div className="h-64 w-full">
            {trendsData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trendsData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="year" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} label={{ value: 'Market Index', angle: -90, position: 'insideLeft', fill: '#94a3b8' }} />
                  <Tooltip 
                      contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                      cursor={{ stroke: '#cbd5e1', strokeWidth: 1 }}
                      formatter={(value: number) => [value, 'Market Index']}
                      labelFormatter={(label) => `Year: ${label}`}
                  />
                  <Line type="monotone" dataKey="marketSize" stroke="#2563eb" strokeWidth={3} dot={{ r: 4, fill: '#2563eb', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            ) : <div className="flex h-full items-center justify-center text-slate-400">No trend data</div>}
          </div>
        </div>

        {/* Market Share Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 relative">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-semibold text-slate-900 flex items-center">
                <AlertCircle className="w-5 h-5 mr-2 text-purple-600" />
                {t.shareTitle}
            </h3>
            <AddToReportButton 
                type="chart-bar" 
                title="Competitor Market Share" 
                data={sharesData} 
                language={language} 
            />
          </div>
           <p className="text-sm text-slate-500 mb-6 h-10">{t.shareSubtitle}</p>
          <div className="h-64 w-full">
            {sharesData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart 
                  data={sharesData} 
                  layout="vertical" 
                  margin={{ left: 40 }}
                  onMouseLeave={() => setHoveredBarIndex(null)}
                >
                  <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#e2e8f0" />
                  <XAxis type="number" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} unit="%" />
                  <YAxis dataKey="name" type="category" stroke="#64748b" fontSize={10} width={100} tickLine={false} axisLine={false} />
                  <Tooltip 
                      cursor={{fill: 'transparent'}}
                      contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0' }}
                      formatter={(value: number) => [`${value}%`, 'Market Share']}
                  />
                  <Bar 
                    dataKey="share" 
                    radius={[0, 4, 4, 0]} 
                    barSize={20}
                    onMouseEnter={(_, index) => setHoveredBarIndex(index)}
                  >
                    {sharesData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={COLORS[index % COLORS.length]} 
                        fillOpacity={hoveredBarIndex === null || hoveredBarIndex === index ? 1 : 0.3}
                        style={{ transition: 'fill-opacity 0.3s ease' }}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : <div className="flex h-full items-center justify-center text-slate-400">No share data</div>}
          </div>
        </div>
      </div>

      {/* Grounding Sources */}
      {result.rawSearchLinks && result.rawSearchLinks.length > 0 && (
        <div className="bg-slate-100 p-4 rounded-lg text-xs text-slate-500 break-all">
          <span className="font-bold text-slate-600">{t.sources} </span>
          {result.rawSearchLinks.slice(0, 3).map((link, i) => (
             <span key={i} className="mx-1 text-blue-500 underline">{link}</span>
          ))}
        </div>
      )}

    </div>
  );
};
