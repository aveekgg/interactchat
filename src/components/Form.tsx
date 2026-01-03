import React, { useState } from 'react';
import { DatePicker } from './DatePicker';
import { PhoneInput } from './PhoneInput';
import './Form.css';

export interface FormField {
  id: string;
  type: 'text' | 'email' | 'phone' | 'date' | 'textarea' | 'select';
  label: string;
  placeholder?: string;
  required?: boolean;
  options?: string[]; // For select fields
  minDate?: string; // For date fields
  maxDate?: string; // For date fields
}

export interface FormData {
  [key: string]: string;
}

interface FormProps {
  fields: FormField[];
  onSubmit: (data: FormData) => void;
  onCancel?: () => void;
  submitLabel?: string;
  cancelLabel?: string;
  title?: string;
  description?: string;
}

export const Form: React.FC<FormProps> = ({
  fields,
  onSubmit,
  onCancel,
  submitLabel = 'Submit',
  cancelLabel = 'Cancel',
  title,
  description
}) => {
  const [formData, setFormData] = useState<FormData>({});
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  const handleFieldChange = (fieldId: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [fieldId]: value
    }));

    // Clear error when user starts typing
    if (errors[fieldId]) {
      setErrors(prev => ({
        ...prev,
        [fieldId]: ''
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: {[key: string]: string} = {};

    fields.forEach(field => {
      if (field.required && !formData[field.id]?.trim()) {
        newErrors[field.id] = `${field.label} is required`;
      }

      if (field.type === 'email' && formData[field.id]) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData[field.id])) {
          newErrors[field.id] = 'Please enter a valid email address';
        }
      }

      if (field.type === 'phone' && formData[field.id]) {
        const phoneRegex = /^\d{10}$/;
        if (!phoneRegex.test(formData[field.id].replace(/\D/g, ''))) {
          newErrors[field.id] = 'Please enter a valid 10-digit phone number';
        }
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const renderField = (field: FormField) => {
    const baseProps = {
      key: field.id,
      required: field.required,
      disabled: false
    };

    switch (field.type) {
      case 'text':
      case 'email':
        return (
          <input
            {...baseProps}
            type={field.type}
            value={formData[field.id] || ''}
            onChange={(e) => handleFieldChange(field.id, e.target.value)}
            placeholder={field.placeholder}
            className={`form-input ${errors[field.id] ? 'error' : ''}`}
          />
        );

      case 'phone':
        return (
          <PhoneInput
            {...baseProps}
            value={formData[field.id] || ''}
            onChange={(value) => handleFieldChange(field.id, value)}
            placeholder={field.placeholder}
          />
        );

      case 'date':
        return (
          <DatePicker
            {...baseProps}
            value={formData[field.id] || ''}
            onChange={(value) => handleFieldChange(field.id, value)}
            placeholder={field.placeholder}
            minDate={field.minDate}
            maxDate={field.maxDate}
          />
        );

      case 'textarea':
        return (
          <textarea
            {...baseProps}
            value={formData[field.id] || ''}
            onChange={(e) => handleFieldChange(field.id, e.target.value)}
            placeholder={field.placeholder}
            className={`form-textarea ${errors[field.id] ? 'error' : ''}`}
            rows={3}
          />
        );

      case 'select':
        return (
          <select
            {...baseProps}
            value={formData[field.id] || ''}
            onChange={(e) => handleFieldChange(field.id, e.target.value)}
            className={`form-select ${errors[field.id] ? 'error' : ''}`}
          >
            <option value="">{field.placeholder || 'Select an option'}</option>
            {field.options?.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        );

      default:
        return null;
    }
  };

  return (
    <div className="form-container">
      {title && <h3 className="form-title">{title}</h3>}
      {description && <p className="form-description">{description}</p>}

      <form onSubmit={handleSubmit} className="form">
        {fields.map(field => (
          <div key={field.id} className="form-field">
            <label className="form-label">
              {field.label}
              {field.required && <span className="required">*</span>}
            </label>
            {renderField(field)}
            {errors[field.id] && <span className="error-message">{errors[field.id]}</span>}
          </div>
        ))}

        <div className="form-actions">
          {onCancel && (
            <button type="button" onClick={onCancel} className="form-button cancel">
              {cancelLabel}
            </button>
          )}
          <button type="submit" className="form-button submit">
            {submitLabel}
          </button>
        </div>
      </form>
    </div>
  );
};