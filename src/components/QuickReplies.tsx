import React from 'react';
import './QuickReplies.css';

interface QuickRepliesProps {
  replies: string[];
  onSelect: (reply: string) => void;
}

const QuickReplies: React.FC<QuickRepliesProps> = ({ replies, onSelect }) => {
  return (
    <div className="quick-replies">
      {replies.map((reply, index) => (
        <button
          key={index}
          onClick={() => onSelect(reply)}
          className="quick-reply-button"
        >
          {reply}
        </button>
      ))}
    </div>
  );
};

export default QuickReplies;
