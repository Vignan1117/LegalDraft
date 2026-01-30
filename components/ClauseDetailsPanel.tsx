import React, { useState } from 'react';
import { ClauseDetailsPanelProps, ClauseRiskSeverity, Risk, ReviewStatus } from '../types';
import Button from './Button';
import LoadingSpinner from './LoadingSpinner';

const getSeverityBadgeClass = (severity: string) => {
  switch (severity) {
    case ClauseRiskSeverity.CRITICAL: return 'bg-rose-100 text-rose-800 border-rose-200';
    case ClauseRiskSeverity.HIGH: return 'bg-orange-100 text-orange-800 border-orange-200';
    case ClauseRiskSeverity.MEDIUM: return 'bg-amber-100 text-amber-800 border-amber-200';
    case ClauseRiskSeverity.LOW: return 'bg-indigo-100 text-indigo-800 border-indigo-200';
    default: return 'bg-slate-100 text-slate-800 border-slate-200';
  }
};

const getReviewStatusClass = (status: ReviewStatus) => {
  switch (status) {
    case ReviewStatus.APPROVE: return 'bg-emerald-50 text-emerald-800 border-emerald-100';
    case ReviewStatus.NEEDS_REVISION: return 'bg-amber-50 text-amber-800 border-amber-100';
    case ReviewStatus.HIGH_RISK: return 'bg-rose-50 text-rose-800 border-rose-100';
    default: return 'bg-slate-50 text-slate-800 border-slate-100';
  }
};

const ClauseDetailsPanel: React.FC<ClauseDetailsPanelProps> = ({
  clause,
  onExplainClause,
  onAnalyzeClause,
  onReviewClause,
  onStandardizeClause,
  onApplyStandardizedText,
  onRegenerateClause,
  explaining,
  analyzing,
  reviewing,
  standardizing,
  regenerating,
  onClose,
}) => {
  const [regenerationPrompt, setRegenerationPrompt] = useState<string>('');

  if (!clause) return null;

  const handleRegenerate = () => {
    if (clause && regenerationPrompt.trim()) {
      onRegenerateClause(clause, regenerationPrompt);
    }
  };

  const isBusy = explaining || analyzing || reviewing || regenerating || standardizing;

  return (
    <div className="fixed top-0 right-0 h-full w-[400px] bg-white/80 backdrop-blur-xl border-l border-slate-200 shadow-2xl z-50 flex flex-col animate-in slide-in-from-right duration-300">
      {/* Header */}
      <div className="flex justify-between items-center p-6 border-b border-slate-200 bg-white/40 sticky top-0 z-10">
        <div>
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-widest">Clause Inspection</h2>
          <p className="text-[10px] text-slate-500 font-mono mt-0.5">ID: {clause.id}</p>
        </div>
        <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400 hover:text-slate-900">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
        {/* Source Text Section */}
        <section>
          <div className="flex items-center gap-2 mb-3">
             <div className="w-1.5 h-1.5 rounded-full bg-indigo-500"></div>
             <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Source Context</h3>
          </div>
          <div className="bg-slate-900 rounded-xl p-4 shadow-lg">
             <h4 className="text-white font-bold text-sm mb-2">{clause.heading}</h4>
             <p className="text-xs text-slate-300 leading-relaxed font-serif italic">"{clause.text}"</p>
          </div>
        </section>

        {/* Action Center */}
        <section className="bg-slate-50 rounded-2xl p-4 border border-slate-200">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-widest mb-4 flex items-center gap-2">
            <svg className="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
            AI Actions
          </h3>
          <div className="grid grid-cols-2 gap-2">
            <Button onClick={() => onExplainClause(clause)} loading={explaining} disabled={isBusy} variant="secondary" className="text-[10px] py-2 border border-slate-200 bg-white hover:bg-indigo-50 hover:text-indigo-700">
              Explain
            </Button>
            <Button onClick={() => onAnalyzeClause(clause)} loading={analyzing} disabled={isBusy} variant="secondary" className="text-[10px] py-2 border border-slate-200 bg-white hover:bg-rose-50 hover:text-rose-700">
              Analyze
            </Button>
            <Button onClick={() => onReviewClause(clause)} loading={reviewing} disabled={isBusy} variant="secondary" className="text-[10px] py-2 border border-slate-200 bg-white hover:bg-emerald-50 hover:text-emerald-700">
              Review
            </Button>
            <Button onClick={() => onStandardizeClause(clause)} loading={standardizing} disabled={isBusy} variant="secondary" className="text-[10px] py-2 border border-slate-200 bg-white hover:bg-amber-50 hover:text-amber-700">
              Normalize
            </Button>
          </div>
        </section>

        {isBusy && (
          <div className="py-4 px-6 bg-indigo-600 text-white rounded-xl animate-pulse text-xs font-bold flex items-center justify-center gap-3 shadow-lg shadow-indigo-500/20">
             <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
             Legal Intelligence Processing...
          </div>
        )}

        {/* Content Displays */}
        <div className="space-y-6">
          {clause.review && !reviewing && (
            <div className={`p-4 border-2 rounded-2xl shadow-sm ${getReviewStatusClass(clause.review.status)}`}>
              <div className="flex items-center gap-2 mb-2">
                <span className={`w-2 h-2 rounded-full ${clause.review.status === ReviewStatus.APPROVE ? 'bg-emerald-500' : 'bg-rose-500'}`}></span>
                <h3 className="font-bold text-xs uppercase tracking-widest">{clause.review.status} Recommendation</h3>
              </div>
              <p className="text-xs font-medium mb-3 leading-relaxed">{clause.review.reason}</p>
              <div className="p-3 bg-white/50 rounded-xl border border-white/50">
                 <p className="text-[10px] font-bold uppercase opacity-50 mb-1">Internal Note</p>
                 <p className="text-[11px] italic text-slate-600">{clause.review.reviewerNotes}</p>
              </div>
            </div>
          )}

          {clause.standardizedText && !standardizing && (
            <div className="p-5 bg-indigo-600 rounded-2xl shadow-xl shadow-indigo-500/20 text-white relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-125 transition-transform">
                  <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"></path></svg>
               </div>
               <h3 className="text-[10px] font-bold uppercase tracking-widest opacity-70 mb-2">Standardized Draft</h3>
               <p className="text-xs leading-relaxed font-serif italic mb-4">"{clause.standardizedText}"</p>
               <Button onClick={() => onApplyStandardizedText(clause, clause.standardizedText!)} className="w-full bg-white text-indigo-600 hover:bg-slate-100 py-1.5 text-xs rounded-lg">
                  Apply Draft to Agreement
               </Button>
            </div>
          )}

          {clause.explanation && !explaining && (
            <div className="p-5 bg-white border border-slate-200 rounded-2xl shadow-sm space-y-4">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-widest flex items-center gap-2">
                 <svg className="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                 Plain English Insight
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">{clause.explanation}</p>
              {clause.implications && (
                <div className="pt-3 border-t border-slate-100">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Key Implications</p>
                  <ul className="space-y-1.5">
                    {clause.implications.map((imp, i) => (
                      <li key={i} className="text-[11px] text-slate-500 flex items-start gap-2">
                        <span className="mt-1 text-emerald-500">•</span>
                        {imp}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {clause.risks && clause.risks.length > 0 && !analyzing && (
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-rose-600 uppercase tracking-widest px-1">Detected Risks ({clause.risks.length})</h3>
              {clause.risks.map((risk) => (
                <div key={risk.id} className={`p-4 border-l-4 rounded-r-xl shadow-sm ${getSeverityBadgeClass(risk.severity)}`}>
                   <div className="flex justify-between items-center mb-2">
                      <span className="text-[10px] font-bold uppercase tracking-widest opacity-60">Severity: {risk.severity}</span>
                   </div>
                   <p className="text-xs font-bold mb-2 leading-tight">{risk.description}</p>
                   <div className="flex items-start gap-2 text-[10px] opacity-70 italic">
                      <span className="font-bold">Recommendation:</span>
                      <span>{risk.recommendedAction}</span>
                   </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Regeneration Interface */}
        <section className="bg-slate-900 rounded-2xl p-5 shadow-inner mt-8">
          <h3 className="text-xs font-bold text-white uppercase tracking-widest mb-4 flex items-center gap-2">
            <svg className="w-4 h-4 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
            Refine with AI
          </h3>
          <textarea
            className="w-full bg-slate-800 border-none text-white text-xs p-4 rounded-xl focus:ring-2 focus:ring-indigo-500 placeholder-slate-500 resize-none mb-3"
            rows={4}
            placeholder="Tell AI how to adjust this clause... (e.g., 'Make it more protective for the landlord')"
            value={regenerationPrompt}
            onChange={(e) => setRegenerationPrompt(e.target.value)}
          />
          <Button 
            onClick={handleRegenerate} 
            loading={regenerating} 
            disabled={!regenerationPrompt.trim() || isBusy} 
            className="w-full bg-indigo-500 text-white border-none py-2 text-xs shadow-lg shadow-indigo-500/10"
          >
            Forge New Version
          </Button>
        </section>
      </div>

      <div className="p-4 bg-slate-50 border-t border-slate-200 text-center">
         <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Interactive Drafting Session</p>
      </div>
    </div>
  );
};

export default ClauseDetailsPanel;