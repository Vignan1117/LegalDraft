// --- Enums ---

export enum DocumentType {
  NDA = 'NDA',
  EMPLOYMENT_AGREEMENT = 'Employment Agreement',
  RENTAL_AGREEMENT = 'Rental Agreement',
  LEGAL_NOTICE = 'Legal Notice'
}

export enum ClauseRiskSeverity {
  LOW = 'Low',
  MEDIUM = 'Medium',
  HIGH = 'High',
  CRITICAL = 'Critical'
}

export enum RiskCategory {
  LOW = 'Low',
  MEDIUM = 'Medium',
  HIGH = 'High'
}

export enum ReviewStatus {
  APPROVE = 'APPROVE',
  NEEDS_REVISION = 'NEEDS REVISION',
  HIGH_RISK = 'HIGH RISK'
}

// --- API Request/Response Interfaces ---

export interface DocumentGenerationParams {
  documentType: DocumentType;
  effectiveDate: string;
}

export interface PartyInfo {
  name: string;
  address?: string;
}

export interface NDAGenerationParams extends DocumentGenerationParams {
  parties: {
    partyA: string;
    partyB: string;
  };
  confidentialInfoDefinition: string;
  termMonths: number;
}

export interface EmploymentAgreementParams extends DocumentGenerationParams {
  parties: {
    employer: string;
    employee: string;
  };
  jobTitle: string;
  startDate: string;
  salary: number;
  probationPeriodMonths: number;
}

export interface RentalAgreementParams extends DocumentGenerationParams {
  parties: {
    landlord: string;
    tenant: string;
  };
  propertyAddress: string;
  rentAmount: number;
  depositAmount: number;
  leaseTermMonths: number;
  startDate: string;
}

export interface LegalNoticeParams extends DocumentGenerationParams {
  parties: {
    sender: string;
    recipient: string;
  };
  subject: string;
  issueDescription: string;
  demand: string;
  responseDays: number;
}

export type AllDocumentParams =
  | NDAGenerationParams
  | EmploymentAgreementParams
  | RentalAgreementParams
  | LegalNoticeParams;

export interface Risk {
  id: string;
  description: string;
  severity: ClauseRiskSeverity;
  recommendedAction: string;
  clauseIndex?: number;
}

export interface MissingClause {
  id: string;
  name: string;
  reasonForInclusion: string;
  exampleText?: string;
}

export interface ClauseReview {
  status: ReviewStatus;
  reason: string;
  reviewerNotes: string;
}

export interface Clause {
  id: string;
  heading: string;
  text: string;
  explanation?: string;
  risks?: Risk[];
  keyTerms?: string[];
  implications?: string[];
  missingClauses?: MissingClause[];
  review?: ClauseReview;
  standardizedText?: string;
}

export interface DetectedConflict {
  id: string;
  summary: string;
  conflictingClauses: string[];
  explanation: string;
  riskLevel: ClauseRiskSeverity;
}

export interface OverallRiskAssessment {
  score: number;
  category: RiskCategory;
  topRiskFactors: string[];
  executiveSummary: string;
}

export interface DocumentGenerationResponse {
  documentId: string;
  documentType: DocumentType;
  clauses: Clause[];
  fullText: string;
  overallRisks: Risk[];
  missingClauses: MissingClause[];
  conflicts?: DetectedConflict[];
  overallRiskAssessment?: OverallRiskAssessment;
}

export interface ClauseExplanationRequest {
  documentId: string;
  clauseId: string;
  clauseText: string;
  documentType: DocumentType;
}

export interface ClauseExplanationResponse {
  clauseId: string;
  explanation: string;
  keyTerms: string[];
  implications: string[];
}

export interface DocumentAnalysisRequest {
  documentId: string;
  fullText: string;
  documentType: DocumentType;
}

export interface DocumentAnalysisResponse {
  documentId: string;
  risks: Risk[];
  missingClauses: MissingClause[];
}

export interface ClauseAnalysisRequest {
  documentId: string;
  clauseId: string;
  clauseText: string;
  documentType: DocumentType;
}

export interface ClauseAnalysisResponse {
  clauseId: string;
  risks: Risk[];
  missingClauses: MissingClause[];
}

export interface ConflictDetectionRequest {
  documentId: string;
  fullText: string;
  documentType: DocumentType;
}

export interface ConflictDetectionResponse {
  documentId: string;
  conflicts: DetectedConflict[];
}

export interface OverallRiskAssessmentRequest {
  documentId: string;
  fullText: string;
  documentType: DocumentType;
}

export interface OverallRiskAssessmentResponse {
  documentId: string;
  overallRiskAssessment: OverallRiskAssessment;
}

export interface ClauseReviewRequest {
  clauseText: string;
}

export interface ClauseReviewResponse {
  status: ReviewStatus;
  reason: string;
  reviewerNotes: string;
}

export interface ClauseStandardizationRequest {
  clauseText: string;
}

export interface ClauseStandardizationResponse {
  normalizedClauseText: string;
}

export interface ClauseRegenerationRequest {
  documentId: string;
  clauseId: string;
  originalClauseText: string;
  documentType: DocumentType;
  prompt: string;
  context?: string;
}

export interface ClauseRegenerationResponse {
  clauseId: string;
  newClauseText: string;
  updatedClauses: Clause[];
}

// --- UI Component Props ---
export interface DocumentTypeSelectorProps {
  onSelect: (docType: DocumentType) => void;
  selectedType: DocumentType;
}

export interface FormInputsProps<T extends AllDocumentParams> {
  documentType: DocumentType;
  params: T;
  onChange: (newParams: T) => void;
}

export interface GeneratedDocumentDisplayProps {
  document: DocumentGenerationResponse | null;
  onClauseSelect: (clause: Clause) => void;
  selectedClauseId: string | null;
  loading: boolean;
  onAnalyzeDocument: (documentId: string, fullText: string, documentType: DocumentType) => void;
  loadingAnalysis: boolean;
  onDetectConflicts: (documentId: string, fullText: string, documentType: DocumentType) => void;
  loadingConflicts: boolean;
  onAssessOverallRisk: (documentId: string, fullText: string, documentType: DocumentType) => void;
  loadingOverallRiskAssessment: boolean;
}

export interface ClauseDetailsPanelProps {
  clause: Clause | null;
  onExplainClause: (clause: Clause) => void;
  onAnalyzeClause: (clause: Clause) => void;
  onReviewClause: (clause: Clause) => void;
  onStandardizeClause: (clause: Clause) => void;
  onApplyStandardizedText: (clause: Clause, text: string) => void;
  onRegenerateClause: (clause: Clause, prompt: string) => void;
  explaining: boolean;
  analyzing: boolean;
  reviewing: boolean;
  standardizing: boolean;
  regenerating: boolean;
  onClose: () => void;
}