import React from 'react';
import './DatePicker.css';

interface DatePickerProps {
  value?: string;
  onChange: (date: string) => void;
  placeholder?: string;
  minDate?: string;
  maxDate?: string;
  required?: boolean;
  disabled?: boolean;
}

export const DatePicker: React.FC<DatePickerProps> = ({
  value = '',
  onChange,
  placeholder = 'Select date',
  minDate,
  maxDate,
  required = false,
  disabled = false
}) => {
  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  return (
    <div className="date-picker-container">
      <input
        type="date"
        value={value}
        onChange={handleInputChange}
        min={minDate}
        max={maxDate}
        required={required}
        disabled={disabled}
        className="date-picker-input"
        placeholder={placeholder}
      />
      <div className="date-picker-display">
        {formatDate(value) || placeholder}
      </div>
    </div>
  );
};