import React from 'react';
import './AppointmentConfirmation.css';

interface AppointmentData {
  name: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  reason?: string;
}

interface AppointmentConfirmationProps {
  appointment: AppointmentData;
  onEdit?: () => void;
  onCancel?: () => void;
  onConfirm?: () => void;
  showActions?: boolean;
}

export const AppointmentConfirmation: React.FC<AppointmentConfirmationProps> = ({
  appointment,
  onEdit,
  onCancel,
  onConfirm,
  showActions = true
}) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="appointment-confirmation">
      <div className="confirmation-header">
        <div className="confirmation-icon">✅</div>
        <h3>Appointment Scheduled!</h3>
        <p>Your appointment has been successfully booked.</p>
      </div>

      <div className="appointment-details">
        <div className="detail-row">
          <span className="detail-label">Name:</span>
          <span className="detail-value">{appointment.name}</span>
        </div>

        <div className="detail-row">
          <span className="detail-label">Date:</span>
          <span className="detail-value">{formatDate(appointment.date)}</span>
        </div>

        <div className="detail-row">
          <span className="detail-label">Time:</span>
          <span className="detail-value">{appointment.time}</span>
        </div>

        <div className="detail-row">
          <span className="detail-label">Email:</span>
          <span className="detail-value">{appointment.email}</span>
        </div>

        <div className="detail-row">
          <span className="detail-label">Phone:</span>
          <span className="detail-value">{appointment.phone}</span>
        </div>

        {appointment.reason && (
          <div className="detail-row">
            <span className="detail-label">Reason:</span>
            <span className="detail-value">{appointment.reason}</span>
          </div>
        )}
      </div>

      <div className="confirmation-notice">
        <p>📧 <strong>Confirmation email sent!</strong> Check your inbox for appointment details.</p>
        <p>📱 We'll also send you a reminder 24 hours before your appointment.</p>
      </div>

      {showActions && (
        <div className="confirmation-actions">
          {onEdit && (
            <button className="confirmation-btn edit" onClick={onEdit}>
              Edit Appointment
            </button>
          )}
          {onCancel && (
            <button className="confirmation-btn cancel" onClick={onCancel}>
              Cancel Appointment
            </button>
          )}
          {onConfirm && (
            <button className="confirmation-btn confirm" onClick={onConfirm}>
              Add to Calendar
            </button>
          )}
        </div>
      )}
    </div>
  );
};