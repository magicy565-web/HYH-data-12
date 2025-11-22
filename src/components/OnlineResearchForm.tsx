import React, { useState, ChangeEvent, useEffect } from 'react';
import { Upload, X, Search, Loader2, Globe, Target, Tag, DollarSign, Building2, Box } from 'lucide-react';
import { FormData, TargetMarket, CompanyType, Language } from '../types';
import { translations } from '../translations';

interface Props {
  onSubmit: (data: FormData) => void;
  isLoading: boolean;
  language: Language;
}

export const OnlineResearchForm: React.FC<Props> = ({ onSubmit, isLoading, language }) => {
  const t = translations[language].online;
  const [formData, setFormData] = useState<FormData>({
    companyName: '',
    companyWebsite: '',
    market: TargetMarket.UK,
    productName: '',
    companyType: CompanyType.MANUFACTURER,
    targetAudience: '',
    usps: '',
    priceRange: '',
    images: [],
  });

  const [errors, setErrors] = useState<{ companyWebsite?: string }>({});
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

  // Manage Object URLs to prevent memory leaks and rendering instability
  useEffect(() => {
    const newUrls = formData.images.map(file => URL.createObjectURL(file));
    setPreviewUrls(newUrls);

    return () => {
      newUrls.forEach(url => URL.revokeObjectURL(url));
    };
  }, [formData.images]);

  const validateUrl = (url: string): boolean => {
    if (!url) return true; 
    const pattern = new RegExp(
      '^(https?:\\/\\/)?' + 
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + 
        '((\\d{1,3}\\.){3}\\d{1,3}))' + 
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + 
        '(\\?[;&a-z\\d%_.~+=-]*)?' + 
        '(\\#[-a-z\\d_]*)?$', 
      'i'
    );
    return !!pattern.test(url);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (name === 'companyWebsite') {
      if (value && !validateUrl(value)) {
        setErrors((prev) => ({ ...prev, companyWebsite: t.websiteError }));
      } else {
        setErrors((prev) => ({ ...prev, companyWebsite: undefined }));
      }
    }
  };

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      if (formData.images.length + newFiles.length > 2) {
        alert("You can only upload a maximum of 2 images.");
        return;
      }
      setFormData((prev) => ({ ...prev, images: [...prev.images, ...newFiles] }));
    }
  };

  const removeImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.companyWebsite && !validateUrl(formData.companyWebsite)) {
      setErrors((prev) => ({ ...prev, companyWebsite: t.websiteError }));
      return;
    }
    if (formData.images.length === 0) {
        alert("Please upload at least one product image.");
        return;
    }
    onSubmit(formData);
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden transition-all hover:shadow-xl">
      <div className="bg-gradient-to-r from-slate-50 to-white p-8 border-b border-slate-200">
        <h2 className="text-2xl font-bold text-slate-900">{t.title}</h2>
        <p className="text-slate-600 mt-2">{t.subtitle}</p>
      </div>
      
      <form onSubmit={handleSubmit} className="p-8 space-y-8">
        
        {/* Section 1: Company & Market */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-blue-600 flex items-center gap-2">
            <Building2 className="w-4 h-4" />
            {t.sectionCompany}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">{t.companyName}</label>
              <input
                type="text"
                name="companyName"
                required
                value={formData.companyName}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-slate-50 focus:bg-white"
                placeholder="e.g. Global Tech Solutions"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">{t.companyWebsite} <span className="text-slate-400 text-xs font-normal">{t.optional}</span></label>
              <div className="relative">
                <input
                  type="text"
                  name="companyWebsite"
                  value={formData.companyWebsite || ''}
                  onChange={handleChange}
                  className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 outline-none transition-all bg-slate-50 focus:bg-white ${
                    errors.companyWebsite 
                      ? 'border-red-300 focus:ring-red-200 focus:border-red-400' 
                      : 'border-slate-300 focus:ring-blue-500 focus:border-blue-500'
                  }`}
                  placeholder={t.websitePlaceholder}
                />
                {formData.companyWebsite && !errors.companyWebsite && (
                  <div className="absolute right-3 top-3 text-green-500">
                    <Globe className="w-4 h-4" />
                  </div>
                )}
              </div>
              {errors.companyWebsite && (
                <p className="mt-1 text-xs text-red-500">{errors.companyWebsite}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">{t.targetMarket}</label>
              <select
                name="market"
                value={formData.market}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
              >
                {Object.values(TargetMarket).map((market) => (
                  <option key={market} value={market}>{t.markets[market]}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">{t.businessType}</label>
              <select
                name="companyType"
                value={formData.companyType}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
              >
                {Object.values(CompanyType).map((type) => (
                  <option key={type} value={type}>{t.types[type]}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Section 2: Product Strategy */}
        <div className="space-y-4">
           <h3 className="text-sm font-bold uppercase tracking-wider text-blue-600 flex items-center gap-2">
            <Box className="w-4 h-4" />
            {t.sectionProduct}
          </h3>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">{t.productName}</label>
              <input
                type="text"
                name="productName"
                required
                value={formData.productName}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-slate-50 focus:bg-white"
                placeholder={t.productPlaceholder}
              />
            </div>
             <div>
              <label className="block text-sm font-medium text-slate-700 mb-1 flex items-center gap-1">
                 {t.targetAudience} <span className="text-slate-400 text-xs font-normal">{t.optional}</span>
              </label>
              <div className="relative">
                 <Target className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                 <input
                    type="text"
                    name="targetAudience"
                    value={formData.targetAudience || ''}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-slate-50 focus:bg-white"
                    placeholder={t.audiencePlaceholder}
                 />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1 flex items-center gap-1">
                 {t.usps} <span className="text-slate-400 text-xs font-normal">{t.optional}</span>
              </label>
              <div className="relative">
                 <Tag className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                 <input
                    type="text"
                    name="usps"
                    value={formData.usps || ''}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-slate-50 focus:bg-white"
                    placeholder={t.uspsPlaceholder}
                 />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1 flex items-center gap-1">
                 {t.priceRange} <span className="text-slate-400 text-xs font-normal">{t.optional}</span>
              </label>
              <div className="relative">
                 <DollarSign className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                 <input
                    type="text"
                    name="priceRange"
                    value={formData.priceRange || ''}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-slate-50 focus:bg-white"
                    placeholder={t.pricePlaceholder}
                 />
              </div>
            </div>
           </div>
        </div>

        {/* Image Upload */}
        <div className="bg-slate-50 p-6 rounded-xl border border-dashed border-slate-300">
          <label className="block text-sm font-medium text-slate-700 mb-4">{t.images}</label>
          <div className="flex items-start space-x-6">
            <div className="relative flex-shrink-0">
               <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                id="file-upload"
                className="hidden"
                disabled={formData.images.length >= 2}
              />
              <label
                htmlFor="file-upload"
                className={`flex flex-col items-center justify-center w-36 h-36 border-2 border-dashed rounded-xl cursor-pointer transition-all transform hover:scale-105 ${
                  formData.images.length >= 2 
                    ? 'border-slate-200 bg-slate-100 cursor-not-allowed' 
                    : 'border-blue-300 bg-white hover:border-blue-500 hover:bg-blue-50 shadow-sm'
                }`}
              >
                <Upload className={`w-8 h-8 mb-3 ${formData.images.length >= 2 ? 'text-slate-300' : 'text-blue-500'}`} />
                <span className="text-xs font-medium text-slate-600">{t.upload}</span>
              </label>
            </div>
            <div className="flex space-x-4 overflow-x-auto py-2">
              {previewUrls.map((url, index) => (
                <div key={index} className="relative w-36 h-36 rounded-xl overflow-hidden border border-slate-200 shadow-md group bg-white">
                  <img
                    src={url}
                    alt={`Preview ${index}`}
                    className="w-full h-full object-contain"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-2 right-2 bg-white/90 p-1.5 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-all hover:bg-red-50"
                  >
                    <X className="w-4 h-4 text-red-500" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-100 flex justify-end">
          <button
            type="submit"
            disabled={isLoading || !!errors.companyWebsite}
            className="inline-flex items-center px-8 py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-xl hover:from-blue-700 hover:to-indigo-700 focus:ring-4 focus:ring-blue-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                {t.analyzing}
              </>
            ) : (
              <>
                <Search className="w-5 h-5 mr-2" />
                {t.start}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
