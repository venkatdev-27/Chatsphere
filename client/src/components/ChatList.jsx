import React, { useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setSelectedChat } from '../redux/slices/chatSlice';
import { deleteChat } from '../redux/thunks/chatThunks';
import useLongPress from '../hooks/useLongPress';
import { getProfilePicUrl } from '../utils/authHelper';

const ChatList = ({ chats, onChatSelect }) => {
    const dispatch = useDispatch();
    const { selectedChat } = useSelector((state) => state.chat);
    const { user } = useSelector((state) => state.auth);
    const [menuChat, setMenuChat] = useState(null);
    const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
    const menuRef = useRef(null);

    const getSender = (loggedUser, users) => {
        return users[0]._id === loggedUser._id ? users[1] : users[0];
    };

    const handleChatSelect = (chat) => {
        dispatch(setSelectedChat(chat));
        if (onChatSelect) onChatSelect(); // Trigger mobile view change
    };

    const handleLongPress = (chat, event) => {
        event.preventDefault();
        event.stopPropagation();

        const element = event.currentTarget || event.target;
        if (!element) return;

        const rect = element.getBoundingClientRect();
        setMenuPosition({ top: rect.top + window.scrollY, left: rect.left });
        setMenuChat(chat);
    };

    const handleThreeDotsClick = (chat, event) => {
        event.stopPropagation();

        // Calculate position first to ensure it's ready if we are opening
        const rect = event.currentTarget.getBoundingClientRect();
        const newPosition = { top: rect.bottom + window.scrollY, left: rect.left - 100 };

        setMenuChat(prev => {
            if (prev && prev._id === chat._id) {
                return null; // Close if already open
            }
            // Open new chat menu
            setMenuPosition(newPosition);
            return chat;
        });
    };

    const handleDeleteChat = async (e) => {
        e.stopPropagation(); // Prevent bubbling when clicking delete
        if (menuChat) {
            await dispatch(deleteChat(menuChat._id));
            setMenuChat(null);
        }
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setMenuChat(null);
            }
        };

        if (menuChat) {
            // Using mousedown to catch clicks before they trigger other click handlers if necessary
            document.addEventListener('mousedown', handleClickOutside);
            document.addEventListener('touchstart', handleClickOutside);
        }


        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('touchstart', handleClickOutside);
        };
    }, [menuChat]);

    return (
        <div className="flex flex-col space-y-2 h-full overflow-y-scroll p-2 scrollbar-hide">
            {chats && chats.map((chat) => {
                const sender = !chat.isGroupChat ? getSender(user, chat.users) : null;

                return (
                    <ChatItem
                        key={chat._id}
                        chat={chat}
                        sender={sender}
                        isSelected={selectedChat?._id === chat._id}
                        onSelect={handleChatSelect}
                        onLongPress={handleLongPress}
                        onThreeDotsClick={handleThreeDotsClick}
                    />
                );
            })}

            {/* Context Menu */}
            {menuChat && (
                <div
                    ref={menuRef}
                    className="fixed z-50 bg-theme-bg-tertiary border border-theme-border rounded-lg shadow-2xl py-2 min-w-[160px]"
                    style={{
                        top: `${menuPosition.top}px`,
                        left: `${menuPosition.left}px`,
                    }}
                >
                    <button
                        onClick={handleDeleteChat}
                        className="w-full px-4 py-2 text-left text-sm hover:bg-theme-bg-secondary transition-colors text-red-500 hover:text-red-600 flex items-center gap-2"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Delete Chat
                    </button>
                </div>
            )}
        </div>
    );
};

const ChatItem = ({ chat, sender, isSelected, onSelect, onThreeDotsClick }) => {

    return (
        <div
            className={`flex items-center p-3 rounded-lg cursor-pointer transition-colors duration-200 relative group ${isSelected
                ? 'bg-theme-primary text-white'
                : 'bg-theme-bg-secondary hover:bg-theme-bg-tertiary text-theme-text-primary'
                }`}
            onClick={() => onSelect(chat)}
            onContextMenu={(e) => e.preventDefault()} // Disable context menu
        >
            {/* Profile Picture or Group Icon */}
            {chat.isGroupChat ? (
                chat.groupProfilePic ? (
                    <img
                        src={getProfilePicUrl(chat.groupProfilePic)}
                        alt={chat.chatName}
                        className="w-10 h-10 rounded-full mr-3 object-cover"
                    />
                ) : (
                    <div className="w-10 h-10 rounded-full mr-3 bg-blue-500 flex items-center justify-center">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                    </div>
                )
            ) : (
                sender && (
                    <img
                        src={getProfilePicUrl(sender.pic)}
                        alt={sender.username}
                        className="w-10 h-10 rounded-full mr-3 object-cover"
                    />
                )
            )}

            <div className="flex flex-col flex-1">
                <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm">
                        {!chat.isGroupChat ? (sender?.username || 'Unknown User') : chat.chatName}
                    </span>
                    {chat.isGroupChat && (
                        <span className={`text-xs px-1.5 py-0.5 rounded ${isSelected ? 'bg-blue-700' : 'bg-theme-bg-tertiary'} ${isSelected ? 'text-white' : 'text-theme-text-secondary'}`}>
                            Group
                        </span>
                    )}
                </div>
                {chat.latestMessage && (
                    <span className={`text-xs truncate w-32 ${isSelected ? 'text-blue-100' : 'text-theme-text-secondary'}`}>
                        <span className="font-bold">{chat.latestMessage.sender?.username || 'Unknown'}: </span>
                        {chat.latestMessage.content
                            ? (chat.latestMessage.content.length > 30
                                ? chat.latestMessage.content.substring(0, 31) + "..."
                                : chat.latestMessage.content)
                            : (chat.latestMessage.file ? 'Attachment 📎' : '')}
                    </span>
                )}
            </div>



            {/* Three Dots Menu (All Devices) */}
            <button
                onMouseDown={(e) => e.stopPropagation()}
                onClick={(e) => onThreeDotsClick(chat, e)}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full hover:bg-theme-bg-tertiary transition-all text-theme-text-secondary hover:text-theme-text-primary z-10"
                aria-label="Chat options"
            >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                </svg>
            </button>

            {/* Unread Count Badge 📬 */}
            {
                chat.unreadCount > 0 && (
                    <div className="absolute top-2 right-10 bg-blue-500 text-white text-xs font-bold rounded-full h-5 min-w-[20px] flex items-center justify-center px-1.5 shadow-sm border border-theme-bg-secondary">
                        {chat.unreadCount}
                    </div>
                )
            }
        </div >
    );
};

export default ChatList;
