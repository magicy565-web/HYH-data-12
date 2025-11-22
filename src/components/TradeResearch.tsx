import React, { useState } from 'react';
import { MapPin, Loader2, AlertTriangle, CheckCircle, Info, ShoppingBag, Store, Building2, Briefcase, Database, Calendar, FileSpreadsheet } from 'lucide-react';
import { TradeCountry, TradeResearchResult, Language, TradeChannel, Buyer, CantonFairData, BuyerSize } from '../types';
import { analyzeTradeMarket, findTradeBuyers, searchCantonFairDatabase } from '../services/geminiService';
import { translations } from '../translations';

interface Props {
  language: Language;
}

type SubTab = 'evaluation' | 'buyers' | 'canton';

export const TradeResearch: React.FC<Props> = ({ language }) => {
  const t = translations[language].trade;
  const [activeSubTab, setActiveSubTab] = useState<SubTab>('evaluation');
  
  // State for Evaluation
  const [evalCountry, setEvalCountry] = useState<TradeCountry>(TradeCountry.UK);
  const [evalNiche, setEvalNiche] = useState('');
  const [isEvalLoading, setIsEvalLoading] = useState(false);
  const [evalResult, setEvalResult] = useState<TradeResearchResult | null>(null);

  // State for Buyers
  const [buyerCountry, setBuyerCountry] = useState<TradeCountry>(TradeCountry.UK);
  const [buyerChannel, setBuyerChannel] = useState<TradeChannel>(TradeChannel.SUPERMARKET);
  const [buyerNiche, setBuyerNiche] = useState('');
  const [buyerSize, setBuyerSize] = useState<BuyerSize>('Any');
  const [buyerDistChannels, setBuyerDistChannels] = useState('');
  const [isBuyerLoading, setIsBuyerLoading] = useState(false);
  const [buyerResult, setBuyerResult] = useState<Buyer[]>([]);
  const [hasSearchedBuyers, setHasSearchedBuyers] = useState(false);

  // State for Canton Fair
  const [cantonCountry, setCantonCountry] = useState<'United Kingdom' | 'United States'>('United Kingdom');
  const [cantonProduct, setCantonProduct] = useState('');
  const [cantonYear, setCantonYear] = useState('2024');
  const [isCantonLoading, setIsCantonLoading] = useState(false);
  const [cantonResult, setCantonResult] = useState<CantonFairData[]>([]);
  const [hasSearchedCanton, setHasSearchedCanton] = useState(false);

  // Evaluation Handler
  const handleEvalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!evalNiche.trim()) return;

    setIsEvalLoading(true);
    setEvalResult(null);

    try {
      const data = await analyzeTradeMarket(evalCountry, evalNiche, language);
      setEvalResult(data);
    } catch (error) {
      console.error(error);
      alert("Failed to analyze trade market. Please try again.");
    } finally {
      setIsEvalLoading(false);
    }
  };

  // Buyer Search Handler
  const handleBuyerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!buyerNiche.trim()) return;

    setIsBuyerLoading(true);
    setBuyerResult([]);
    setHasSearchedBuyers(false);

    try {
      const data = await findTradeBuyers(buyerCountry, buyerChannel, buyerNiche, buyerSize, buyerDistChannels, language);
      setBuyerResult(data);
    } catch (error) {
      console.error(error);
      alert("Failed to find buyers. Please try again.");
    } finally {
      setIsBuyerLoading(false);
      setHasSearchedBuyers(true);
    }
  };

  // Canton Fair Search Handler
  const handleCantonSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cantonProduct.trim()) return;

    setIsCantonLoading(true);
    setCantonResult([]);
    setHasSearchedCanton(false);

    try {
        const data = await searchCantonFairDatabase(cantonCountry, cantonProduct, cantonYear);
        setCantonResult(data);
    } catch (error) {
        console.error(error);
        alert("Failed to query database.");
    } finally {
        setIsCantonLoading(false);
        setHasSearchedCanton(true);
    }
  };

  // Helper to get color and text based on score
  const getStatus = (score: number) => {
    if (score < 6) {
      return {
        color: 'text-red-600',
        bg: 'bg-red-50',
        border: 'border-red-200',
        label: t.statusLow,
        icon: <AlertTriangle className="w-5 h-5" />
      };
    } else if (score >= 6 && score < 8) {
      return {
        color: 'text-amber-600',
        bg: 'bg-amber-50',
        border: 'border-amber-200',
        label: t.statusMid,
        icon: <Info className="w-5 h-5" />
      };
    } else {
      return {
        color: 'text-emerald-600',
        bg: 'bg-emerald-50',
        border: 'border-emerald-200',
        label: t.statusHigh,
        icon: <CheckCircle className="w-5 h-5" />
      };
    }
  };

  const ScoreCard = ({ title, score }: { title: string; score: number }) => {
    const { color, bg, border } = getStatus(score);
    return (
      <div className={`p-4 rounded-xl border ${border} ${bg} flex flex-col items-center justify-center text-center transition-all duration-500`}>
        <span className="text-sm font-medium text-slate-600 mb-2">{title}</span>
        <div className={`text-4xl font-bold ${color} mb-1`}>{score}</div>
        <div className="text-xs text-slate-400 font-medium">/ 10</div>
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-slate-900">{t.title}</h1>
        <p className="mt-2 text-slate-600">{t.subtitle}</p>
      </div>

      {/* Sub-Tab Switcher */}
      <div className="flex justify-center space-x-4 mb-6 overflow-x-auto px-2">
        <button
          onClick={() => setActiveSubTab('evaluation')}
          className={`px-6 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${
            activeSubTab === 'evaluation'
              ? 'bg-blue-600 text-white shadow-md'
              : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
          }`}
        >
          {t.tabs.evaluation}
        </button>
        <button
          onClick={() => setActiveSubTab('buyers')}
          className={`px-6 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${
            activeSubTab === 'buyers'
              ? 'bg-blue-600 text-white shadow-md'
              : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
          }`}
        >
          {t.tabs.buyers}
        </button>
        <button
          onClick={() => setActiveSubTab('canton')}
          className={`px-6 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${
            activeSubTab === 'canton'
              ? 'bg-blue-600 text-white shadow-md'
              : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
          }`}
        >
          {t.tabs.canton}
        </button>
      </div>

      {/* --- MARKET EVALUATION TAB --- */}
      {activeSubTab === 'evaluation' && (
        <div className="animate-fade-in">
          <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200">
            <form onSubmit={handleEvalSubmit} className="flex flex-col md:flex-row gap-4 items-end">
              <div className="flex-1 w-full">
                <label className="block text-sm font-medium text-slate-700 mb-1">{t.country}</label>
                <div className="relative">
                   <MapPin className="absolute left-3 top-2.5 w-5 h-5 text-slate-400" />
                   <select
                      value={evalCountry}
                      onChange={(e) => setEvalCountry(e.target.value as TradeCountry)}
                      className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white appearance-none"
                   >
                      {Object.values(TradeCountry).map((c) => (
                        <option key={c} value={c}>{t.countries[c]}</option>
                      ))}
                   </select>
                </div>
              </div>
              
              <div className="flex-[2] w-full">
                 <label className="block text-sm font-medium text-slate-700 mb-1">{t.niche}</label>
                 <div className="relative">
                   <input
                      type="text"
                      value={evalNiche}
                      onChange={(e) => setEvalNiche(e.target.value)}
                      placeholder={t.nichePlaceholder}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                   />
                 </div>
              </div>

              <button
                type="submit"
                disabled={isEvalLoading || !evalNiche.trim()}
                className="w-full md:w-auto px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-500/20 transition-all disabled:opacity-50 flex items-center justify-center min-w-[140px]"
              >
                 {isEvalLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : t.analyze}
              </button>
            </form>
          </div>

          {isEvalLoading && (
             <div className="py-12 text-center">
                <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
                <p className="text-slate-600 font-medium">{t.analyzing} {t.countries[evalCountry]}...</p>
             </div>
          )}

          {evalResult && (
            <div className="space-y-8 mt-8 animate-fade-in-up">
               {/* Overall Verdict */}
               <div className={`p-6 rounded-xl border-2 ${getStatus(evalResult.averageScore).border} ${getStatus(evalResult.averageScore).bg} flex items-center gap-6 shadow-sm`}>
                  <div className={`p-4 rounded-full bg-white shadow-sm ${getStatus(evalResult.averageScore).color}`}>
                     {getStatus(evalResult.averageScore).icon}
                  </div>
                  <div>
                     <h3 className={`text-xl font-bold ${getStatus(evalResult.averageScore).color}`}>
                        {getStatus(evalResult.averageScore).label}
                     </h3>
                     <p className="text-slate-700 mt-1">{evalResult.reasoning}</p>
                  </div>
                  <div className="ml-auto text-center hidden sm:block">
                     <span className="block text-xs uppercase tracking-wider font-semibold text-slate-500">{t.verdict}</span>
                     <span className={`text-3xl font-bold ${getStatus(evalResult.averageScore).color}`}>{evalResult.averageScore}</span>
                  </div>
               </div>

               {/* Score Breakdown */}
               <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <ScoreCard title={t.match} score={evalResult.matchScore} />
                  <ScoreCard title={t.demand} score={evalResult.demandScore} />
                  <ScoreCard title={t.maturity} score={evalResult.developmentScore} />
               </div>

               {/* Legend */}
               <div className="flex flex-wrap gap-4 justify-center text-xs text-slate-500 mt-8">
                  <div className="flex items-center gap-2">
                     <div className="w-3 h-3 rounded-full bg-red-500"></div>
                     <span>{t.legend1}</span>
                  </div>
                  <div className="flex items-center gap-2">
                     <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                     <span>{t.legend2}</span>
                  </div>
                  <div className="flex items-center gap-2">
                     <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                     <span>{t.legend3}</span>
                  </div>
               </div>
            </div>
          )}
        </div>
      )}

      {/* --- BUYER MATCHING TAB --- */}
      {activeSubTab === 'buyers' && (
        <div className="animate-fade-in">
          <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
              <div className="bg-indigo-600 p-2 rounded-lg">
                <Briefcase className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-900">{t.buyer.title}</h3>
                <p className="text-xs text-slate-500">{t.buyer.subtitle}</p>
              </div>
            </div>

            <form onSubmit={handleBuyerSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Country */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">{t.country}</label>
                  <div className="relative">
                     <MapPin className="absolute left-3 top-2.5 w-5 h-5 text-slate-400" />
                     <select
                        value={buyerCountry}
                        onChange={(e) => setBuyerCountry(e.target.value as TradeCountry)}
                        className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white appearance-none"
                     >
                        {Object.values(TradeCountry).map((c) => (
                          <option key={c} value={c}>{t.countries[c]}</option>
                        ))}
                     </select>
                  </div>
                </div>

                {/* Channel */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">{t.buyer.channel}</label>
                  <div className="relative">
                     <Store className="absolute left-3 top-2.5 w-5 h-5 text-slate-400" />
                     <select
                        value={buyerChannel}
                        onChange={(e) => setBuyerChannel(e.target.value as TradeChannel)}
                        className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white appearance-none"
                     >
                        {Object.values(TradeChannel).map((c) => (
                          <option key={c} value={c}>{t.buyer.channels[c]}</option>
                        ))}
                     </select>
                  </div>
                </div>
              </div>

              {/* Buyer Size */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">{t.buyer.size}</label>
                <div className="relative">
                    <Store className="absolute left-3 top-2.5 w-5 h-5 text-slate-400" /> 
                    <select
                        value={buyerSize}
                        onChange={(e) => setBuyerSize(e.target.value as BuyerSize)}
                        className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white appearance-none"
                    >
                        <option value="Any">{t.buyer.sizes['Any']}</option>
                        <option value="Small">{t.buyer.sizes['Small']}</option>
                        <option value="Medium">{t.buyer.sizes['Medium']}</option>
                        <option value="Large">{t.buyer.sizes['Large']}</option>
                    </select>
                </div>
              </div>

              {/* Distribution Channels */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">{t.buyer.distChannels}</label>
                <div className="relative">
                   <Briefcase className="absolute left-3 top-2.5 w-5 h-5 text-slate-400" />
                   <input
                      type="text"
                      value={buyerDistChannels}
                      onChange={(e) => setBuyerDistChannels(e.target.value)}
                      placeholder={t.buyer.distChannelsPlaceholder}
                      className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                   />
                </div>
              </div>

              {/* Niche/Product */}
              <div>
                 <label className="block text-sm font-medium text-slate-700 mb-1">{t.niche}</label>
                 <div className="relative">
                   <ShoppingBag className="absolute left-3 top-2.5 w-5 h-5 text-slate-400" />
                   <input
                      type="text"
                      value={buyerNiche}
                      onChange={(e) => setBuyerNiche(e.target.value)}
                      placeholder={t.nichePlaceholder}
                      className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                   />
                 </div>
              </div>

              <button
                type="submit"
                disabled={isBuyerLoading || !buyerNiche.trim()}
                className="w-full py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-500/20 transition-all disabled:opacity-50 flex items-center justify-center"
              >
                 {isBuyerLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : t.buyer.find}
              </button>
            </form>
          </div>

          {isBuyerLoading && (
             <div className="py-12 text-center">
                <Loader2 className="w-12 h-12 text-indigo-600 animate-spin mx-auto mb-4" />
                <p className="text-slate-600 font-medium">{t.buyer.finding}</p>
             </div>
          )}

          {hasSearchedBuyers && (
             <div className="mt-8 animate-fade-in-up">
               <h3 className="text-lg font-semibold text-slate-900 mb-4">{t.buyer.resultsTitle}</h3>
               
               {buyerResult.length === 0 ? (
                 <div className="bg-slate-50 p-6 rounded-lg text-center text-slate-500">
                    {t.buyer.noBuyers}
                 </div>
               ) : (
                 <div className="grid grid-cols-1 gap-4">
                    {buyerResult.map((buyer, idx) => (
                       <div key={idx} className="bg-white p-4 rounded-lg border border-slate-200 hover:shadow-md transition-shadow flex flex-col sm:flex-row sm:items-center gap-4">
                          <div className="flex-shrink-0 bg-indigo-50 p-3 rounded-lg">
                             <Building2 className="w-6 h-6 text-indigo-600" />
                          </div>
                          <div className="flex-1">
                             <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start">
                                <h4 className="text-lg font-bold text-slate-900">{buyer.name}</h4>
                                <span className="inline-block mt-1 sm:mt-0 px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded font-medium">{buyer.type}</span>
                             </div>
                             <p className="text-sm text-slate-600 mt-2">{buyer.description}</p>
                             {buyer.website && (
                                <a href={buyer.website} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:underline mt-2 inline-block">
                                   {buyer.website}
                                </a>
                             )}
                          </div>
                       </div>
                    ))}
                 </div>
               )}
             </div>
          )}
        </div>
      )}

      {/* --- CANTON FAIR DATA TAB --- */}
      {activeSubTab === 'canton' && (
        <div className="animate-fade-in">
            <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200">
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
                    <div className="bg-purple-600 p-2 rounded-lg">
                        <Database className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-slate-900">{t.canton.title}</h3>
                        <p className="text-xs text-slate-500">{t.canton.subtitle}</p>
                    </div>
                </div>

                <form onSubmit={handleCantonSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                         {/* Target Country (Restricted to UK/US) */}
                         <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">{t.country}</label>
                            <div className="relative">
                                <MapPin className="absolute left-3 top-2.5 w-5 h-5 text-slate-400" />
                                <select
                                    value={cantonCountry}
                                    onChange={(e) => setCantonCountry(e.target.value as 'United Kingdom' | 'United States')}
                                    className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none bg-white appearance-none"
                                >
                                    <option value="United Kingdom">{translations[language].online.markets['United Kingdom']}</option>
                                    <option value="United States">{translations[language].online.markets['United States']}</option>
                                </select>
                            </div>
                        </div>

                        {/* Data Year */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">{t.canton.year}</label>
                            <div className="relative">
                                <Calendar className="absolute left-3 top-2.5 w-5 h-5 text-slate-400" />
                                <select
                                    value={cantonYear}
                                    onChange={(e) => setCantonYear(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none bg-white appearance-none"
                                >
                                    <option value="2024">2024</option>
                                    <option value="2023">2023</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Product Name */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">{t.niche}</label>
                        <div className="relative">
                            <FileSpreadsheet className="absolute left-3 top-2.5 w-5 h-5 text-slate-400" />
                            <input
                                type="text"
                                value={cantonProduct}
                                onChange={(e) => setCantonProduct(e.target.value)}
                                placeholder={t.nichePlaceholder}
                                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isCantonLoading || !cantonProduct.trim()}
                        className="w-full py-2 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 focus:ring-4 focus:ring-purple-500/20 transition-all disabled:opacity-50 flex items-center justify-center"
                    >
                        {isCantonLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : t.canton.search}
                    </button>
                </form>
            </div>

            {isCantonLoading && (
                <div className="py-12 text-center">
                    <Loader2 className="w-12 h-12 text-purple-600 animate-spin mx-auto mb-4" />
                    <p className="text-slate-600 font-medium">{t.canton.searching}</p>
                </div>
            )}

            {hasSearchedCanton && (
                <div className="mt-8 animate-fade-in-up">
                    <h3 className="text-lg font-semibold text-slate-900 mb-4">{t.canton.results}</h3>

                    {cantonResult.length === 0 ? (
                         <div className="bg-slate-50 p-6 rounded-lg text-center text-slate-500">
                            {t.canton.noData}
                         </div>
                    ) : (
                        <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-sm">
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-slate-200">
                                    <thead className="bg-slate-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">{t.canton.colBuyer}</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">{t.canton.colCountry}</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">{t.canton.colProduct}</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">{t.canton.colSession}</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">{t.canton.colContact}</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-slate-200">
                                        {cantonResult.map((row, idx) => (
                                            <tr key={idx} className="hover:bg-slate-50">
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">{row.buyerName}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{row.country}</td>
                                                <td className="px-6 py-4 text-sm text-slate-500 truncate max-w-xs">{row.products}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{row.sessionDate}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600">{row.contactInfo}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
      )}
    </div>
  );
};--- START OF FILE src/components/LogisticsCalculator.tsx ---

import React, { useState, ChangeEvent } from 'react';
import { Loader2, Ship, Plane, Calculator, Info, Warehouse } from 'lucide-react';
import { LogisticsFormData, LogisticsResult, TargetMarket, Language } from '../types';
import { calculateLogistics } from '../services/geminiService';
import { translations } from '../translations';

interface Props {
  language: Language;
}

export const LogisticsCalculator: React.FC<Props> = ({ language }) => {
  const t = translations[language].logistics;
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<LogisticsResult | null>(null);
  const [formData, setFormData] = useState<LogisticsFormData>({
    length: 0,
    width: 0,
    height: 0,
    weight: 0,
    unitsPerCbm: undefined,
    market: TargetMarket.UK
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'market' ? value : Number(value)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.length <= 0 || formData.width <= 0 || formData.height <= 0) {
        alert("Please enter valid dimensions.");
        return;
    }
    
    setIsLoading(true);
    setResult(null);
    try {
      const data = await calculateLogistics(formData, language);
      setResult(data);
    } catch (error) {
      alert("Failed to calculate logistics. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
      <div className="text-center">
         <h1 className="text-3xl font-bold text-slate-900">{t.title}</h1>
         <p className="mt-2 text-slate-600">{t.subtitle}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Form Section */}
        <div className="md:col-span-1 bg-white p-6 rounded-xl shadow-sm border border-slate-200 h-fit">
          <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center">
             <Calculator className="w-5 h-5 mr-2 text-blue-600" />
             {t.dimensions}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
             <div>
               <label className="block text-sm font-medium text-slate-700 mb-1">{t.targetMarket}</label>
               <select name="market" value={formData.market} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white text-sm">
                  {Object.values(TargetMarket).map(m => (
                    <option key={m} value={m}>{translations[language].online.markets[m]}</option>
                  ))}
               </select>
             </div>
             
             <div className="grid grid-cols-3 gap-2">
                <div>
                   <label className="block text-xs font-medium text-slate-500 mb-1">L (cm)</label>
                   <input type="number" name="length" required min="1" onChange={handleChange} className="w-full px-2 py-2 border border-slate-300 rounded-lg text-sm" placeholder="0" />
                </div>
                <div>
                   <label className="block text-xs font-medium text-slate-500 mb-1">W (cm)</label>
                   <input type="number" name="width" required min="1" onChange={handleChange} className="w-full px-2 py-2 border border-slate-300 rounded-lg text-sm" placeholder="0" />
                </div>
                <div>
                   <label className="block text-xs font-medium text-slate-500 mb-1">H (cm)</label>
                   <input type="number" name="height" required min="1" onChange={handleChange} className="w-full px-2 py-2 border border-slate-300 rounded-lg text-sm" placeholder="0" />
                </div>
             </div>

             <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">{t.weight} <span className="text-slate-400 text-xs font-normal">{t.optional}</span></label>
                <input type="number" name="weight" step="0.1" onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm" placeholder="e.g. 0.5" />
             </div>

             <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">{t.units} <span className="text-slate-400 text-xs font-normal">{t.optional}</span></label>
                <input type="number" name="unitsPerCbm" onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm" placeholder="e.g. 500" />
                <p className="text-xs text-slate-400 mt-1">{t.unitsDesc}</p>
             </div>

             <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center items-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : t.calculate}
              </button>
          </form>
        </div>

        {/* Results Section */}
        <div className="md:col-span-2 space-y-6">
           {!result && !isLoading && (
             <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-xl p-8 flex flex-col items-center justify-center text-center h-full min-h-[400px]">
                <Calculator className="w-12 h-12 text-slate-300 mb-3" />
                <h3 className="text-lg font-medium text-slate-900">{t.ready}</h3>
                <p className="text-slate-500">{t.readyDesc}</p>
             </div>
           )}

           {isLoading && (
              <div className="bg-white border border-slate-200 rounded-xl p-12 flex flex-col items-center justify-center text-center h-full min-h-[400px]">
                 <Loader2 className="w-10 h-10 text-blue-600 animate-spin mb-4" />
                 <h3 className="text-lg font-medium text-slate-900">{t.analyzing}</h3>
                 <p className="text-slate-500 mt-2">{t.analyzingDesc}</p>
              </div>
           )}

           {result && (
             <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Sea Freight */}
                  <div className="bg-white p-6 rounded-xl shadow-sm border border-blue-100 relative overflow-hidden">
                     <div className="absolute top-0 right-0 p-4 opacity-10">
                        <Ship className="w-24 h-24 text-blue-600" />
                     </div>
                     <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center">
                        <Ship className="w-5 h-5 mr-2 text-blue-600" />
                        {t.sea}
                     </h3>
                     <div className="space-y-4 relative z-10">
                        <div>
                           <p className="text-sm text-slate-500">{t.costCbm}</p>
                           <p className="text-xl font-bold text-slate-900">{result.seaFreightCost.perCbm}</p>
                        </div>
                        <div>
                           <p className="text-sm text-slate-500">{t.costUnit}</p>
                           <p className="text-xl font-bold text-blue-600">{result.seaFreightCost.perUnit}</p>
                        </div>
                     </div>
                  </div>

                  {/* Air Freight */}
                  <div className="bg-white p-6 rounded-xl shadow-sm border border-sky-100 relative overflow-hidden">
                     <div className="absolute top-0 right-0 p-4 opacity-10">
                        <Plane className="w-24 h-24 text-sky-600" />
                     </div>
                     <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center">
                        <Plane className="w-5 h-5 mr-2 text-sky-600" />
                        {t.air}
                     </h3>
                     <div className="space-y-4 relative z-10">
                        <div>
                           <p className="text-sm text-slate-500">{t.costKg}</p>
                           <p className="text-xl font-bold text-slate-900">{result.airFreightCost.perKg}</p>
                        </div>
                        <div>
                           <p className="text-sm text-slate-500">{t.costUnit}</p>
                           <p className="text-xl font-bold text-sky-600">{result.airFreightCost.perUnit}</p>
                        </div>
                     </div>
                  </div>
                </div>

                {/* Advice */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                   <h3 className="text-lg font-semibold text-slate-900 mb-3 flex items-center">
                      <Info className="w-5 h-5 mr-2 text-amber-500" />
                      {t.advice}
                   </h3>
                   <p className="text-slate-700 text-sm leading-relaxed">{result.advice}</p>
                </div>

                {/* Warehouses */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                   <h3 className="text-lg font-semibold text-slate-900 mb-3 flex items-center">
                      <Warehouse className="w-5 h-5 mr-2 text-emerald-600" />
                      {t.warehouse}
                   </h3>
                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {result.warehouses.map((wh, idx) => (
                         <div key={idx} className="p-3 bg-slate-50 rounded-lg border border-slate-100 flex items-center">
                            <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center mr-3 text-emerald-600 font-bold text-sm">
                               {idx + 1}
                            </div>
                            <span className="font-medium text-slate-800">{wh}</span>
                         </div>
                      ))}
                   </div>
                </div>
             </>
           )}
        </div>
      </div>
    </div>
  );
};--- START OF FILE src/components/TikTokDiscover.tsx ---

import React, { useState } from 'react';
import { Search, Loader2, Link as LinkIcon, User, Eye, Users, Filter } from 'lucide-react';
import { TikTokShopLink, TikTokCreator, TikTokDiscoveryFilters, Language } from '../types';
import { searchTikTokShop, discoverTikTokCreators } from '../services/geminiService';
import { translations } from '../translations';

interface Props {
  language: Language;
}

export const TikTokDiscover: React.FC<Props> = ({ language }) => {
  const t = translations[language].tiktok;
  
  // State for Shop Search
  const [shopName, setShopName] = useState('');
  const [shopLinks, setShopLinks] = useState<TikTokShopLink[]>([]);
  const [isSearchingShop, setIsSearchingShop] = useState(false);
  const [hasSearchedShop, setHasSearchedShop] = useState(false);

  // State for Creator Discovery
  const [filters, setFilters] = useState<TikTokDiscoveryFilters>({
    topic: '',
    views: '1-10K',
    followers: '<10K'
  });
  const [creators, setCreators] = useState<TikTokCreator[]>([]);
  const [isDiscovering, setIsDiscovering] = useState(false);
  const [hasDiscovered, setHasDiscovered] = useState(false);

  // Handlers
  const handleShopSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!shopName.trim()) return;

    setIsSearchingShop(true);
    setShopLinks([]);
    setHasSearchedShop(false);
    
    try {
      const links = await searchTikTokShop(shopName);
      setShopLinks(links);
    } catch (error) {
      console.error(error);
    } finally {
      setIsSearchingShop(false);
      setHasSearchedShop(true);
    }
  };

  const handleDiscover = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!filters.topic.trim()) {
        alert("Please enter a topic/category to discover creators.");
        return;
    }

    setIsDiscovering(true);
    setCreators([]);
    setHasDiscovered(false);

    try {
      const results = await discoverTikTokCreators(filters, language);
      setCreators(results);
    } catch (error) {
      console.error(error);
    } finally {
      setIsDiscovering(false);
      setHasDiscovered(true);
    }
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    setFilters(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div className="max-w-6xl mx-auto space-y-10 animate-fade-in">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-slate-900">{t.title}</h1>
        <p className="mt-2 text-slate-600">{t.subtitle}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Left Column: Shop Search */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 h-full">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-pink-500 p-2 rounded-lg">
                <Search className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-xl font-semibold text-slate-900">{t.brandSearch}</h2>
            </div>

            <form onSubmit={handleShopSearch} className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">{t.brandLabel}</label>
                <div className="relative">
                  <input
                    type="text"
                    value={shopName}
                    onChange={(e) => setShopName(e.target.value)}
                    placeholder={t.brandPlaceholder}
                    className="w-full px-4 py-2 pr-12 border border-slate-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none"
                  />
                  <button 
                    type="submit"
                    disabled={isSearchingShop || !shopName.trim()}
                    className="absolute right-1 top-1 bottom-1 bg-slate-100 hover:bg-slate-200 text-slate-600 px-3 rounded-md transition-colors disabled:opacity-50"
                  >
                    {isSearchingShop ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                  </button>
                </div>
                <p className="text-xs text-slate-400 mt-1">{t.brandDesc}</p>
              </div>
            </form>

            <div className="space-y-3 max-h-[500px] overflow-y-auto custom-scrollbar">
              {hasSearchedShop && shopLinks.length === 0 && (
                <div className="text-center text-slate-500 text-sm py-6 px-4">
                  <p className="font-medium text-slate-700 mb-1">{t.noResults}</p>
                  <p className="text-xs mb-2">{t.searchedFor} "{shopName} tiktok"</p>
                  <div className="text-xs bg-slate-50 p-3 rounded-lg text-left">
                     <p className="font-semibold mb-1">{t.tips}</p>
                     <ul className="list-disc list-inside space-y-1">
                        <li>{t.tip1}</li>
                        <li>{t.tip2}</li>
                        <li>{t.tip3}</li>
                     </ul>
                  </div>
                </div>
              )}
              
              {shopLinks.map((link, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-slate-50 border border-slate-100 rounded-lg hover:bg-slate-100 transition-colors group">
                  <div className="mt-1 min-w-[20px]">
                     <LinkIcon className="w-4 h-4 text-slate-400 group-hover:text-pink-500 transition-colors" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <a href={link.url} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-blue-600 hover:underline truncate block">
                      {link.title}
                    </a>
                    <p className="text-xs text-slate-400 truncate mt-0.5">{link.url}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Creator Discovery */}
        <div className="space-y-6">
           <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 h-full">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-cyan-500 p-2 rounded-lg">
                <Users className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-xl font-semibold text-slate-900">{t.creatorFinder}</h2>
            </div>

            <form onSubmit={handleDiscover} className="space-y-4 mb-6 p-4 bg-slate-50 rounded-lg border border-slate-200">
               <div className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-2">
                  <Filter className="w-4 h-4" /> {t.filter}
               </div>
               
               <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">{t.topic}</label>
                  <input 
                    type="text"
                    name="topic"
                    value={filters.topic}
                    onChange={handleFilterChange}
                    placeholder={t.topicPlaceholder}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm"
                  />
               </div>

               <div className="grid grid-cols-2 gap-4">
                 <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1">{t.avgViews}</label>
                    <select 
                        name="views" 
                        value={filters.views} 
                        onChange={handleFilterChange}
                        className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm bg-white"
                    >
                        <option value="1-10K">1K - 10K</option>
                        <option value="10K-30K">10K - 30K</option>
                        <option value="30K+">30K+</option>
                    </select>
                 </div>
                 <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1">{t.followers}</label>
                    <select 
                        name="followers" 
                        value={filters.followers} 
                        onChange={handleFilterChange}
                        className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm bg-white"
                    >
                        <option value="<10K">&lt; 10K</option>
                        <option value="10K-30K">10K - 30K</option>
                        <option value="30K-50K">30K - 50K</option>
                        <option value="50K+">50K+</option>
                    </select>
                 </div>
               </div>

               <button 
                 type="submit"
                 disabled={isDiscovering}
                 className="w-full mt-2 bg-cyan-600 text-white py-2 rounded-md text-sm font-medium hover:bg-cyan-700 transition-colors disabled:opacity-50 flex justify-center items-center"
               >
                 {isDiscovering ? <Loader2 className="w-4 h-4 animate-spin" /> : t.discover}
               </button>
            </form>

            <div className="space-y-4">
               {hasDiscovered && creators.length === 0 && (
                  <p className="text-center text-slate-500 text-sm">{t.noCreators}</p>
               )}

               {creators.map((creator, idx) => (
                 <div key={idx} className="p-4 border border-slate-200 rounded-lg hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start">
                       <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                             <User className="w-6 h-6 text-slate-400" />
                          </div>
                          <div>
                             <h4 className="font-bold text-slate-900 text-sm">{creator.handle}</h4>
                             <p className="text-xs text-slate-500">{creator.name}</p>
                          </div>
                       </div>
                    </div>
                    
                    <p className="text-xs text-slate-600 mt-3 line-clamp-2">{creator.description}</p>
                    
                    <div className="flex items-center gap-4 mt-3 pt-3 border-t border-slate-100">
                       <div className="flex items-center gap-1 text-xs text-slate-600">
                          <Users className="w-3 h-3 text-cyan-600" />
                          <span className="font-semibold">{creator.followers}</span> {t.followers}
                       </div>
                       <div className="flex items-center gap-1 text-xs text-slate-600">
                          <Eye className="w-3 h-3 text-pink-600" />
                          <span className="font-semibold">{creator.avgViews}</span> {t.avgViews}
                       </div>
                    </div>
                 </div>
               ))}
            </div>
           </div>
        </div>

      </div>
    </div>
  );
};
