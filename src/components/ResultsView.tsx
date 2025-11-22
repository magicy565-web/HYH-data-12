
import React, { useState, useMemo } from 'react';
import { ResearchResult, FormData, Language } from '../types';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell, Legend } from 'recharts';
import { TrendingUp, AlertCircle, Target, Shield, ExternalLink, Heart, Megaphone, DollarSign, ListChecks } from 'lucide-react';
import { translations } from '../translations';
import { AddToReportButton } from './AddToReportButton';

interface Props {
  result: ResearchResult;
  formData: FormData;
  language: Language;
}

const COLORS = ['#3b82f6', '#6366f1', '#8b5cf6', '#ec4899', '#f43f5e'];

// Custom Tooltip
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-2 border border-slate-200 shadow-sm rounded text-xs">
        <p className="font-semibold">{label}</p>
        <p className="text-blue-600">{`${payload[0].name}: ${payload[0].value}`}</p>
      </div>
    );
  }
  return null;
};

export const ResultsView: React.FC<Props> = ({ result, formData, language }) => {
  const t = translations[language].results;
  const marketName = translations[language].online.markets[formData.market] || formData.market;
  const [hoveredBarIndex, setHoveredBarIndex] = useState<number | null>(null);

  if (!result) return null;

  // Safe Data Access
  const competitors = Array.isArray(result.competitors) ? result.competitors : [];
  const trendsData = useMemo(() => (Array.isArray(result.chartData?.trends) ? result.chartData.trends : []).map(i => ({...i, marketSize: Number(i.marketSize)||0})), [result.chartData]);
  const sharesData = useMemo(() => (Array.isArray(result.chartData?.shares) ? result.chartData.shares : []).map(i => ({...i, share: Number(i.share)||0})), [result.chartData]);
  
  const swot = {
    strengths: Array.isArray(result.swot?.strengths) ? result.swot.strengths : [],
    weaknesses: Array.isArray(result.swot?.weaknesses) ? result.swot.weaknesses : [],
    opportunities: Array.isArray(result.swot?.opportunities) ? result.swot.opportunities : [],
    threats: Array.isArray(result.swot?.threats) ? result.swot.threats : [],
  };

  const marketingChannels = Array.isArray(result.marketingChannels) ? result.marketingChannels : [];
  const actionPlan = Array.isArray(result.actionPlan) ? result.actionPlan : [];

  // Format Data for Report
  const competitorReportData = competitors.map((c, i) => `${i+1}. ${c.name}\n   ${c.features}\n   ${c.price}`).join('\n\n');

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      
      {/* Header Summary */}
      <div className="bg-gradient-to-br from-blue-50 to-white p-8 rounded-2xl shadow-sm border border-blue-100 relative group">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-3xl font-bold text-slate-900">{t.title}</h2>
          <span className="px-4 py-1.5 bg-blue-600 text-white rounded-full text-sm font-semibold shadow-md">
            {marketName}
          </span>
        </div>
        <p className="text-slate-700 leading-relaxed text-lg">{result.marketSummary || "Analysis completed."}</p>
        
        <div className="absolute top-8 right-8">
             <AddToReportButton type="text" title="Market Summary" data={result.marketSummary} language={language} />
        </div>
      </div>

      {/* NEW: Strategic Insights Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
         {/* Consumer Sentiment */}
         <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 relative">
            <div className="flex items-center gap-2 mb-3">
               <div className="bg-pink-100 p-2 rounded-lg"><Heart className="w-5 h-5 text-pink-600" /></div>
               <h3 className="text-lg font-bold text-slate-900">{t.consumerSentiment}</h3>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed">{result.consumerSentiment}</p>
            <div className="absolute top-6 right-6"><AddToReportButton type="text" title="Consumer Sentiment" data={result.consumerSentiment} language={language} /></div>
         </div>

         {/* Pricing Strategy */}
         <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 relative">
            <div className="flex items-center gap-2 mb-3">
               <div className="bg-green-100 p-2 rounded-lg"><DollarSign className="w-5 h-5 text-green-600" /></div>
               <h3 className="text-lg font-bold text-slate-900">{t.pricingStrategy}</h3>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed">{result.pricingStrategy}</p>
            <div className="absolute top-6 right-6"><AddToReportButton type="text" title="Pricing Strategy" data={result.pricingStrategy} language={language} /></div>
         </div>
      </div>

      {/* Top Competitors */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 relative">
        <div className="flex justify-between items-center mb-6">
           <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Target className="w-6 h-6 text-blue-600" /> {t.competitors}
           </h3>
           <AddToReportButton type="text" title="Competitors" data={competitorReportData} language={language} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {competitors.length > 0 ? competitors.map((comp, idx) => (
            <div key={idx} className="p-4 border border-slate-100 rounded-xl hover:border-blue-200 hover:shadow-md transition-all bg-slate-50">
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-bold text-slate-900 line-clamp-1">{comp.name || "Unknown"}</h4>
                <span className="text-xs font-bold bg-green-100 text-green-700 px-2 py-1 rounded">{comp.price || "N/A"}</span>
              </div>
              <p className="text-xs text-slate-500 mb-3 line-clamp-3">{comp.features || ""}</p>
              {comp.website && (
                <a href={comp.website} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:underline flex items-center gap-1">
                  {t.visit} <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
          )) : <div className="col-span-full text-center py-8 text-slate-400">No data found.</div>}
        </div>
      </div>

      {/* Marketing & Action Plan */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Marketing Channels */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 relative">
             <div className="flex items-center gap-2 mb-4">
               <div className="bg-purple-100 p-2 rounded-lg"><Megaphone className="w-5 h-5 text-purple-600" /></div>
               <h3 className="text-lg font-bold text-slate-900">{t.marketingChannels}</h3>
             </div>
             <ul className="space-y-3">
                {marketingChannels.map((channel, i) => (
                   <li key={i} className="flex items-start gap-3 text-sm text-slate-600 bg-slate-50 p-3 rounded-lg">
                      <span className="flex-shrink-0 w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center text-xs font-bold">{i+1}</span>
                      <span>{channel}</span>
                   </li>
                ))}
             </ul>
             <div className="absolute top-6 right-6"><AddToReportButton type="text" title="Marketing Channels" data={marketingChannels.join('\n')} language={language} /></div>
          </div>

          {/* Action Plan */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 relative">
             <div className="flex items-center gap-2 mb-4">
               <div className="bg-orange-100 p-2 rounded-lg"><ListChecks className="w-5 h-5 text-orange-600" /></div>
               <h3 className="text-lg font-bold text-slate-900">{t.actionPlan}</h3>
             </div>
             <ul className="space-y-3">
                {actionPlan.map((step, i) => (
                   <li key={i} className="flex items-start gap-3 text-sm text-slate-600 bg-slate-50 p-3 rounded-lg border-l-4 border-orange-400">
                      <span>{step}</span>
                   </li>
                ))}
             </ul>
             <div className="absolute top-6 right-6"><AddToReportButton type="text" title="Action Plan" data={actionPlan.join('\n')} language={language} /></div>
          </div>
      </div>

      {/* SWOT Analysis */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 relative">
        <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2"><Shield className="w-6 h-6 text-indigo-600" />{t.swot}</h3>
            <AddToReportButton type="swot" title="SWOT Analysis" data={swot} language={language} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           <div className="p-5 bg-green-50 rounded-xl border border-green-100"><h4 className="font-bold text-green-800 mb-3">{t.strengths}</h4><ul className="list-disc list-inside text-sm text-green-900 space-y-2">{swot.strengths.map((s, i) => <li key={i}>{s}</li>)}</ul></div>
           <div className="p-5 bg-red-50 rounded-xl border border-red-100"><h4 className="font-bold text-red-800 mb-3">{t.weaknesses}</h4><ul className="list-disc list-inside text-sm text-red-900 space-y-2">{swot.weaknesses.map((s, i) => <li key={i}>{s}</li>)}</ul></div>
           <div className="p-5 bg-blue-50 rounded-xl border border-blue-100"><h4 className="font-bold text-blue-800 mb-3">{t.opportunities}</h4><ul className="list-disc list-inside text-sm text-blue-900 space-y-2">{swot.opportunities.map((s, i) => <li key={i}>{s}</li>)}</ul></div>
           <div className="p-5 bg-amber-50 rounded-xl border border-amber-100"><h4 className="font-bold text-amber-800 mb-3">{t.threats}</h4><ul className="list-disc list-inside text-sm text-amber-900 space-y-2">{swot.threats.map((s, i) => <li key={i}>{s}</li>)}</ul></div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 relative">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2"><TrendingUp className="w-5 h-5 text-emerald-600" />{t.trendTitle}</h3>
            <AddToReportButton type="chart-line" title="Market Trend" data={trendsData} language={language} />
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendsData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="year" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip isAnimationActive={false} contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0' }} />
                <Line type="monotone" dataKey="marketSize" stroke="#2563eb" strokeWidth={3} dot={{ r: 4 }} isAnimationActive={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 relative">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2"><AlertCircle className="w-5 h-5 text-purple-600" />{t.shareTitle}</h3>
            <AddToReportButton type="chart-bar" title="Market Share" data={sharesData} language={language} />
          </div>
          <div className="h-64 w-full">
             <ResponsiveContainer width="100%" height="100%">
                <BarChart data={sharesData} layout="vertical" margin={{ left: 40 }} onMouseLeave={() => setHoveredBarIndex(null)}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#e2e8f0" />
                  <XAxis type="number" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} unit="%" />
                  <YAxis dataKey="name" type="category" stroke="#64748b" fontSize={10} width={100} tickLine={false} axisLine={false} />
                  <Tooltip isAnimationActive={false} cursor={{fill: 'transparent'}} contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0' }} />
                  <Bar dataKey="share" radius={[0, 4, 4, 0]} barSize={20} isAnimationActive={false} onMouseEnter={(_, index) => setHoveredBarIndex(index)}>
                    {sharesData.map((entry, index) => (
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
