import React from 'react';
import SeenIndicator from './SeenIndicator';
import { User } from 'lucide-react'; // Assuming Lucide user icon

const MessageItem = ({ message, isOwn = false, showSeenIndicator = false, bubbleTone }) => {
    // bubbleTone: undefined (admin default), 'user' (gray for both sides)
    const isUserGray = bubbleTone === 'user';
    return (
        <div className="">
            <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
                {/* Container wrapping bubble + tail + user icon, arranged horizontally */}
                <div className={`flex ${isOwn ? 'flex-row-reverse items-end' : 'items-end'}`}>

                    {/* User Icon placed after tail, aligned to bottom */}
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center ${isOwn ? 'ml-4' : 'mr-4'}
            ${isUserGray ? 'bg-gray-300' : (isOwn ? 'bg-blue-500' : 'bg-gray-300')}`}>
                        <User size={16} color={isUserGray ? '#374151' : (isOwn ? '#fff' : '#374151')} />
                    </div>

                    {/* Message bubble + tail container */}
                    <div className="flex flex-col relative">
                        {/* Main bubble */}
                        <div className={`
              max-w-xs lg:max-w-md px-4 py-3 rounded-lg relative z-10
              ${isUserGray
                                ? 'bg-gray-100 text-gray-800'
                                : (isOwn ? 'bg-blue-500 text-white' : 'bg-[var(--blue100)] text-gray-800')
                            }
            `}>
                            <p className="text-sm">{message.text}</p>
                            <p className={`text-xs text-right ${isUserGray ? 'text-gray-500' : (isOwn ? 'text-blue-100' : 'text-gray-500')}`}>
                                {message.time}
                            </p>
                        </div>

                        {/* 60% Bigger Polygon tail */}
                        <svg
                            className={`absolute ${isOwn ? 'right-[-20px] bottom-[0px]' : 'left-[-20px] bottom-0'}`}
                            width="40"
                            height="32"
                            viewBox="0 0 40 32"
                        >
                            <polygon
                                points={isOwn ? "0,0 40,36 0,32" : "40,0 0,36 40,32"}
                                fill={isUserGray ? "rgb(243,244,246)" : (isOwn ? "rgb(59, 130, 246)" : "var(--blue100)")}
                            />
                        </svg>

                        {isOwn && showSeenIndicator && message.seen && (
                            <div className="flex justify-end mt-1">
                                <SeenIndicator count={message.seenCount || 4} />
                            </div>
                        )}
                    </div>


                </div>
            </div>
        </div>
    );
};

export default MessageItem;

