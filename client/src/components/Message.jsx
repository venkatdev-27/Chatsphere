import React, { useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import useLongPress from '../hooks/useLongPress';
import { deleteMessageForMe, deleteMessageForEveryone } from '../redux/thunks/messageThunks';
import { getSocket } from '../services/socket';
import { getProfilePicUrl } from '../utils/authHelper';
import SystemMessage from './SystemMessage';


const Message = ({ message, isGroupChat, onImageClick }) => {
    const { user } = useSelector((state) => state.auth);
    const { selectedChat } = useSelector((state) => state.chat);
    const dispatch = useDispatch();

    const [showMenu, setShowMenu] = useState(false);
    const [showThreeDots, setShowThreeDots] = useState(false);
    const menuRef = useRef(null);

    const isSender = message.sender?._id === user._id;
    const isGroupAdmin = selectedChat?.isGroupChat && selectedChat?.groupAdmin?._id === user._id;

    const longPressHandlers = useLongPress(() => {
        setShowMenu(true);
    });

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setShowMenu(false);
            }
        };

        if (showMenu) {
            document.addEventListener('mousedown', handleClickOutside);
            document.addEventListener('touchstart', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('touchstart', handleClickOutside);
        };
    }, [showMenu]);

    const handleDeleteForMe = async () => {
        try {
            await dispatch(deleteMessageForMe(message._id)).unwrap();
            setShowMenu(false);
        } catch (error) {
            console.error('Delete failed:', error);
        }
    };

    const handleDeleteForEveryone = async () => {
        try {
            await dispatch(deleteMessageForEveryone(message._id)).unwrap();

            const socket = getSocket();
            if (socket) {
                socket.emit('delete_message', {
                    room: message.chat._id || message.chat,
                    messageId: message._id,
                    isDeletedForEveryone: true
                });
            }

            setShowMenu(false);
        } catch (error) {
            console.error('Delete for everyone failed:', error);
        }
    };

    if (message.type === 'system') {
        return <SystemMessage message={message} />;
    }

    if (message.isDeletedForEveryone) {
        return (
            <div className={`flex ${isSender ? 'justify-end' : 'justify-start'} mb-4`}>
                <div className="flex flex-col max-w-[70%]">
                    {isGroupChat && !isSender && (
                        <span className="text-xs text-gray-400 ml-1 mb-1">
                            {message.sender?.username || 'Unknown'}
                        </span>
                    )}
                    <div className="px-4 py-2 rounded-lg bg-theme-bg-tertiary text-theme-text-muted italic border border-theme-border">
                        <p className="text-sm">🚫 This message was deleted</p>
                        <span className="text-xs text-theme-text-muted mt-1 block text-right opacity-70">
                            {new Date(message.createdAt).toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit',
                            })}
                        </span>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div
            className={`flex ${isSender ? 'justify-end' : 'justify-start'} mb-4 relative group`}
        >
            <div className="flex flex-col max-w-[70%]">
                {/* Sender Name in Group Chat */}
                {isGroupChat && !isSender && (
                    <span className="text-xs text-theme-text-muted ml-1 mb-1">
                        {message.sender?.username || 'Unknown'}
                    </span>
                )}

                <div className="relative">
                    {/* Three dots menu button (desktop only) */}
                    {/* Three dots menu button */}
                    {/* Three dots menu button */}
                    {/* Context Menu */}
                    {showMenu && (
                        <div
                            ref={menuRef}
                            className={`absolute ${isSender ? 'right-0' : 'left-0'} bottom-full mb-1 
                                bg-theme-bg-tertiary border border-theme-border rounded-lg shadow-lg z-20 min-w-[180px]`}
                        >
                            <button
                                onClick={handleDeleteForMe}
                                className="w-full text-left px-4 py-2 hover:bg-theme-bg-secondary text-theme-text-primary text-sm flex items-center gap-2"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                                Delete for me
                            </button>

                            {(isSender || isGroupAdmin) && (
                                <button
                                    onClick={handleDeleteForEveryone}
                                    className="w-full text-left px-4 py-2 hover:bg-theme-bg-secondary text-red-500 text-sm flex items-center gap-2 border-t border-theme-border"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                    </svg>
                                    Delete for everyone
                                </button>
                            )}
                        </div>
                    )}


                    {/* Message Bubble */}
                    <div
                        {...longPressHandlers}
                        onContextMenu={(e) => e.preventDefault()}
                        className="select-none cursor-pointer"
                    >
                        {message.file && (
                            <div className="mb-2">
                                {message.fileType === 'video' ? (
                                    <video
                                        src={getProfilePicUrl(message.file)}
                                        controls
                                        preload="metadata"
                                        className="max-w-full rounded-lg max-h-60"
                                    />
                                ) : message.fileType === 'image' ? (
                                    <img
                                        src={getProfilePicUrl(message.file)}
                                        loading="lazy"
                                        alt="attachment"
                                        className="max-w-full rounded-lg max-h-60 cursor-pointer hover:opacity-90"
                                        onClick={() => onImageClick?.(getProfilePicUrl(message.file))}
                                    />
                                ) : message.fileType === 'document' ? (
                                    <div className="flex items-center gap-3 p-3 rounded-lg bg-theme-bg-secondary border border-theme-border">
                                        <div
                                            className="flex items-center gap-3 flex-1 min-w-0 cursor-pointer hover:opacity-80 transition-opacity"
                                            onClick={() => onImageClick?.(getProfilePicUrl(message.file), 'document')}
                                        >
                                            <div className="p-2 bg-blue-500/10 rounded-lg">
                                                <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                </svg>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium truncate text-theme-text-primary">
                                                    {decodeURIComponent(
                                                        message.file.split('/').pop().replace(/^\d+-/, '')
                                                    )}
                                                </p>
                                                <p className="text-xs text-theme-text-muted flex items-center gap-1">
                                                    <span>Tap to preview</span>
                                                    <span className="w-1 h-1 rounded-full bg-theme-text-muted"></span>
                                                    <span className="uppercase text-[10px]">{message.file.split('.').pop()}</span>
                                                </p>
                                            </div>
                                        </div>
                                        <a
                                            href={getProfilePicUrl(message.file)}
                                            download={decodeURIComponent(message.file.split('/').pop().replace(/^\d+-/, ''))}
                                            onClick={(e) => e.stopPropagation()}
                                            className="p-2 hover:bg-theme-bg-tertiary rounded-lg transition-colors flex-shrink-0"
                                            title="Download file"
                                        >
                                            <svg className="w-5 h-5 text-theme-text-secondary hover:text-blue-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                            </svg>
                                        </a>
                                    </div>
                                ) : null}
                            </div>
                        )}

                        {message.content && (
                            <div className={`px-4 py-2 rounded-lg transition-colors ${isSender
                                ? 'bg-theme-bubble-sender text-white rounded-br-none'
                                : 'bg-theme-bg-tertiary text-theme-text-primary rounded-bl-none'
                                }`}>
                                <p className="text-sm">{message.content}</p>
                                <span className={`text-xs mt-1 block text-right opacity-70 ${isSender ? 'text-blue-100' : 'text-theme-text-muted'}`}>
                                    {new Date(message.createdAt).toLocaleTimeString([], {
                                        hour: '2-digit',
                                        minute: '2-digit',
                                    })}
                                </span>
                            </div>
                        )}
                        {!message.content && message.file && (
                            <span className={`text-xs block text-right opacity-70 mt-1 ${isSender ? 'text-theme-text-muted' : 'text-theme-text-muted'}`}>
                                {new Date(message.createdAt).toLocaleTimeString([], {
                                    hour: '2-digit',
                                    minute: '2-digit',
                                })}
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Message;
