import React from 'react';
import { Construction } from 'lucide-react';

export const TradeResearchPlaceholder: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] bg-white rounded-xl border border-dashed border-slate-300 p-12 text-center">
      <div className="bg-amber-50 p-4 rounded-full mb-4">
        <Construction className="w-8 h-8 text-amber-500" />
      </div>
      <h3 className="text-xl font-semibold text-slate-900 mb-2">Trade Research Module</h3>
      <p className="text-slate-500 max-w-md">
        The offline trade research module is currently under development. This section will focus on trade shows, distributors, and physical retail presence in the target market.
      </p>
    </div>
  );
};