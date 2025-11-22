
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
};
