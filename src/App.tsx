import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
// Removed OnlineResearch components
import { TradeResearch } from './components/TradeResearch';
import { LogisticsCalculator } from './components/LogisticsCalculator';
import { TikTokDiscover } from './components/TikTokDiscover';
import { ReportBuilder } from './components/ReportBuilder';
import { Language } from './types';
import { translations } from './translations';
import { ReportProvider } from './contexts/ReportContext';

const App: React.FC = () => {
  // Default to trade since online is removed
  const [activeTab, setActiveTab] = useState<'online' | 'trade' | 'logistics' | 'tiktok'>('trade');
  const [language, setLanguage] = useState<Language>('en');

  const t = translations[language];

  return (
    <ReportProvider>
      <div className="min-h-screen bg-slate-50 pb-20">
        <Navbar 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
          language={language}
          setLanguage={setLanguage}
        />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {activeTab === 'online' && (
             <div className="flex flex-col items-center justify-center min-h-[50vh] bg-white rounded-xl border border-dashed border-slate-300 p-12 text-center">
                <h3 className="text-xl font-semibold text-slate-900 mb-2">Online Research Module</h3>
                <p className="text-slate-500">This module is currently being rewritten.</p>
             </div>
          )}

          {activeTab === 'trade' && <TradeResearch language={language} />}
          {activeTab === 'logistics' && <LogisticsCalculator language={language} />}
          {activeTab === 'tiktok' && <TikTokDiscover language={language} />}
        </main>
        
        <ReportBuilder language={language} />

        <footer className="border-t border-slate-200 bg-white mt-auto">
          <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
            <p className="text-center text-xs text-slate-400">
              &copy; {new Date().getFullYear()} MarketScope AI. Powered by Google Gemini.
            </p>
          </div>
        </footer>
      </div>
    </ReportProvider>
  );
};

export default App;
