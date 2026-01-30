import React, { useState, useCallback, useEffect } from 'react';
import {
  DocumentType,
  DocumentGenerationResponse,
  NDAGenerationParams,
  EmploymentAgreementParams,
  RentalAgreementParams,
  LegalNoticeParams,
  AllDocumentParams,
  Clause
} from './types';
import { apiService } from './services/apiService';
import DocumentTypeSelector from './components/DocumentTypeSelector';
import FormInputs from './components/FormInputs';
import GeneratedDocumentDisplay from './components/GeneratedDocumentDisplay';
import ClauseDetailsPanel from './components/ClauseDetailsPanel';
import Button from './components/Button';
import Alert from './components/Alert';

function App() {
  const [selectedDocumentType, setSelectedDocumentType] = useState<DocumentType>(DocumentType.NDA);
  const [generationParams, setGenerationParams] = useState<AllDocumentParams>({
    documentType: DocumentType.NDA,
    effectiveDate: new Date().toISOString().split('T')[0],
    parties: { partyA: 'InnovateCorp Pvt. Ltd.', partyB: 'TechSolutions India' },
    confidentialInfoDefinition: 'business plans, software code',
    termMonths: 24
  });
  const [generatedDocument, setGeneratedDocument] = useState<DocumentGenerationResponse | null>(null);
  const [loadingGeneration, setLoadingGeneration] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [selectedClause, setSelectedClause] = useState<Clause | null>(null);
  const [loadingExplanation, setLoadingExplanation] = useState<boolean>(false);
  const [loadingAnalysis, setLoadingAnalysis] = useState<boolean>(false);
  const [loadingReview, setLoadingReview] = useState<boolean>(false);
  const [loadingStandardization, setLoadingStandardization] = useState<boolean>(false);
  const [loadingDocumentAnalysis, setLoadingDocumentAnalysis] = useState<boolean>(false);
  const [loadingConflicts, setLoadingConflicts] = useState<boolean>(false);
  const [loadingRegeneration, setLoadingRegeneration] = useState<boolean>(false);
  const [loadingOverallRiskAssessment, setLoadingOverallRiskAssessment] = useState<boolean>(false);

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    let newParams: AllDocumentParams;

    switch (selectedDocumentType) {
      case DocumentType.NDA:
        newParams = {
          documentType: DocumentType.NDA,
          effectiveDate: today,
          parties: { partyA: 'InnovateCorp Pvt. Ltd.', partyB: 'TechSolutions India' },
          confidentialInfoDefinition: 'business plans, software code',
          termMonths: 24
        };
        break;
      case DocumentType.EMPLOYMENT_AGREEMENT:
        newParams = {
          documentType: DocumentType.EMPLOYMENT_AGREEMENT,
          effectiveDate: today,
          parties: { employer: 'Global Solutions Inc.', employee: 'Priya Sharma' },
          jobTitle: 'Software Engineer',
          startDate: today,
          salary: 850000,
          probationPeriodMonths: 6
        };
        break;
      default:
        newParams = { ...generationParams, documentType: selectedDocumentType };
    }
    setGenerationParams(newParams);
    setGeneratedDocument(null);
    setSelectedClause(null);
  }, [selectedDocumentType]);

  const handleGenerateDocument = useCallback(async () => {
    setError(null);
    setLoadingGeneration(true);
    setGeneratedDocument(null);
    setSelectedClause(null);
    try {
      const doc = await apiService.generateDocument(generationParams);
      setGeneratedDocument(doc);
    } catch (err) {
      setError("Failed to generate document.");
    } finally {
      setLoadingGeneration(false);
    }
  }, [generationParams]);

  const handleAnalyzeDocumentOverall = useCallback(async (id: string, text: string, type: DocumentType) => {
    setError(null);
    setLoadingDocumentAnalysis(true);
    try {
      const response = await apiService.analyzeDocument({ documentId: id, fullText: text, documentType: type });
      setGeneratedDocument(prev => prev ? { ...prev, overallRisks: response.risks, missingClauses: response.missingClauses } : null);
    } catch (err) {
      setError("Analysis failed.");
    } finally {
      setLoadingDocumentAnalysis(false);
    }
  }, []);

  const handleDetectConflictsOverall = useCallback(async (id: string, text: string, type: DocumentType) => {
    setError(null);
    setLoadingConflicts(true);
    try {
      const response = await apiService.detectConflicts({ documentId: id, fullText: text, documentType: type });
      setGeneratedDocument(prev => prev ? { ...prev, conflicts: response.conflicts } : null);
    } catch (err) {
      setError("Conflict detection failed.");
    } finally {
      setLoadingConflicts(false);
    }
  }, []);

  const handleAssessOverallRisk = useCallback(async (id: string, text: string, type: DocumentType) => {
    setError(null);
    setLoadingOverallRiskAssessment(true);
    try {
      const response = await apiService.assessOverallRisk({ documentId: id, fullText: text, documentType: type });
      setGeneratedDocument(prev => prev ? { ...prev, overallRiskAssessment: response.overallRiskAssessment } : null);
    } catch (err) {
      setError("Risk assessment failed.");
    } finally {
      setLoadingOverallRiskAssessment(false);
    }
  }, []);

  const handleSelectClause = useCallback((clause: Clause) => {
    setSelectedClause(clause);
  }, []);

  const handleExplainClause = useCallback(async (clause: Clause) => {
    setError(null);
    setLoadingExplanation(true);
    try {
      if (generatedDocument) {
        const response = await apiService.explainClause({
          documentId: generatedDocument.documentId,
          clauseId: clause.id,
          clauseText: clause.text,
          documentType: generatedDocument.documentType
        });
        const updatedClause = { ...clause, explanation: response.explanation, keyTerms: response.keyTerms, implications: response.implications };
        setSelectedClause(updatedClause);
        setGeneratedDocument(prev => prev ? {
          ...prev,
          clauses: prev.clauses.map(c => c.id === clause.id ? updatedClause : c)
        } : null);
      }
    } catch (err) {
      setError("Explanation failed.");
    } finally {
      setLoadingExplanation(false);
    }
  }, [generatedDocument]);

  const handleAnalyzeClause = useCallback(async (clause: Clause) => {
    setError(null);
    setLoadingAnalysis(true);
    try {
      if (generatedDocument) {
        const response = await apiService.analyzeClause({
          documentId: generatedDocument.documentId,
          clauseId: clause.id,
          clauseText: clause.text,
          documentType: generatedDocument.documentType
        });
        const updatedClause = { ...clause, risks: response.risks, missingClauses: response.missingClauses };
        setSelectedClause(updatedClause);
        setGeneratedDocument(prev => prev ? {
          ...prev,
          clauses: prev.clauses.map(c => c.id === clause.id ? updatedClause : c)
        } : null);
      }
    } catch (err) {
      setError("Clause analysis failed.");
    } finally {
      setLoadingAnalysis(false);
    }
  }, [generatedDocument]);

  const handleReviewClause = useCallback(async (clause: Clause) => {
    setError(null);
    setLoadingReview(true);
    try {
      const response = await apiService.reviewClause({ clauseText: clause.text });
      const updatedClause = { ...clause, review: response };
      setSelectedClause(updatedClause);
      setGeneratedDocument(prev => prev ? {
        ...prev,
        clauses: prev.clauses.map(c => c.id === clause.id ? updatedClause : c)
      } : null);
    } catch (err) {
      setError("Clause review failed.");
    } finally {
      setLoadingReview(false);
    }
  }, []);

  const handleStandardizeClause = useCallback(async (clause: Clause) => {
    setError(null);
    setLoadingStandardization(true);
    try {
      const response = await apiService.standardizeClause({ clauseText: clause.text });
      const updatedClause = { ...clause, standardizedText: response.normalizedClauseText };
      setSelectedClause(updatedClause);
      setGeneratedDocument(prev => prev ? {
        ...prev,
        clauses: prev.clauses.map(c => c.id === clause.id ? updatedClause : c)
      } : null);
    } catch (err) {
      setError("Clause standardization failed.");
    } finally {
      setLoadingStandardization(false);
    }
  }, []);

  const handleApplyStandardizedText = useCallback((clause: Clause, text: string) => {
    setGeneratedDocument(prev => {
      if (!prev) return null;
      const updatedClauses = prev.clauses.map(c => c.id === clause.id ? { ...c, text: text, standardizedText: undefined } : c);
      const newFullText = updatedClauses.map(c => `${c.heading}\n${c.text}`).join('\n\n');
      return {
        ...prev,
        clauses: updatedClauses,
        fullText: newFullText
      };
    });
    setSelectedClause(prev => prev ? { ...prev, text: text, standardizedText: undefined, explanation: undefined, risks: undefined, review: undefined } : null);
  }, []);

  const handleRegenerateClause = useCallback(async (clause: Clause, prompt: string) => {
    setError(null);
    setLoadingRegeneration(true);
    try {
      if (generatedDocument) {
        const response = await apiService.regenerateClause({
          documentId: generatedDocument.documentId,
          clauseId: clause.id,
          originalClauseText: clause.text,
          documentType: generatedDocument.documentType,
          prompt: prompt
        });

        const newText = response.newClauseText;

        setGeneratedDocument(prev => {
          if (!prev) return null;
          const updatedClauses = prev.clauses.map(c => c.id === clause.id ? { ...c, text: newText } : c);
          const newFullText = updatedClauses.map(c => `${c.heading}\n${c.text}`).join('\n\n');
          return {
            ...prev,
            clauses: updatedClauses,
            fullText: newFullText
          };
        });

        setSelectedClause(prev => prev ? { ...prev, text: newText, explanation: undefined, risks: undefined, review: undefined, standardizedText: undefined } : null);
      }
    } catch (err) {
      setError("Regeneration failed.");
    } finally {
      setLoadingRegeneration(false);
    }
  }, [generatedDocument]);

  const mainPadding = selectedClause ? 'pr-[400px]' : 'pr-0';

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-slate-900/90 border-b border-slate-800 px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
          </div>
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight">LegalDraftAI</h1>
            <p className="text-[10px] uppercase tracking-widest text-slate-400 font-semibold">Intelligent Drafting Engine</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-xs text-slate-400 hidden sm:inline-block">Grounding: Indian Legal Standards v2.1</span>
        </div>
      </header>

      <main className={`flex-1 p-8 transition-all duration-500 ease-in-out ${mainPadding}`}>
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Input Column */}
            <div className="lg:col-span-4 space-y-6">
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-6 pb-2 border-b border-slate-100 flex items-center gap-2">
                   <svg className="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
                   Configure Document
                </h2>
                {error && <Alert type="error" message={error} onClose={() => setError(null)} className="mb-4" />}
                <DocumentTypeSelector onSelect={setSelectedDocumentType} selectedType={selectedDocumentType} />
                <div className="space-y-4">
                  <FormInputs documentType={selectedDocumentType} params={generationParams} onChange={setGenerationParams} />
                </div>
                <Button onClick={handleGenerateDocument} loading={loadingGeneration} disabled={loadingGeneration} className="w-full mt-8 shadow-indigo-100 shadow-lg py-3">
                  {loadingGeneration ? 'Forging Document...' : 'Generate Agreement'}
                </Button>
              </div>
            </div>

            {/* Document Column */}
            <div className="lg:col-span-8">
              <GeneratedDocumentDisplay
                document={generatedDocument}
                onClauseSelect={handleSelectClause}
                selectedClauseId={selectedClause?.id || null}
                loading={loadingGeneration}
                onAnalyzeDocument={handleAnalyzeDocumentOverall}
                loadingAnalysis={loadingDocumentAnalysis}
                onDetectConflicts={handleDetectConflictsOverall}
                loadingConflicts={loadingConflicts}
                onAssessOverallRisk={handleAssessOverallRisk}
                loadingOverallRiskAssessment={loadingOverallRiskAssessment}
              />
            </div>
          </div>
        </div>
      </main>

      {selectedClause && (
        <ClauseDetailsPanel
          clause={selectedClause}
          onExplainClause={handleExplainClause}
          onAnalyzeClause={handleAnalyzeClause}
          onReviewClause={handleReviewClause}
          onStandardizeClause={handleStandardizeClause}
          onApplyStandardizedText={handleApplyStandardizedText}
          onRegenerateClause={handleRegenerateClause}
          explaining={loadingExplanation}
          analyzing={loadingAnalysis}
          reviewing={loadingReview}
          standardizing={loadingStandardization}
          regenerating={loadingRegeneration}
          onClose={() => setSelectedClause(null)}
        />
      )}
    </div>
  );
}

export default App;