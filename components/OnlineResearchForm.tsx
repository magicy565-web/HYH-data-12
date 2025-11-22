
import React, { useState, ChangeEvent } from 'react';
import { Upload, X, Search, Loader2, Globe } from 'lucide-react';
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
    images: [],
  });

  const [errors, setErrors] = useState<{ companyWebsite?: string }>({});

  const validateUrl = (url: string): boolean => {
    if (!url) return true; // Allow empty as it might be optional
    // Comprehensive regex for URL validation
    const pattern = new RegExp(
      '^(https?:\\/\\/)?' + // protocol
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
        '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
        '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
        '(\\#[-a-z\\d_]*)?$', // fragment locator
      'i'
    );
    return !!pattern.test(url);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Real-time validation for website
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
    
    // Final validation check
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
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="p-6 bg-slate-50 border-b border-slate-200">
        <h2 className="text-lg font-semibold text-slate-900">{t.title}</h2>
        <p className="text-sm text-slate-600 mt-1">{t.subtitle}</p>
      </div>
      
      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Company Name */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">{t.companyName}</label>
            <input
              type="text"
              name="companyName"
              required
              value={formData.companyName}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              placeholder="e.g. Global Tech Solutions"
            />
          </div>

           {/* Company Website - NEW FIELD with VALIDATION */}
           <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">{t.companyWebsite} <span className="text-slate-400 text-xs font-normal">{t.optional}</span></label>
            <div className="relative">
              <input
                type="text"
                name="companyWebsite"
                value={formData.companyWebsite || ''}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 outline-none transition-all ${
                  errors.companyWebsite 
                    ? 'border-red-300 focus:ring-red-200 focus:border-red-400' 
                    : 'border-slate-300 focus:ring-blue-500 focus:border-blue-500'
                }`}
                placeholder={t.websitePlaceholder}
              />
              {formData.companyWebsite && !errors.companyWebsite && (
                <div className="absolute right-3 top-2.5 text-green-500">
                  <Globe className="w-4 h-4" />
                </div>
              )}
            </div>
            {errors.companyWebsite && (
              <p className="mt-1 text-xs text-red-500">{errors.companyWebsite}</p>
            )}
          </div>

          {/* Product Name */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">{t.productName}</label>
            <input
              type="text"
              name="productName"
              required
              value={formData.productName}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              placeholder={t.productPlaceholder}
            />
          </div>

          {/* Target Market */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">{t.targetMarket}</label>
            <select
              name="market"
              value={formData.market}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
            >
              {Object.values(TargetMarket).map((market) => (
                <option key={market} value={market}>{t.markets[market]}</option>
              ))}
            </select>
          </div>

          {/* Company Type */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">{t.businessType}</label>
            <select
              name="companyType"
              value={formData.companyType}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
            >
              {Object.values(CompanyType).map((type) => (
                <option key={type} value={type}>{t.types[type]}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Image Upload */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">{t.images}</label>
          <div className="flex items-start space-x-4">
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
                className={`flex flex-col items-center justify-center w-32 h-32 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
                  formData.images.length >= 2 
                    ? 'border-slate-200 bg-slate-50 cursor-not-allowed' 
                    : 'border-slate-300 hover:border-blue-500 hover:bg-blue-50'
                }`}
              >
                <Upload className={`w-8 h-8 mb-2 ${formData.images.length >= 2 ? 'text-slate-300' : 'text-slate-400'}`} />
                <span className="text-xs text-slate-500">{t.upload}</span>
              </label>
            </div>

            {/* Image Previews */}
            <div className="flex space-x-4 overflow-x-auto py-1">
              {formData.images.map((file, index) => (
                <div key={index} className="relative w-32 h-32 rounded-lg overflow-hidden border border-slate-200 shadow-sm group">
                  <img
                    src={URL.createObjectURL(file)}
                    alt={`Preview ${index}`}
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-1 right-1 bg-white/90 p-1 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-4 h-4 text-red-500" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 flex justify-end">
          <button
            type="submit"
            disabled={isLoading || !!errors.companyWebsite}
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
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
