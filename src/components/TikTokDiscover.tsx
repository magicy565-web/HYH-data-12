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
