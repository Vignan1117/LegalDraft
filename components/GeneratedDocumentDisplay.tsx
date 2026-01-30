import React from 'react';
import { GeneratedDocumentDisplayProps, Clause, Risk, MissingClause, DetectedConflict, OverallRiskAssessment, RiskCategory, ReviewStatus } from '../types';
import LoadingSpinner from './LoadingSpinner';
import Alert from './Alert';
import Button from './Button';

const getSeverityClass = (severity: string) => {
  switch (severity) {
    case 'CRITICAL': return 'text-rose-700 bg-rose-50 border-rose-200';
    case 'HIGH': return 'text-orange-700 bg-orange-50 border-orange-200';
    case 'MEDIUM': return 'text-amber-700 bg-amber-50 border-amber-200';
    case 'LOW': return 'text-indigo-700 bg-indigo-50 border-indigo-200';
    default: return 'text-slate-700 bg-slate-50 border-slate-200';
  }
};

const getReviewStatusColor = (status?: ReviewStatus) => {
  switch (status) {
    case ReviewStatus.APPROVE: return 'border-emerald-500 bg-emerald-50/30';
    case ReviewStatus.NEEDS_REVISION: return 'border-amber-500 bg-amber-50/30';
    case ReviewStatus.HIGH_RISK: return 'border-rose-500 bg-rose-50/30';
    default: return 'border-transparent';
  }
};

const getOverallRiskCategoryClass = (category: RiskCategory) => {
  switch (category) {
    case RiskCategory.HIGH: return 'bg-rose-600 text-white';
    case RiskCategory.MEDIUM: return 'bg-amber-500 text-white';
    case RiskCategory.LOW: return 'bg-emerald-600 text-white';
    default: return 'bg-slate-500 text-white';
  }
};

const GeneratedDocumentDisplay: React.FC<GeneratedDocumentDisplayProps> = ({
  document,
  onClauseSelect,
  selectedClauseId,
  loading,
  onAnalyzeDocument,
  loadingAnalysis,
  onDetectConflicts,
  loadingConflicts,
  onAssessOverallRisk,
  loadingOverallRiskAssessment
}) => {
  if (loading) {
    return (
      <div className="h-[600px] flex items-center justify-center bg-white rounded-2xl border border-slate-200 shadow-sm">
        <LoadingSpinner message="Forging legal binding..." />
      </div>
    );
  }

  if (!document) {
    return (
      <div className="h-[600px] flex flex-col items-center justify-center bg-white rounded-2xl border-2 border-dashed border-slate-200 text-center p-12">
        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
          <svg className="w-8 h-8 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
        </div>
        <h3 className="text-xl font-bold text-slate-800 mb-2">Awaiting Generation</h3>
        <p className="text-slate-500 max-w-sm">Configure the parameters on the left and click "Generate Agreement" to create your legally grounded document.</p>
      </div>
    );
  }

  const isAnyAnalysisLoading = loadingAnalysis || loadingConflicts || loadingOverallRiskAssessment;

  return (
    <div className="space-y-6">
      {/* Action Toolbar */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 px-3 py-1 bg-slate-50 rounded-lg border border-slate-100">
           <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Draft ID</span>
           <span className="text-xs font-mono font-bold text-slate-700">{document.documentId.slice(-8)}</span>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={() => onAnalyzeDocument(document.documentId, document.fullText, document.documentType)} loading={loadingAnalysis} disabled={isAnyAnalysisLoading} variant="primary" className="text-xs py-1.5 px-4 rounded-lg">
             Risk Scan
          </Button>
          <Button onClick={() => onDetectConflicts(document.documentId, document.fullText, document.documentType)} loading={loadingConflicts} disabled={isAnyAnalysisLoading} variant="secondary" className="text-xs py-1.5 px-4 rounded-lg">
             Conflicts
          </Button>
          <Button onClick={() => onAssessOverallRisk(document.documentId, document.fullText, document.documentType)} loading={loadingOverallRiskAssessment} disabled={isAnyAnalysisLoading} variant="secondary" className="text-xs py-1.5 px-4 rounded-lg">
             Score Card
          </Button>
        </div>
      </div>

      {/* Analytics Overlays */}
      {(document.overallRisks.length > 0 || document.missingClauses.length > 0) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {document.overallRisks.length > 0 && (
            <div className="bg-white rounded-xl border border-rose-100 p-4 shadow-sm">
              <h3 className="text-xs font-bold text-rose-800 uppercase tracking-wider mb-3 flex items-center gap-2">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M8.257 3.099c.765-1.306 2.583-1.306 3.348 0l.861 1.472A3 3 0 0114 6.574v.852c0 .991.806 1.797 1.797 1.797L17 9.223a3 3 0 010 5.554l-1.203.626c-.99.516-1.796 1.322-1.797 2.313v.852c0 .991-.806 1.797-1.797 1.797h-.852c-.99-.001-1.797-.807-2.313-1.797L10 18.257a3 3 0 01-5.554 0l-.626-1.203c-.516-.99-.807-1.796-1.797-1.797h-.852c-.991 0-1.797-.806-1.797-1.797v-.852c-.001-.991.805-1.797 1.797-1.797L3 9.223a3 3 0 010-5.554l1.203-.626c.99-.516 1.796-1.322 1.797-2.313V3.099zM10 15a1 1 0 100-2 1 1 0 000 2zm0-8a1 1 0 00-1 1v3a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd"></path></svg>
                Draft Issues ({document.overallRisks.length})
              </h3>
              <div className="space-y-2 max-h-[120px] overflow-y-auto custom-scrollbar pr-2">
                {document.overallRisks.map((risk) => (
                  <div key={risk.id} className={`text-[10px] p-2 rounded-lg border ${getSeverityClass(risk.severity)}`}>
                    <p className="font-bold mb-0.5">{risk.description}</p>
                    <p className="opacity-80">Rec: {risk.recommendedAction}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
          {document.missingClauses.length > 0 && (
            <div className="bg-white rounded-xl border border-amber-100 p-4 shadow-sm">
              <h3 className="text-xs font-bold text-amber-800 uppercase tracking-wider mb-3 flex items-center gap-2">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"></path></svg>
                Gaps Found ({document.missingClauses.length})
              </h3>
              <div className="space-y-2 max-h-[120px] overflow-y-auto custom-scrollbar pr-2">
                {document.missingClauses.map((mc) => (
                  <div key={mc.id} className="text-[10px] p-2 rounded-lg bg-amber-50 text-amber-800 border border-amber-100">
                    <p className="font-bold">{mc.name}</p>
                    <p className="opacity-80">{mc.reasonForInclusion}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {document.overallRiskAssessment && (
        <div className="bg-slate-900 rounded-xl p-5 text-white flex items-center gap-6 shadow-xl shadow-slate-200">
          <div className="flex flex-col items-center">
            <span className="text-[10px] font-bold opacity-50 uppercase tracking-widest mb-1">Score</span>
            <div className={`w-14 h-14 rounded-full border-4 flex items-center justify-center font-bold text-xl ${document.overallRiskAssessment.score > 70 ? 'border-rose-500 text-rose-500' : 'border-emerald-500 text-emerald-500'}`}>
              {document.overallRiskAssessment.score}
            </div>
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h4 className="text-sm font-bold uppercase tracking-tight">Risk Category:</h4>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${getOverallRiskCategoryClass(document.overallRiskAssessment.category)}`}>
                {document.overallRiskAssessment.category}
              </span>
            </div>
            <p className="text-xs text-slate-300 italic">"{document.overallRiskAssessment.executiveSummary}"</p>
          </div>
        </div>
      )}

      {/* The Paper Document */}
      <div className="bg-white p-12 md:p-20 paper-shadow rounded-sm min-h-[1000px] relative overflow-hidden">
        {/* Paper Texture Overlay */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/natural-paper.png')]"></div>
        
        {/* Header Ribbon */}
        <div className="absolute top-0 right-0 w-32 h-32 overflow-hidden pointer-events-none">
          <div className="absolute top-6 -right-10 w-44 bg-slate-100 text-slate-400 py-1 text-center font-bold text-[8px] uppercase tracking-widest rotate-45 border-y border-slate-200">
            DRAFT VERSION
          </div>
        </div>

        <div className="max-w-2xl mx-auto space-y-12">
          {/* Document Title Section */}
          <div className="text-center space-y-4 border-b-2 border-slate-100 pb-10">
            <h1 className="text-3xl font-serif font-bold text-slate-900 tracking-tight uppercase underline decoration-double underline-offset-8">
              {document.documentType}
            </h1>
            <p className="text-xs font-serif italic text-slate-500">
              Generated via LegalDraftAI Engine • Grounded in Indian Law
            </p>
          </div>

          <div className="font-serif text-[15px] leading-[1.8] text-slate-800 space-y-8">
            {document.clauses.map((clause) => (
              <div 
                key={clause.id} 
                onClick={() => onClauseSelect(clause)}
                className={`group relative p-4 -mx-4 rounded-xl cursor-pointer transition-all duration-300 border-2 ${selectedClauseId === clause.id ? 'bg-indigo-50/50 border-indigo-200 ring-4 ring-indigo-50' : 'hover:bg-slate-50 border-transparent hover:border-slate-100'} ${getReviewStatusColor(clause.review?.status)}`}
              >
                {/* Status Indicator Dot */}
                {clause.review && (
                  <div className={`absolute -left-2 top-6 w-2.5 h-2.5 rounded-full border-2 border-white shadow-sm ${clause.review.status === ReviewStatus.APPROVE ? 'bg-emerald-500' : clause.review.status === ReviewStatus.HIGH_RISK ? 'bg-rose-500' : 'bg-amber-500'}`}></div>
                )}
                
                <h3 className="font-bold text-slate-900 text-lg mb-3 tracking-tight group-hover:text-indigo-600 transition-colors">
                  {clause.heading}
                </h3>
                <p className="whitespace-pre-wrap text-slate-700">
                  {clause.text}
                </p>
                
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                   <div className="bg-white px-2 py-1 rounded border border-slate-200 text-[10px] font-bold text-indigo-600 shadow-sm">
                      Inspect Clause
                   </div>
                </div>
              </div>
            ))}
          </div>

          {/* Signature Placeholder */}
          <div className="mt-20 pt-10 border-t border-slate-100 grid grid-cols-2 gap-20">
            <div className="space-y-4">
               <div className="border-b-2 border-slate-200 w-full h-12"></div>
               <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">For Party A</p>
            </div>
            <div className="space-y-4">
               <div className="border-b-2 border-slate-200 w-full h-12"></div>
               <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">For Party B</p>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 bg-slate-900 rounded-xl flex items-center gap-4 text-white">
        <div className="w-10 h-10 rounded-lg bg-indigo-500/20 flex items-center justify-center text-indigo-400">
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z"></path></svg>
        </div>
        <div className="flex-1">
          <h4 className="text-[10px] font-bold uppercase tracking-widest opacity-60 mb-0.5">Editor Note</h4>
          <p className="text-xs font-medium text-slate-300">Click any clause to explain, analyze risks, or regenerate with custom AI prompts.</p>
        </div>
      </div>
    </div>
  );
};

export default GeneratedDocumentDisplay;