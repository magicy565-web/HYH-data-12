import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { OnlineResearchForm } from './components/OnlineResearchForm';
import { ResultsView } from './components/ResultsView';
import { TradeResearch } from './components/TradeResearch';
import { LogisticsCalculator } from './components/LogisticsCalculator';
import { TikTokDiscover } from './components/TikTokDiscover';
import { ReportBuilder } from './components/ReportBuilder';
import { FormData, ResearchResult, Language } from './types';
import { analyzeMarket } from './services/geminiService';
import { translations } from './translations';
import { ReportProvider } from './contexts/ReportContext';
import { ErrorBoundary } from './components/ErrorBoundary';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'online' | 'trade' | 'logistics' | 'tiktok'>('online');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<ResearchResult | null>(null);
  const [lastFormData, setLastFormData] = useState<FormData | null>(null);
  const [language, setLanguage] = useState<Language>('en');

  const handleOnlineResearchSubmit = async (data: FormData) => {
    setIsLoading(true);
    setLastFormData(data);
    setResult(null); 
    
    try {
      const analysisResult = await analyzeMarket(data, language);
      setResult(analysisResult);
    } catch (error) {
      alert("An error occurred during research analysis. Please check your API key or try different images.");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

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
            <div className="space-y-8">
              <div className="max-w-3xl mx-auto">
                <div className="text-center mb-8">
                  <h1 className="text-3xl font-bold text-slate-900">{t.nav.online}</h1>
                  <p className="mt-2 text-slate-600">{t.online.subtitle}</p>
                </div>
                <ErrorBoundary>
                  <OnlineResearchForm 
                    onSubmit={handleOnlineResearchSubmit} 
                    isLoading={isLoading} 
                    language={language}
                  />
                </ErrorBoundary>
              </div>

              {isLoading && (
                <div className="text-center py-12">
                  <div className="inline-block animate-bounce p-4 bg-white rounded-full shadow-lg">
                    <span className="text-3xl">🤖</span>
                  </div>
                  <p className="mt-4 text-slate-600 font-medium">{t.online.analyzing}</p>
                </div>
              )}

              {result && lastFormData && (
                <ErrorBoundary>
                  <ResultsView result={result} formData={lastFormData} language={language} />
                </ErrorBoundary>
              )}
            </div>
          )}

          {activeTab === 'trade' && (
             <ErrorBoundary>
                <TradeResearch language={language} />
             </ErrorBoundary>
          )}
          {activeTab === 'logistics' && (
             <ErrorBoundary>
                <LogisticsCalculator language={language} />
             </ErrorBoundary>
          )}
          {activeTab === 'tiktok' && (
             <ErrorBoundary>
                <TikTokDiscover language={language} />
             </ErrorBoundary>
          )}
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
