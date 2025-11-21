
import React, { useState } from 'react';
import { Plus, Check } from 'lucide-react';
import { useReport } from '../contexts/ReportContext';
import { ReportItemType, Language } from '../types';
import { translations } from '../translations';

interface Props {
  type: ReportItemType;
  title: string;
  data: any;
  language: Language;
  className?: string;
}

export const AddToReportButton: React.FC<Props> = ({ type, title, data, language, className = '' }) => {
  const { addItem } = useReport();
  const [added, setAdded] = useState(false);
  const [showComment, setShowComment] = useState(false);
  const [comment, setComment] = useState('');
  
  const t = translations[language].report;

  const handleAdd = () => {
    addItem({
      type,
      title,
      data,
      comment: comment || undefined
    });
    setAdded(true);
    setShowComment(false);
    
    // Reset added state after 2 seconds
    setTimeout(() => setAdded(false), 2000);
  };

  if (showComment) {
    return (
      <div className={`absolute z-10 bg-white p-3 rounded-lg shadow-xl border border-slate-200 w-64 animate-fade-in ${className}`}>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder={t.commentPlaceholder}
          className="w-full text-xs p-2 border border-slate-300 rounded mb-2 focus:ring-2 focus:ring-blue-500 outline-none"
          rows={3}
        />
        <div className="flex justify-end gap-2">
          <button 
            onClick={() => setShowComment(false)}
            className="text-xs text-slate-500 hover:text-slate-700 px-2 py-1"
          >
            Cancel
          </button>
          <button 
            onClick={handleAdd}
            className="text-xs bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
          >
            Confirm
          </button>
        </div>
      </div>
    );
  }

  return (
    <button
      onClick={() => setShowComment(true)}
      disabled={added}
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all shadow-sm border ${
        added 
          ? 'bg-green-50 text-green-700 border-green-200' 
          : 'bg-white text-slate-600 border-slate-200 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200'
      } ${className}`}
    >
      {added ? (
        <>
          <Check className="w-3.5 h-3.5" />
          {t.added}
        </>
      ) : (
        <>
          <Plus className="w-3.5 h-3.5" />
          {t.addToReport}
        </>
      )}
    </button>
  );
};
