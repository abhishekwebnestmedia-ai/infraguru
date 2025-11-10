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



import React, { useEffect, useRef, useMemo } from 'react';
import MessageItem from './MessageItem';
import DateSeparator from './DateSeparator';

// Helpers
const toLocalDateKey = (dateLike) => {
  const d = dateLike ? new Date(dateLike) : new Date();
  if (Number.isNaN(d.getTime())) return null;
  // Use YYYY-MM-DD as grouping key in local timezone
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
};

const formatDateLabel = (dateKey) => {
  if (!dateKey) return '';
  const [y, m, d] = dateKey.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  const isSameDay = (a, b) => a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();

  if (isSameDay(date, today)) return 'Today';
  if (isSameDay(date, yesterday)) return 'Yesterday';

  // Show month short + day, include year only if different
  const opts = { month: 'short', day: 'numeric' };
  const base = date.toLocaleDateString(undefined, opts);
  if (date.getFullYear() !== today.getFullYear()) return `${base}, ${date.getFullYear()}`;
  return base;
};

const MessageList = ({ messages = [], bubbleTone }) => {
  const messagesEndRef = useRef(null);

  // Auto scroll to bottom whenever messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Group messages by local date key. Use useMemo so we don't recompute on every render.
  const groups = useMemo(() => {
    const map = new Map();

    // Normalize and ensure chronological order (oldest -> newest)
    const getTs = (m) => {
      const t = m?.createdAt || m?.time || null;
      const v = t ? Date.parse(t) : NaN;
      return Number.isNaN(v) ? 0 : v;
    };

    const sorted = (messages || []).slice().sort((a, b) => getTs(a) - getTs(b));

    for (const msg of sorted) {
      // Prefer ISO createdAt timestamp; fall back to msg.time if that looks parsable
      const key = toLocalDateKey(msg.createdAt || msg.time) || toLocalDateKey(new Date());
      if (!map.has(key)) map.set(key, []);
      map.get(key).push(msg);
    }

    // Ordered keys will follow chronological order because `sorted` is oldest->newest
    const orderedKeys = Array.from(map.keys());
    return orderedKeys.map((k) => ({ key: k, label: formatDateLabel(k), items: map.get(k) }));
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto scrollbar-hide flex flex-col">
      <div className="px-6 py-4">
        <div className="flex flex-col gap-3">
          {groups.length === 0 && (
            <p className="text-center text-gray-400 text-sm">No messages yet.</p>
          )}

          {groups.map((group) => (
            <div key={group.key} className="">
              <DateSeparator date={group.label} />
              <div className="flex flex-col gap-3">
                {group.items.map((msg) => (
                  <MessageItem key={msg.id || msg._id || Math.random()} message={msg} isOwn={msg.isOwn} bubbleTone={bubbleTone} />
                ))}
              </div>
            </div>
          ))}

          {/* Always keep latest message visible */}
          <div ref={messagesEndRef}></div>
        </div>
      </div>
    </div>
  );
};

export default MessageList;
