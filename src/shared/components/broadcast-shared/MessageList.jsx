// import React from 'react';
// import MessageItem from './MessageItem';
// import DateSeparator from './DateSeparator';

// const MessageList = ({ messages }) => {
//   return (
//     <div className="flex-1 overflow-y-auto scrollbar-hide flex flex-col-reverse">
//       <div className="px-6 py-4">
//         <DateSeparator />
//         <div className="flex flex-col gap-3">
//           {messages.map((msg) => (
//             <MessageItem key={msg.id} message={msg} isOwn={msg.isOwn} />
//           ))}
//         </div>
        
//       </div>
//     </div>
//   );
// };

// export default MessageList;



// import React, { useEffect, useRef } from 'react';
// import MessageItem from './MessageItem';
// import DateSeparator from './DateSeparator';

// const MessageList = ({ messages }) => {
//   const messagesEndRef = useRef(null);

//   // ✅ Auto scroll to bottom when messages change
//   useEffect(() => {
//     if (messagesEndRef.current) {
//       messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
//     }
//   }, [messages]);

//   return (
//     <div className="flex-1 overflow-y-auto scrollbar-hide flex flex-col">
//       <div className="px-6 py-4">
//         <DateSeparator />
//         <div className="flex flex-col gap-3">
//           {messages.length === 0 && (
//             <p className="text-center text-gray-400 text-sm">No messages yet.</p>
//           )}
//           {messages.map((msg) => (
//             <MessageItem key={msg.id} message={msg} isOwn={msg.isOwn} />
//           ))}
//           {/* 👇 Invisible div used for scrolling to bottom */}
//           <div ref={messagesEndRef}></div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default MessageList;



import React, { useEffect, useRef } from 'react';
import MessageItem from './MessageItem';
import DateSeparator from './DateSeparator';

const MessageList = ({ messages }) => {
  const messagesEndRef = useRef(null);

  // Auto scroll to bottom whenever messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto scrollbar-hide flex flex-col">
      <div className="px-6 py-4">
        <DateSeparator />
        <div className="flex flex-col gap-3">
          {messages.map((msg) => (
            <MessageItem key={msg.id} message={msg} isOwn={msg.isOwn} />
          ))}
          {/* Always keeps latest message visible */}
          <div ref={messagesEndRef}></div>
        </div>
      </div>
    </div>
  );
};

export default MessageList;
