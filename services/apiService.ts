import { GoogleGenAI, Type } from "@google/genai";
import {
  DocumentType,
  DocumentGenerationResponse,
  ClauseExplanationRequest,
  ClauseExplanationResponse,
  DocumentAnalysisRequest,
  DocumentAnalysisResponse,
  ClauseAnalysisRequest,
  ClauseAnalysisResponse,
  ConflictDetectionRequest,
  ConflictDetectionResponse,
  OverallRiskAssessmentRequest,
  OverallRiskAssessmentResponse,
  ClauseRegenerationRequest,
  ClauseRegenerationResponse,
  ClauseReviewRequest,
  ClauseReviewResponse,
  ClauseStandardizationRequest,
  ClauseStandardizationResponse
} from '../types';

// Initialize Gemini API
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const apiService = {
  generateDocument: async (params: any): Promise<DocumentGenerationResponse> => {
    const model = 'gemini-3-pro-preview';
    const prompt = `Generate a highly professional, legally structured ${params.documentType} compliant with Indian laws.
    Parameters: ${JSON.stringify(params)}
    Include all standard boilerplate clauses for India.
    Output strictly as JSON.
    Schema:
    - documentId: string
    - documentType: string
    - clauses: array of {id, heading, text}
    - fullText: string
    - overallRisks: array of {id, description, severity, recommendedAction}
    - missingClauses: array of {id, name, reasonForInclusion, exampleText}`;

    const response = await ai.models.generateContent({
      model,
      contents: [{ parts: [{ text: prompt }] }],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            documentId: { type: Type.STRING },
            documentType: { type: Type.STRING },
            fullText: { type: Type.STRING },
            clauses: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  heading: { type: Type.STRING },
                  text: { type: Type.STRING }
                },
                required: ["id", "heading", "text"]
              }
            },
            overallRisks: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  description: { type: Type.STRING },
                  severity: { type: Type.STRING },
                  recommendedAction: { type: Type.STRING }
                },
                required: ["id", "description", "severity", "recommendedAction"]
              }
            },
            missingClauses: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  name: { type: Type.STRING },
                  reasonForInclusion: { type: Type.STRING },
                  exampleText: { type: Type.STRING }
                },
                required: ["id", "name", "reasonForInclusion"]
              }
            }
          },
          required: ["documentId", "documentType", "clauses", "fullText", "overallRisks", "missingClauses"]
        }
      }
    });

    return JSON.parse(response.text || '{}');
  },

  explainClause: async (request: ClauseExplanationRequest): Promise<ClauseExplanationResponse> => {
    const prompt = `Explain this legal clause from a ${request.documentType} in plain English for a non-lawyer.
    Text: ${request.clauseText}
    Focus on practical implications under Indian law.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [{ parts: [{ text: prompt }] }],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            clauseId: { type: Type.STRING },
            explanation: { type: Type.STRING },
            keyTerms: { type: Type.ARRAY, items: { type: Type.STRING } },
            implications: { type: Type.ARRAY, items: { type: Type.STRING } }
          },
          required: ["clauseId", "explanation", "keyTerms", "implications"]
        }
      }
    });

    const data = JSON.parse(response.text || '{}');
    return { ...data, clauseId: request.clauseId };
  },

  analyzeDocument: async (request: DocumentAnalysisRequest): Promise<DocumentAnalysisResponse> => {
    const prompt = `System Rule: Analyze the document and suggest improvements ONLY when supported by standard Indian legal conventions.
    Do NOT invent laws or sections. If no reference supports a suggestion, say "No grounding found".
    Document Type: ${request.documentType}
    Document Text: ${request.fullText}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: [{ parts: [{ text: prompt }] }],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            risks: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  description: { type: Type.STRING },
                  severity: { type: Type.STRING },
                  recommendedAction: { type: Type.STRING }
                }
              }
            },
            missingClauses: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  name: { type: Type.STRING },
                  reasonForInclusion: { type: Type.STRING },
                  exampleText: { type: Type.STRING }
                }
              }
            }
          }
        }
      }
    });

    return { ...JSON.parse(response.text || '{}'), documentId: request.documentId };
  },

  detectConflicts: async (request: ConflictDetectionRequest): Promise<ConflictDetectionResponse> => {
    const prompt = `Identify logical or legal contradictions between clauses in this ${request.documentType}.
    Full Text: ${request.fullText}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: [{ parts: [{ text: prompt }] }],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            conflicts: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  summary: { type: Type.STRING },
                  conflictingClauses: { type: Type.ARRAY, items: { type: Type.STRING } },
                  explanation: { type: Type.STRING },
                  riskLevel: { type: Type.STRING }
                }
              }
            }
          }
        }
      }
    });

    return { ...JSON.parse(response.text || '{}'), documentId: request.documentId };
  },

  assessOverallRisk: async (request: OverallRiskAssessmentRequest): Promise<OverallRiskAssessmentResponse> => {
    const prompt = `Perform a comprehensive risk assessment for this ${request.documentType} based on Indian legal standards.
    Document: ${request.fullText}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: [{ parts: [{ text: prompt }] }],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            overallRiskAssessment: {
              type: Type.OBJECT,
              properties: {
                score: { type: Type.NUMBER },
                category: { type: Type.STRING },
                topRiskFactors: { type: Type.ARRAY, items: { type: Type.STRING } },
                executiveSummary: { type: Type.STRING }
              }
            }
          }
        }
      }
    });

    return { ...JSON.parse(response.text || '{}'), documentId: request.documentId };
  },

  reviewClause: async (request: ClauseReviewRequest): Promise<ClauseReviewResponse> => {
    const prompt = `You are an AI legal reviewer assisting a human approval workflow.
    Review the following clause and recommend one status: APPROVE, NEEDS REVISION, HIGH RISK.
    Rules: Do not rewrite the clause. Focus on clarity, fairness, and legal completeness. Provide a concise justification.
    Input Clause: ${request.clauseText}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: [{ parts: [{ text: prompt }] }],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            status: { type: Type.STRING },
            reason: { type: Type.STRING },
            reviewerNotes: { type: Type.STRING }
          },
          required: ["status", "reason", "reviewerNotes"]
        }
      }
    });

    return JSON.parse(response.text || '{}');
  },

  standardizeClause: async (request: ClauseStandardizationRequest): Promise<ClauseStandardizationResponse> => {
    const prompt = `You are a legal language standardization engine.
    Task: Rewrite the following clause to use consistent formal legal tone, remove ambiguity, and maintain original legal intent.
    Rules: Do NOT add new obligations. Preserve meaning exactly. Use standard legal phrasing ("shall", "hereby", etc.).
    Input Clause: ${request.clauseText}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: [{ parts: [{ text: prompt }] }],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            normalizedClauseText: { type: Type.STRING }
          },
          required: ["normalizedClauseText"]
        }
      }
    });

    return JSON.parse(response.text || '{}');
  },

  analyzeClause: async (request: ClauseAnalysisRequest): Promise<ClauseAnalysisResponse> => {
    const prompt = `Analyze this specific clause for risks and gaps under Indian law.
    Clause Content: ${request.clauseText}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: [{ parts: [{ text: prompt }] }],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            risks: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  description: { type: Type.STRING },
                  severity: { type: Type.STRING },
                  recommendedAction: { type: Type.STRING }
                }
              }
            },
            missingClauses: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  name: { type: Type.STRING },
                  reasonForInclusion: { type: Type.STRING }
                }
              }
            }
          }
        }
      }
    });

    return { ...JSON.parse(response.text || '{}'), clauseId: request.clauseId };
  },

  regenerateClause: async (request: ClauseRegenerationRequest): Promise<ClauseRegenerationResponse> => {
    const prompt = `You are a legally grounded AI assistant.
    Regenerate this legal clause for a ${request.documentType} based on the user instructions.
    Maintain strict Indian legal terminology. Focus on clarity and legal robustness.
    Original Clause: ${request.originalClauseText}
    User Instruction: ${request.prompt}
    
    Return ONLY the new clause text in a JSON field 'newClauseText'.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: [{ parts: [{ text: prompt }] }],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            newClauseText: { type: Type.STRING }
          },
          required: ["newClauseText"]
        }
      }
    });

    const result = JSON.parse(response.text || '{}');
    return {
      clauseId: request.clauseId,
      newClauseText: result.newClauseText,
      updatedClauses: []
    };
  }
};