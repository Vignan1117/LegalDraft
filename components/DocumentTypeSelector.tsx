
import React from 'react';
import { DocumentType, DocumentTypeSelectorProps } from '../types';
import { DOCUMENT_TYPES } from '../constants';

const DocumentTypeSelector: React.FC<DocumentTypeSelectorProps> = ({ onSelect, selectedType }) => {
  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    onSelect(event.target.value as DocumentType);
  };

  return (
    <div className="mb-6">
      <label htmlFor="document-type" className="block text-sm font-medium text-gray-700 mb-2">
        Select Document Type
      </label>
      <select
        id="document-type"
        name="document-type"
        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md shadow-sm"
        value={selectedType}
        onChange={handleChange}
      >
        {DOCUMENT_TYPES.map((doc) => (
          <option key={doc.value} value={doc.value}>
            {doc.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default DocumentTypeSelector;