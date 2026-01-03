import React from 'react';
import './QuickActions.css';

export interface QuickAction {
  id: string;
  label: string;
  icon?: string;
  action: () => void;
  variant?: 'primary' | 'secondary' | 'success' | 'danger';
  disabled?: boolean;
}

interface QuickActionsProps {
  actions: QuickAction[];
  title?: string;
  compact?: boolean;
}

export const QuickActions: React.FC<QuickActionsProps> = ({
  actions,
  title,
  compact = false
}) => {
  if (actions.length === 0) return null;

  return (
    <div className={`quick-actions ${compact ? 'compact' : ''}`}>
      {title && <h4 className="quick-actions-title">{title}</h4>}

      <div className="quick-actions-grid">
        {actions.map(action => (
          <button
            key={action.id}
            className={`quick-action-btn ${action.variant || 'primary'} ${action.disabled ? 'disabled' : ''}`}
            onClick={action.action}
            disabled={action.disabled}
            title={action.label}
          >
            {action.icon && <span className="action-icon">{action.icon}</span>}
            <span className="action-label">{action.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};