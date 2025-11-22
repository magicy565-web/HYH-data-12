
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
};
