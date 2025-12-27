
import React, { useState } from 'react';
import { Globe, BarChart3, Package, Search, Languages, ImageOff,Bot,LineChart } from 'lucide-react';
import { Language } from '../types';
import { translations } from '../translations';

interface NavbarProps {
  activeTab: 'insight'|'online' | 'trade' | 'logistics' | 'tiktok';
  setActiveTab: (tab: 'insight'| 'online' | 'trade' | 'logistics' | 'tiktok') => void;
  language: Language;
  setLanguage: (lang: Language) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab, language, setLanguage }) => {
  const t = translations[language].nav;
  const [imgError, setImgError] = useState(false);

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'zh' : 'en');
  };

  // NOTE: If this URL expires, please replace it with a permanent direct link to your logo.
  const logoUrl = "https://attachment.message-content.s3.amazonaws.com/20250226/081724/11a192a575a07818468266c8e5c314b2.jpg";

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div 
              className="flex-shrink-0 flex items-center gap-3 mr-8 cursor-pointer group" 
              onClick={() => setActiveTab('online')}
            >
              {!imgError ? (
                <img 
                  src={logoUrl}
                  alt="HYH Logo" 
                  className="h-10 w-auto object-contain max-w-[120px]"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    setImgError(true);
                  }}
                />
              ) : (
                // Professional fallback if the image link is broken/expired
                <div className="h-10 w-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center flex-shrink-0 shadow-sm">
                   <span className="text-white font-bold text-xs tracking-wider">HYH</span>
                </div>
              )}
              <span className="text-xl font-bold text-slate-900 tracking-tight truncate group-hover:text-blue-600 transition-colors">
                {t.title}
              </span>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex md:space-x-6">
              <button
  onClick={() => setActiveTab('insight')}
  className={`${
    activeTab === 'insight'
      ? 'border-indigo-500 text-slate-900'
      : 'border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700'
  } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors duration-200 h-full`}
>
  <LineChart className="w-4 h-4 mr-2" />
  {t.insight}
</button>
              <button
                onClick={() => setActiveTab('online')}
                className={`${
                  activeTab === 'online'
                    ? 'border-blue-500 text-slate-900'
                    : 'border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700'
                } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors duration-200 h-full`}
              >
                <Globe className="w-4 h-4 mr-2" />
                {t.online}
              </button>
              <button
                onClick={() => setActiveTab('trade')}
                className={`${
                  activeTab === 'trade'
                    ? 'border-blue-500 text-slate-900'
                    : 'border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700'
                } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors duration-200 h-full`}
              >
                <BarChart3 className="w-4 h-4 mr-2" />
                {t.trade}
              </button>
              <button
                onClick={() => setActiveTab('logistics')}
                className={`${
                  activeTab === 'logistics'
                    ? 'border-blue-500 text-slate-900'
                    : 'border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700'
                } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors duration-200 h-full`}
              >
                <Package className="w-4 h-4 mr-2" />
                {t.logistics}
              </button>
              <button
                onClick={() => setActiveTab('tiktok')}
                className={`${
                  activeTab === 'tiktok'
                    ? 'border-blue-500 text-slate-900'
                    : 'border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700'
                } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors duration-200 h-full`}
              >
                <Search className="w-4 h-4 mr-2" />
                {t.tiktok}
              </button>
            </div>
          </div>
          <div className="flex items-center">
             <button 
                onClick={toggleLanguage}
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-700 transition-colors border border-slate-200"
             >
                <Languages className="w-4 h-4" />
                <span className="text-sm font-medium">{language === 'en' ? 'EN' : '中文'}</span>
             </button>
          </div>
        </div>
        
        {/* Mobile Menu (Simplified) */}
        <div className="md:hidden flex justify-between border-t border-slate-100 pt-2 pb-2 overflow-x-auto space-x-2 px-2 no-scrollbar">
          <button onClick={() => setActiveTab('insight')} className={`flex-1 p-2 flex justify-center rounded-md transition-colors ${activeTab === 'insight' ? 'text-indigo-600 bg-indigo-50' : 'text-slate-500'}`}>
  <LineChart className="w-5 h-5" />
</button>
             <button onClick={() => setActiveTab('online')} className={`flex-1 p-2 flex justify-center rounded-md transition-colors ${activeTab === 'online' ? 'text-blue-600 bg-blue-50' : 'text-slate-500'}`}><Globe className="w-5 h-5" /></button>
             <button onClick={() => setActiveTab('trade')} className={`flex-1 p-2 flex justify-center rounded-md transition-colors ${activeTab === 'trade' ? 'text-blue-600 bg-blue-50' : 'text-slate-500'}`}><BarChart3 className="w-5 h-5" /></button>
             <button onClick={() => setActiveTab('logistics')} className={`flex-1 p-2 flex justify-center rounded-md transition-colors ${activeTab === 'logistics' ? 'text-blue-600 bg-blue-50' : 'text-slate-500'}`}><Package className="w-5 h-5" /></button>
             <button onClick={() => setActiveTab('tiktok')} className={`flex-1 p-2 flex justify-center rounded-md transition-colors ${activeTab === 'tiktok' ? 'text-blue-600 bg-blue-50' : 'text-slate-500'}`}><Search className="w-5 h-5" /></button>
        </div>
      </div>
    </nav>
  );
};
