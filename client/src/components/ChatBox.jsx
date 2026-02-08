import React, { useEffect, useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchMessages, sendMessage } from '../redux/thunks/messageThunks';
import { markChatAsRead } from '../redux/thunks/chatThunks';
import Message from './Message';
import ImagePreviewModal from './ImagePreviewModal';
import { getSocket } from '../services/socket';
import { addMessage, handleMessageDeleted } from '../redux/slices/messageSlice';
import UpdateGroupChatModal from './UpdateGroupChatModal';
import { formatDateLabel, isSameDay } from '../utils/dateHelper';
import { getProfilePicUrl } from '../utils/authHelper';

const ChatBox = ({ onBackClick }) => {
    const dispatch = useDispatch();
    const { selectedChat } = useSelector((state) => state.chat);
    const { messages, loading } = useSelector((state) => state.messages);
    const { user } = useSelector((state) => state.auth);
    const [newMessage, setNewMessage] = useState('');
    const [file, setFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [previewImage, setPreviewImage] = useState(null);
    const messagesContainerRef = useRef(null);
    const prevScrollHeightRef = useRef(null);
    const messagesEndRef = useRef(null);
    const fileInputRef = useRef(null);
    const messageInputRef = useRef(null);
    const [updateModalOpen, setUpdateModalOpen] = useState(false);

    useEffect(() => {
        if (selectedChat) {
            dispatch(fetchMessages({ chatId: selectedChat._id, limit: 20 }));
            dispatch(markChatAsRead(selectedChat._id)); // Mark messages as read
            const socket = getSocket();
            socket.emit('join_room', selectedChat._id);

            const handleMessageDeleted = (data) => {
                dispatch(handleMessageDeleted(data));
            };

            socket.on('message_deleted', handleMessageDeleted);

            return () => {
                socket.off('message_deleted', handleMessageDeleted);
            };
        }
    }, [selectedChat, dispatch]);

    useEffect(() => {
        return () => {
            if (previewUrl) URL.revokeObjectURL(previewUrl);
        };
    }, [previewUrl]);

    useEffect(() => {
        if (prevScrollHeightRef.current && messagesContainerRef.current) {
            messagesContainerRef.current.style.scrollBehavior = 'auto';
            messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight - prevScrollHeightRef.current;
            prevScrollHeightRef.current = null;
            messagesContainerRef.current.style.scrollBehavior = 'smooth';
        } else {
            messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);

    // Auto-scroll on mobile keyboard open
    useEffect(() => {
        const handleResize = () => {
            if (document.activeElement === messageInputRef.current) {
                // Sligth delay to allow viewport to resize
                setTimeout(() => {
                    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
                }, 100);
            }
        };

        if (window.visualViewport) {
            window.visualViewport.addEventListener('resize', handleResize);
        }

        return () => {
            if (window.visualViewport) {
                window.visualViewport.removeEventListener('resize', handleResize);
            }
        };
    }, []);

    const handleScroll = (e) => {
        const { scrollTop, scrollHeight } = e.target;
        if (scrollTop === 0 && messages.length >= 20 && !loading) {
            prevScrollHeightRef.current = scrollHeight;
            dispatch(fetchMessages({
                chatId: selectedChat._id,
                limit: 20,
                before: messages[0].createdAt
            }));
        }
    };

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            if (selectedFile.size > 10000000) {
                // Inline error or just ignore? User asked to remove toast/alert.
                // We'll show a system-like message transiently or just clear file
                setNewMessage("File too large (max 10MB)");
                setTimeout(() => setNewMessage(""), 3000);
                return;
            }
            setFile(selectedFile);
            const url = URL.createObjectURL(selectedFile);
            setPreviewUrl(url);
        }
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if ((newMessage.trim() || file) && selectedChat) {
            const socket = getSocket();

            let messageData;
            if (file) {
                messageData = new FormData();
                messageData.append('content', newMessage);
                messageData.append('chatId', selectedChat._id);
                messageData.append('file', file);
            } else {
                messageData = {
                    content: newMessage,
                    chatId: selectedChat._id
                };
            }

            const resultAction = await dispatch(sendMessage(messageData));

            if (sendMessage.fulfilled.match(resultAction)) {
                socket.emit('send_message', resultAction.payload);
                setNewMessage('');
                setFile(null);
                setPreviewUrl(null);
                if (fileInputRef.current) fileInputRef.current.value = "";

                // Keep keyobard open on mobile
                setTimeout(() => {
                    messageInputRef.current?.focus();
                }, 10);
            }
        }
    };

    const clearFile = () => {
        setFile(null);
        setPreviewUrl(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    if (!selectedChat) {
        return (
            <div className="flex items-center justify-center h-full bg-theme-bg-secondary text-theme-text-primary">
                <p className="text-xl text-theme-text-muted">Select a chat to start messaging 👋</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full w-full bg-theme-bg-primary border-l border-theme-border relative overflow-hidden">
            {/* Header */}
            <div className="p-4 bg-theme-bg-tertiary border-b border-theme-border flex items-center shadow-md flex-shrink-0">
                {/* Back Button (Mobile Only) */}
                <button
                    onClick={onBackClick}
                    className="md:hidden mr-3 text-theme-text-primary hover:text-theme-primary transition-colors"
                    aria-label="Back to chats"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                    </svg>
                </button>
                <div className="flex items-center justify-between w-full px-1 sm:px-2 gap-1 sm:gap-2">
                    <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                        <img
                            src={!selectedChat.isGroupChat
                                ? getProfilePicUrl(selectedChat.users.find((u) => u._id !== user._id)?.pic)
                                : getProfilePicUrl(selectedChat.groupProfilePic)}
                            alt="Profile"
                            className="w-10 h-10 rounded-full object-cover border border-theme-border"
                        />
                        <div className="flex flex-col min-w-0">
                            <span className="text-sm sm:text-lg font-bold text-theme-text-primary truncate">
                                {!selectedChat.isGroupChat
                                    ? selectedChat.users.find((u) => u._id !== user._id)?.username
                                    : selectedChat.chatName}
                            </span>
                        </div>
                        {selectedChat.isGroupChat && (
                            <span className="text-[10px] sm:text-xs px-1.5 py-0.5 sm:px-2 sm:py-1 rounded bg-blue-600 text-white font-medium flex-shrink-0">
                                Group
                            </span>
                        )}
                    </div>
                    {selectedChat.isGroupChat && (
                        <button
                            onClick={() => setUpdateModalOpen(true)}
                            className="bg-theme-bg-secondary hover:bg-theme-bg-primary text-theme-text-primary border border-theme-border px-2 py-1 sm:px-3 sm:py-1.5 rounded-md text-xs font-medium transition-all flex items-center gap-1.5 shadow-sm hover:shadow-md flex-shrink-0"
                        >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span className="hidden sm:inline">Info</span>
                        </button>
                    )}
                </div>
            </div>

            {/* Messages Area */}
            <div
                ref={messagesContainerRef}
                onScroll={handleScroll}
                className="flex-1 overflow-y-auto p-4 pb-20 md:pb-4 custom-scrollbar bg-theme-bg-primary space-y-4 min-h-0"
            >
                {loading ? (
                    <div className="text-center text-theme-text-muted mt-5">Loading messages...</div>
                ) : (
                    messages.map((msg, index) => {
                        const isSame = index > 0 && isSameDay(messages[index - 1].createdAt, msg.createdAt);
                        const dateLabel = !isSame ? formatDateLabel(msg.createdAt) : null;

                        return (
                            <React.Fragment key={msg._id}>
                                {dateLabel && (
                                    <div className="flex justify-center my-4">
                                        <span className="bg-theme-bg-tertiary text-theme-text-muted text-xs px-3 py-1 rounded-full border border-theme-border shadow-sm">
                                            {dateLabel}
                                        </span>
                                    </div>
                                )}
                                <Message
                                    message={msg}
                                    isGroupChat={selectedChat.isGroupChat}
                                    onImageClick={(url) => setPreviewImage(url)}
                                />
                            </React.Fragment>
                        );
                    })
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area or Removed Message */}
            <div className="flex-shrink-0">
                {selectedChat.isGroupChat && !selectedChat.users.some(u => u._id === user._id) ? (
                    <div className="p-4 bg-theme-bg-tertiary border-t border-theme-border text-center">
                        <p className="text-red-500 font-semibold bg-red-500/10 py-3 rounded-lg border border-red-500/20">
                            🚫 You have been removed from this group
                        </p>
                    </div>
                ) : selectedChat.isGroupChat && !selectedChat.users.some(u => u._id === selectedChat.groupAdmin._id) ? (
                    <div className="p-4 bg-theme-bg-tertiary border-t border-theme-border text-center">
                        <p className="text-orange-500 font-semibold bg-orange-500/10 py-3 rounded-lg border border-orange-500/20">
                            🔒 Group is closed because Admin left
                        </p>
                    </div>
                ) : (
                    <form onSubmit={handleSendMessage} className="w-full p-4 bg-theme-bg-tertiary border-t border-theme-border flex items-center relative fixed bottom-0 md:static z-10">
                        {/* File Preview */}
                        {file && (
                            <div className="absolute bottom-full left-4 bg-theme-bg-tertiary border border-theme-border rounded-lg p-2 shadow-lg mb-2">
                                <div className="relative">
                                    {file.type.startsWith('image/') ? (
                                        <img src={previewUrl} alt="Preview" className="h-32 rounded-lg object-contain" />
                                    ) : (
                                        <video src={previewUrl} controls className="h-32 rounded-lg" />
                                    )}
                                    <button
                                        type="button"
                                        onClick={clearFile}
                                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 shadow-md"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>
                                <p className="text-xs text-center text-theme-text-muted mt-1 truncate max-w-[200px]">{file.name}</p>
                            </div>
                        )}
                        <input
                            type="file"
                            accept="image/*,video/mp4,video/webm"
                            ref={fileInputRef}
                            style={{ display: 'none' }}
                            onChange={handleFileChange}
                        />
                        <button
                            type="button"
                            onClick={() => fileInputRef.current.click()}
                            className="bg-theme-bg-secondary hover:bg-theme-bg-tertiary text-theme-text-secondary rounded-full p-2 md:p-3 mr-2 md:mr-3 transition duration-200"
                            title="Attach File"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 md:w-6 md:h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M18.375 12.739l-7.693 7.693a4.5 4.5 0 01-6.364-6.364l10.94-10.94A3 3 0 1119.5 7.372L8.552 18.32m.009-.01l-.01.01m5.699-9.941l-7.81 7.81a1.5 1.5 0 002.112 2.13" />
                            </svg>
                        </button>
                        <input
                            type="text"
                            placeholder="Type a message..."
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            ref={(input) => { messageInputRef.current = input; }}
                            className="flex-1 bg-theme-bg-secondary text-theme-text-primary rounded-full px-4 md:px-5 py-2 md:py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 mr-2 md:mr-3 text-sm md:text-base placeholder-theme-text-muted"
                        />
                        <button
                            type="submit"
                            onMouseDown={(e) => e.preventDefault()} // Prevent button from stealing focus
                            className="bg-blue-600 hover:bg-blue-700 text-white rounded-full p-2 md:p-3 transition duration-200"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 md:w-6 md:h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                            </svg>
                        </button>
                    </form>
                )
                }
            </div>
            <UpdateGroupChatModal
                isOpen={updateModalOpen}
                onClose={() => setUpdateModalOpen(false)}
                fetchMessages={() => dispatch(fetchMessages({ chatId: selectedChat._id, limit: 20 }))}
            />

            {
                previewImage && (
                    <ImagePreviewModal
                        imageSrc={previewImage}
                        onClose={() => setPreviewImage(null)}
                    />
                )
            }
        </div >
    );
};

export default ChatBox;
