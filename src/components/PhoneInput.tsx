import React, { useState, useEffect } from 'react';
import './PhoneInput.css';

interface PhoneInputProps {
  value?: string;
  onChange: (phone: string) => void;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  autoFormat?: boolean;
}

export const PhoneInput: React.FC<PhoneInputProps> = ({
  value = '',
  onChange,
  placeholder = '(555) 123-4567',
  required = false,
  disabled = false,
  autoFormat = true
}) => {
  const [displayValue, setDisplayValue] = useState('');

  useEffect(() => {
    if (autoFormat && value) {
      setDisplayValue(formatPhoneNumber(value));
    } else {
      setDisplayValue(value);
    }
  }, [value, autoFormat]);

  const formatPhoneNumber = (phone: string) => {
    // Remove all non-numeric characters
    const cleaned = phone.replace(/\D/g, '');

    // Format as (XXX) XXX-XXXX
    if (cleaned.length >= 10) {
      return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6, 10)}`;
    } else if (cleaned.length >= 6) {
      return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
    } else if (cleaned.length >= 3) {
      return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3)}`;
    } else if (cleaned.length > 0) {
      return `(${cleaned}`;
    }
    return '';
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    let rawValue = input;

    if (autoFormat) {
      // Allow typing numbers and common phone characters
      const allowedChars = input.replace(/[^\d\(\)\-\s]/g, '');
      rawValue = allowedChars.replace(/\D/g, ''); // Extract only digits for storage
      setDisplayValue(formatPhoneNumber(rawValue));
    } else {
      setDisplayValue(input);
      rawValue = input;
    }

    onChange(rawValue);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Allow backspace, delete, tab, escape, enter, and arrow keys
    if (
      e.key === 'Backspace' ||
      e.key === 'Delete' ||
      e.key === 'Tab' ||
      e.key === 'Escape' ||
      e.key === 'Enter' ||
      (e.key >= 'ArrowLeft' && e.key <= 'ArrowDown')
    ) {
      return;
    }

    // Allow Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X, Ctrl+Z
    if (e.ctrlKey && (e.key === 'a' || e.key === 'c' || e.key === 'v' || e.key === 'x' || e.key === 'z')) {
      return;
    }

    // Block non-numeric characters if autoFormat is enabled
    if (autoFormat && !/\d/.test(e.key)) {
      e.preventDefault();
    }
  };

  return (
    <input
      type="tel"
      value={displayValue}
      onChange={handleInputChange}
      onKeyDown={handleKeyDown}
      placeholder={placeholder}
      required={required}
      disabled={disabled}
      className="phone-input"
      maxLength={autoFormat ? 14 : undefined} // (XXX) XXX-XXXX = 14 chars
    />
  );
};