import React, { useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setSelectedChat } from '../redux/slices/chatSlice';
import { deleteChat } from '../redux/thunks/chatThunks';
import useLongPress from '../hooks/useLongPress';
import { getProfilePicUrl } from '../utils/authHelper';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"

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

    const handleDeleteChat = async (e) => {
        if (e) e.stopPropagation(); // Prevent bubbling when clicking delete
        if (menuChat) {
            await dispatch(deleteChat(menuChat._id));
            setMenuChat(null);
        }
    };

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setMenuChat(null);
            }
        };

        if (menuChat) {
            document.addEventListener('pointerdown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('pointerdown', handleClickOutside);
        };
    }, [menuChat]);


    return (
        <div className="flex flex-col space-y-2 h-full overflow-y-auto p-2 scrollbar-hide">
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
                        menuChat={menuChat}
                    />

                );
            })}

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={!!menuChat} onOpenChange={(open) => !open && setMenuChat(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete this chat
                            and remove it from your list.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => setMenuChat(null)} className="bg-slate-700 text-slate-100 hover:bg-slate-600 border-slate-600">Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDeleteChat} className="bg-red-700 hover:bg-red-800 text-white">Delete</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
};

const ChatItem = ({ chat, sender, isSelected, onSelect, onLongPress, menuChat }) => {
    const longPressEvent = useLongPress((e) => onLongPress(chat, e), 2000);

    return (
        <div
            className={`flex items-center p-3 rounded-lg cursor-pointer transition-colors duration-200 relative group ${isSelected
                ? 'bg-theme-primary text-white'
                : 'bg-theme-bg-secondary hover:bg-theme-bg-tertiary text-theme-text-primary'
                }`}
            onClick={(e) => {
                if (
                    e.target.closest('[data-menu-btn]') ||
                    menuChat?._id === chat._id
                ) {
                    return;
                }
                onSelect(chat);
            }}
            {...longPressEvent}
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
