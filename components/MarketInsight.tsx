import React from 'react';
import { ExternalLink, LineChart } from 'lucide-react';

export const MarketInsight: React.FC = () => {
  const targetUrl = "https://insight.mycache.cn/";

  return (
    <div className="max-w-7xl mx-auto h-[calc(100vh-10rem)] flex flex-col bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden animate-fade-in">
      {/* 顶部工具栏 */}
      <div className="bg-slate-50 p-3 border-b border-slate-200 flex justify-between items-center px-4">
        <div className="flex items-center gap-2 text-slate-700">
          <LineChart className="w-4 h-4" />
          <span className="font-bold text-sm">市场深度洞察工具 (MyCache Insight)</span>
        </div>
        <a 
          href={targetUrl} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 hover:underline bg-white px-3 py-1.5 rounded-full border border-slate-200 shadow-sm transition-colors"
        >
          全屏打开 <ExternalLink size={12}/>
        </a>
      </div>

      {/* 核心内嵌区域 */}
      <div className="flex-1 bg-slate-100 relative">
        <iframe 
          src={targetUrl} 
          className="absolute inset-0 w-full h-full border-none"
          title="Market Insight Tool"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          sandbox="allow-forms allow-scripts allow-same-origin allow-popups allow-top-navigation"
        />
      </div>
    </div>
  );
};
