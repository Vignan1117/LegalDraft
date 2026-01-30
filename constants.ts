
import { DocumentType } from './types';

export const API_BASE_URL = 'http://localhost:8000/api/v1'; // Placeholder, actual backend URL
export const DOCUMENT_TYPES: { label: string; value: DocumentType }[] = [
  { label: 'Non-Disclosure Agreement (NDA)', value: DocumentType.NDA },
  { label: 'Employment Agreement', value: DocumentType.EMPLOYMENT_AGREEMENT },
  { label: 'Rental Agreement', value: DocumentType.RENTAL_AGREEMENT },
  { label: 'Legal Notice', value: DocumentType.LEGAL_NOTICE }
];