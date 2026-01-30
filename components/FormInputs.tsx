
import React from 'react';
import {
  FormInputsProps,
  DocumentType,
  NDAGenerationParams,
  EmploymentAgreementParams,
  RentalAgreementParams,
  LegalNoticeParams,
  AllDocumentParams,
} from '../types';

// Generic input component to reduce repetition
interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  id: string;
  type?: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
}

const InputField: React.FC<InputFieldProps> = ({ label, id, type = 'text', value, onChange, ...rest }) => (
  <div className="mb-4">
    <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
      {label}
    </label>
    <input
      type={type}
      id={id}
      name={id}
      value={value}
      onChange={onChange}
      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
      {...rest}
    />
  </div>
);

// Generic Textarea component
interface TextareaFieldProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  id: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
}

const TextareaField: React.FC<TextareaFieldProps> = ({ label, id, value, onChange, ...rest }) => (
  <div className="mb-4">
    <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
      {label}
    </label>
    <textarea
      id={id}
      name={id}
      value={value}
      onChange={onChange}
      rows={rest.rows || 3}
      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
      {...rest}
    />
  </div>
);


const FormInputs: React.FC<FormInputsProps<AllDocumentParams>> = ({ documentType, params, onChange }) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    onChange({
      ...params,
      [name]: type === 'number' ? parseInt(value, 10) : value,
    } as AllDocumentParams); // Cast back to AllDocumentParams
  };

  // Generalized party change handler
  const handlePartyChange = (e: React.ChangeEvent<HTMLInputElement>, partyKey: string) => {
    const { value } = e.target;
    onChange({
      ...params,
      parties: {
        ...(params as any).parties, // Access parties dynamically
        [partyKey]: value,
      },
    } as AllDocumentParams); // Cast back to AllDocumentParams
  };

  const renderNDAInputs = (ndaParams: NDAGenerationParams) => (
    <>
      <InputField
        label="Party A (Disclosing Party)"
        id="partyA"
        value={ndaParams.parties.partyA}
        onChange={(e) => handlePartyChange(e, 'partyA')}
        placeholder="e.g., InnovateCorp Pvt. Ltd."
      />
      <InputField
        label="Party B (Receiving Party)"
        id="partyB"
        value={ndaParams.parties.partyB}
        onChange={(e) => handlePartyChange(e, 'partyB')}
        placeholder="e.g., TechSolutions India"
      />
      <InputField
        label="Effective Date"
        id="effectiveDate"
        type="date"
        value={ndaParams.effectiveDate}
        onChange={handleInputChange}
      />
      <TextareaField
        label="Confidential Information Definition"
        id="confidentialInfoDefinition"
        value={ndaParams.confidentialInfoDefinition}
        onChange={handleInputChange}
        placeholder="e.g., business plans, customer lists, software code"
      />
      <InputField
        label="Term (in Months)"
        id="termMonths"
        type="number"
        value={ndaParams.termMonths}
        onChange={handleInputChange}
        min="1"
      />
    </>
  );

  const renderEmploymentAgreementInputs = (eaParams: EmploymentAgreementParams) => (
    <>
      <InputField
        label="Employer Name"
        id="employer"
        value={eaParams.parties.employer}
        onChange={(e) => handlePartyChange(e, 'employer')}
        placeholder="e.g., Global Solutions Inc."
      />
      <InputField
        label="Employee Name"
        id="employee"
        value={eaParams.parties.employee}
        onChange={(e) => handlePartyChange(e, 'employee')}
        placeholder="e.g., Priya Sharma"
      />
      <InputField
        label="Effective Date"
        id="effectiveDate"
        type="date"
        value={eaParams.effectiveDate}
        onChange={handleInputChange}
      />
      <InputField
        label="Job Title"
        id="jobTitle"
        value={eaParams.jobTitle}
        onChange={handleInputChange}
        placeholder="e.g., Software Engineer"
      />
      <InputField
        label="Start Date"
        id="startDate"
        type="date"
        value={eaParams.startDate}
        onChange={handleInputChange}
      />
      <InputField
        label="Salary (INR)"
        id="salary"
        type="number"
        value={eaParams.salary}
        onChange={handleInputChange}
        min="0"
      />
      <InputField
        label="Probation Period (Months)"
        id="probationPeriodMonths"
        type="number"
        value={eaParams.probationPeriodMonths}
        onChange={handleInputChange}
        min="0"
      />
    </>
  );

  const renderRentalAgreementInputs = (raParams: RentalAgreementParams) => (
    <>
      <InputField
        label="Landlord Name"
        id="landlord"
        value={raParams.parties.landlord}
        onChange={(e) => handlePartyChange(e, 'landlord')}
        placeholder="e.g., Mr. Rajesh Kumar"
      />
      <InputField
        label="Tenant Name"
        id="tenant"
        value={raParams.parties.tenant}
        onChange={(e) => handlePartyChange(e, 'tenant')}
        placeholder="e.g., Ms. Anjali Singh"
      />
      <InputField
        label="Effective Date"
        id="effectiveDate"
        type="date"
        value={raParams.effectiveDate}
        onChange={handleInputChange}
      />
      <TextareaField
        label="Property Address"
        id="propertyAddress"
        value={raParams.propertyAddress}
        onChange={handleInputChange}
        placeholder="e.g., Apt 4B, Sky View Towers, Noida, UP"
      />
      <InputField
        label="Rent Amount (INR)"
        id="rentAmount"
        type="number"
        value={raParams.rentAmount}
        onChange={handleInputChange}
        min="0"
      />
      <InputField
        label="Security Deposit (INR)"
        id="depositAmount"
        type="number"
        value={raParams.depositAmount}
        onChange={handleInputChange}
        min="0"
      />
      <InputField
        label="Lease Term (Months)"
        id="leaseTermMonths"
        type="number"
        value={raParams.leaseTermMonths}
        onChange={handleInputChange}
        min="1"
      />
      <InputField
        label="Lease Start Date"
        id="startDate"
        type="date"
        value={raParams.startDate}
        onChange={handleInputChange}
      />
    </>
  );

  const renderLegalNoticeInputs = (lnParams: LegalNoticeParams) => (
    <>
      <InputField
        label="Sender Name"
        id="sender"
        value={lnParams.parties.sender}
        onChange={(e) => handlePartyChange(e, 'sender')}
        placeholder="e.g., Advocate J. K. Singh"
      />
      <InputField
        label="Recipient Name"
        id="recipient"
        value={lnParams.parties.recipient}
        onChange={(e) => handlePartyChange(e, 'recipient')}
        placeholder="e.g., Mr. Suresh Reddy"
      />
      <InputField
        label="Notice Date"
        id="effectiveDate" // Reusing effectiveDate for noticeDate
        type="date"
        value={lnParams.effectiveDate}
        onChange={handleInputChange}
      />
      <InputField
        label="Subject"
        id="subject"
        value={lnParams.subject}
        onChange={handleInputChange}
        placeholder="e.g., Demand for outstanding payment"
      />
      <TextareaField
        label="Issue Description"
        id="issueDescription"
        value={lnParams.issueDescription}
        onChange={handleInputChange}
        placeholder="e.g., Despite repeated reminders, an outstanding payment..."
      />
      <TextareaField
        label="Demand / Relief Sought"
        id="demand"
        value={lnParams.demand}
        onChange={handleInputChange}
        placeholder="e.g., Immediate payment of INR 50,000"
      />
      <InputField
        label="Response Days"
        id="responseDays"
        type="number"
        value={lnParams.responseDays}
        onChange={handleInputChange}
        min="1"
      />
    </>
  );

  switch (documentType) {
    case DocumentType.NDA:
      return renderNDAInputs(params as NDAGenerationParams);
    case DocumentType.EMPLOYMENT_AGREEMENT:
      return renderEmploymentAgreementInputs(params as EmploymentAgreementParams);
    case DocumentType.RENTAL_AGREEMENT:
      return renderRentalAgreementInputs(params as RentalAgreementParams);
    case DocumentType.LEGAL_NOTICE:
      return renderLegalNoticeInputs(params as LegalNoticeParams);
    default:
      return (
        <div className="text-center p-6 bg-gray-50 rounded-md border border-gray-200">
          <p className="text-gray-500">Select a document type to see its specific inputs.</p>
        </div>
      );
  }
};

export default FormInputs;