import React, { useEffect, useRef, useState, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchChats, accessChat } from '../redux/thunks/chatThunks';
import ChatList from './ChatList';
import { logout, clearSearchResults } from '../redux/slices/authSlice';
import { updateProfile, searchUsers, fetchAllUsers } from '../redux/thunks/authThunks';
import { disconnectSocket } from '../services/socket';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import GroupChatModal from './GroupChatModal';
import ThemeToggle from './ThemeToggle';
import { getProfilePicUrl } from '../utils/authHelper';
import { deleteChat } from '../redux/thunks/chatThunks';

const Sidebar = ({ onChatSelect }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { chats, loading, onlineUsers } = useSelector((state) => state.chat);
    const { user, searchResults, allUsers } = useSelector((state) => state.auth);

    const fileInputRef = useRef(null);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeUserMenu, setActiveUserMenu] = useState(null); // Store userId for open menu



    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    useEffect(() => {
        if (user) {
            dispatch(fetchChats());
            dispatch(fetchAllUsers());
        }
    }, [dispatch, user]);

    const handleLogout = () => {
        dispatch(logout());
        disconnectSocket();
        navigate('/login');
    };

    const handleProfileClick = () => {
        fileInputRef.current.click();
    };

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            const formData = new FormData();
            formData.append('pic', file);

            try {
                await dispatch(updateProfile(formData)).unwrap();
                toast.success('Profile picture updated! 🎉');
                e.target.value = '';
            } catch (error) {
                toast.error(error || 'Failed to update profile picture');
                e.target.value = '';
            }
        }
    };

    const handleSearch = (e) => {
        const query = e.target.value;
        setSearchQuery(query);
        if (!query) {
            dispatch(clearSearchResults());
            return;
        }
        dispatch(searchUsers(query));
    };

    const clearSearch = () => {
        setSearchQuery('');
        dispatch(clearSearchResults());
    };

    const accessUserChat = (userId) => {
        dispatch(accessChat(userId));
        setSearchQuery('');
        dispatch(clearSearchResults());
    };

    const handleDeleteChat = async (e, userId) => {
        e.stopPropagation(); // Prevent selecting the chat
        setActiveUserMenu(null); // Close menu

        // Find the chat associated with this user
        const chatToDelete = chats.find(c => !c.isGroupChat && c.users.some(u => u._id === userId));

        if (chatToDelete) {
            try {
                await dispatch(deleteChat(chatToDelete._id)).unwrap();
                toast.success('Chat deleted successfully');
            } catch (error) {
                toast.error('Failed to delete chat');
            }
        } else {
            toast.info('No chat history to delete');
        }
    };

    const toggleUserMenu = (e, userId) => {
        e.stopPropagation();
        if (activeUserMenu === userId) {
            setActiveUserMenu(null);
        } else {
            setActiveUserMenu(userId);
        }
    };

    // Close menus when clicking outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (!e.target.closest('.user-menu')) {
                setActiveUserMenu(null);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="w-full h-full bg-theme-bg-secondary border-r border-theme-border flex flex-col relative">
            {/* Header */}
            <div className="p-3 md:p-4 bg-theme-bg-tertiary border-b border-theme-border flex justify-between items-center shadow-sm">
                <div className="flex items-center gap-3">
                    <h2 className="text-lg md:text-xl font-bold text-theme-text-primary tracking-wide">Chats</h2>
                </div>
                <div className="flex items-center gap-2">
                    {/* Theme Toggle */}
                    <ThemeToggle />

                    {/* Hamburger Menu Container */}
                    <div className="relative group">
                        {/* Animated Hamburger/X Icon */}
                        <button
                            onClick={toggleMenu}
                            className="p-2 text-theme-text-secondary hover:text-theme-text-primary focus:outline-none"
                            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
                        >
                            <div className="w-6 h-6 flex flex-col justify-center items-center">
                                {/* Top line */}
                                <span
                                    className={`bg-current h-0.5 w-6 rounded transition-all duration-300 ease-in-out ${isMenuOpen ? 'rotate-45 translate-y-1.5' : ''
                                        }`}
                                />
                                {/* Middle line */}
                                <span
                                    className={`bg-current h-0.5 w-6 rounded transition-all duration-300 ease-in-out my-1 ${isMenuOpen ? 'opacity-0' : ''
                                        }`}
                                />
                                {/* Bottom line */}
                                <span
                                    className={`bg-current h-0.5 w-6 rounded transition-all duration-300 ease-in-out ${isMenuOpen ? '-rotate-45 -translate-y-1.5' : ''
                                        }`}
                                />
                            </div>
                        </button>
                    </div>
                </div>


                {/* Dropdown Menu */}
                {isMenuOpen && (
                    <div className="absolute right-0 top-12 bg-theme-bg-tertiary border border-theme-border rounded-lg shadow-xl p-4 flex flex-col items-center gap-3 w-56 z-50">
                        <input
                            type="file"
                            ref={fileInputRef}
                            style={{ display: 'none' }}
                            onChange={handleFileChange}
                            accept="image/*"
                        />






                        {/* Profile Picture */}
                        <div className="flex flex-col items-center gap-3 w-full">
                            <div className="relative group/profile">
                                <img
                                    src={getProfilePicUrl(user?.pic)}
                                    alt="Profile"
                                    className="w-20 h-20 rounded-full border-2 border-transparent hover:border-theme-primary transition-all object-cover"
                                    title='Your profile picture'
                                />
                                <button
                                    onClick={handleProfileClick}
                                    className="absolute bottom-0 right-0 p-1.5 bg-theme-primary text-white rounded-full hover:bg-theme-primary-hover shadow-lg transition-colors border-2 border-theme-bg-tertiary"
                                    title="Update profile picture"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                    </svg>
                                </button>
                            </div>

                            {/* Username */}
                            <div className="text-center w-full">
                                <p className="text-theme-text-primary font-semibold text-base">{user?.username || 'User'}</p>
                            </div>

                            {/* Email */}
                            <div className="text-center w-full">
                                <p className="text-xs text-theme-text-muted uppercase tracking-wider mb-1">Email</p>
                                <p className="text-theme-text-secondary text-sm break-all">{user?.email || 'N/A'}</p>
                            </div>

                            {/* Mobile Number */}
                            <div className="text-center w-full">
                                <p className="text-xs text-theme-text-muted uppercase tracking-wider mb-1">Mobile</p>
                                <p className="text-theme-text-secondary text-sm">{user?.mobile || 'N/A'}</p>
                            </div>
                        </div>

                        <div className="w-full border-t border-theme-border"></div>

                        {/* Logout Button */}
                        <button
                            onClick={handleLogout}
                            className="w-full bg-red-600 hover:bg-red-700 text-white text-sm px-4 py-2 rounded transition-colors flex items-center justify-center gap-2"
                        >
                            <span>Logout</span>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                        </button>
                    </div>
                )}
            </div>

            {/* Search */}
            <div className="p-3 relative">
                <input
                    type="text"
                    value={searchQuery}
                    onChange={handleSearch}
                    placeholder="Search users..."
                    className="w-full bg-theme-bg-tertiary text-theme-text-primary rounded-lg px-4 py-2 pr-10 focus:outline-none focus:ring-1 focus:ring-theme-primary placeholder-theme-text-muted transition-all"
                />

                {/* Clear Button */}
                {searchQuery && (
                    <button
                        onClick={clearSearch}
                        className="absolute right-5 top-1/2 -translate-y-1/2 text-theme-text-secondary hover:text-theme-text-primary transition-colors p-1 rounded-full hover:bg-theme-bg-secondary"
                        title="Clear search"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                    </button>
                )}
                {searchResults.length > 0 && (
                    <div className="absolute top-12 left-3 right-3 bg-theme-bg-tertiary border border-theme-border rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto scrollbar-hide">
                        {searchResults.map(u => (
                            <div
                                key={u._id}
                                onClick={() => accessUserChat(u._id)}
                                className="flex items-center p-2 cursor-pointer hover:bg-theme-bg-secondary transition-colors"
                            >
                                <img src={getProfilePicUrl(u.pic)} alt={u.username} className="w-8 h-8 rounded-full mr-3 object-cover" />
                                <div>
                                    <p className="text-sm font-semibold text-theme-text-primary">{u.username}</p>
                                    <p className="text-xs text-theme-text-secondary">{u.email}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>


            {/* Quick Access Users List (All Users with Status) */}
            <div className="px-4 py-2 border-b border-theme-border">
                <div className="flex space-x-3 overflow-x-scroll pb-2 scrollbar-hide touch-pan-x">
                    {allUsers.map((u) => {
                        const isOnline = onlineUsers.some(onlineUser => onlineUser._id === u._id);
                        return (
                            <div
                                key={u._id}
                                onClick={() => dispatch(accessChat(u._id))}
                                className="flex flex-col items-center min-w-[60px] cursor-pointer group relative p-1 rounded-lg hover:bg-theme-bg-secondary transition-colors"
                            >
                                <div className="relative">
                                    <img
                                        src={getProfilePicUrl(u.pic)}
                                        alt={u.username}
                                        className={`w-12 h-12 rounded-full border-2 object-cover group-hover:scale-105 transition-transform ${isOnline ? 'border-green-500' : 'border-theme-border'}`}
                                    />
                                    <div className={`absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-theme-bg-secondary ${isOnline ? 'bg-success-color' : 'bg-gray-400'}`}></div>
                                </div>
                                <span className={`text-xs mt-1 truncate w-14 text-center transition-colors ${isOnline ? 'text-theme-text-primary font-medium' : 'text-theme-text-secondary group-hover:text-theme-text-primary'}`}>
                                    {u.username.split(' ')[0]}
                                </span>
                            </div>
                        );
                    })}
                    {allUsers.length === 0 && (
                        <span className="text-xs text-theme-text-muted italic">No contacts yet</span>
                    )}
                </div>
            </div>

            {/* Chat List */}
            <div className="flex-1 min-h-0 overflow-hidden">
                {loading ? (
                    <div className="text-center text-theme-text-muted mt-5">Loading chats...</div>
                ) : (
                    <ChatList chats={chats} onChatSelect={onChatSelect} />
                )}
            </div>

            {/* Floating Action Button for New Group */}
            <button
                onClick={() => setIsGroupModalOpen(true)}
                className="absolute bottom-6 right-6 p-4 bg-theme-primary hover:bg-theme-primary-hover text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 z-20 group"
                aria-label="Create New Group"
                title="Create New Group"
            >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                </svg>
                {/* Tooltip for desktop */}
                <span className="absolute right-full mr-2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none hidden md:block">
                    New Group
                </span>
            </button>

            <GroupChatModal isOpen={isGroupModalOpen} onClose={() => setIsGroupModalOpen(false)} />
        </div>
    );
};

export default Sidebar;
