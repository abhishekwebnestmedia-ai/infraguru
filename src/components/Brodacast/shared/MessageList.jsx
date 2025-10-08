import React from 'react';
import MessageItem from './MessageItem';
import DateSeparator from './DateSeparator';

const MessageList = ({ messages }) => {
  return (
    <div className="flex-1 min-h-0 overflow-y-auto scrollbar-hide flex flex-col-reverse">
      <div className="px-6 py-4">
        <DateSeparator />
        <div className="flex flex-col gap-3">
          {messages.map((msg) => (
            <MessageItem key={msg.id} message={msg} isOwn={msg.isOwn} />
          ))}
        </div>
        
      </div>
    </div>
  );
};

export default MessageList;
