import React, { useState } from 'react';
import { Send } from 'lucide-react';

const MessageComposer = ({ onSendMessage, disabled = false, readOnly = false, placeholder = 'Type your broadcast message...' }) => {
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim() && onSendMessage && !disabled) {
      onSendMessage(message.trim());
      setMessage('');
    }
  };

  // If disabled and not explicitly asked to render readOnly UI, hide the composer
  if (disabled && !readOnly) return null;

  // Render a visually identical composer. When disabled/readOnly is true we render inputs
  // in a disabled state so non-admins see the same UI but cannot send messages.
  return (
    <div className="p-4 flex-shrink-0">
      <form onSubmit={handleSubmit} className="flex items-center gap-0 sm:gap-3">
        <input
          type="text"
          placeholder={placeholder}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          disabled={disabled}
          className={`flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none ${disabled ? 'bg-gray-50 cursor-not-allowed' : ''}`}
        />
        {/* Show send button but disable it for readOnly/disabled mode to preserve visual parity */}
        <button
          type="submit"
          className={`p-2 bg-[var(--blue700)] text-white rounded-lg transition-colors ${disabled ? 'opacity-60 cursor-not-allowed' : 'hover:bg-blue-800'}`}
          disabled={disabled || !message.trim()}
        >
          <Send size={20} />
        </button>
      </form>
    </div>
  );
};

export default MessageComposer;
