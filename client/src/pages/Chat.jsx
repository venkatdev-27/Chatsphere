import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Sidebar from '../components/Sidebar';
import ChatBox from '../components/ChatBox';
import useSocket from '../hooks/useSocket';
import { setSelectedChat } from '../redux/slices/chatSlice';

const Chat = () => {
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);
    const { selectedChat } = useSelector((state) => state.chat);
    const [showMobileChat, setShowMobileChat] = useState(false);
    useSocket(user); // Initialize socket connection 🔌

    const handleChatSelect = () => {
        setShowMobileChat(true);
    };

    const handleBackToSidebar = () => {
        setShowMobileChat(false);
        dispatch(setSelectedChat(null)); // Clear selected chat to return to user list
    };

    return (
        <div className="flex h-[100dvh] w-screen overflow-hidden bg-gray-900">
            {/* Sidebar - Hidden on mobile when chat is open, always visible on desktop */}
            <div className={`w-full md:w-2/5 lg:w-1/3 xl:w-1/4 ${selectedChat ? 'hidden md:block' : 'block'}`}>
                <Sidebar onChatSelect={handleChatSelect} />
            </div>

            {/* Chat Area - Hidden on mobile when no chat selected, always visible on desktop */}
            <div className={`w-full flex-1 h-full ${!selectedChat ? 'hidden md:flex' : 'flex'}`}>
                <ChatBox onBackClick={handleBackToSidebar} />
            </div>
        </div>
    );
};

export default Chat;
