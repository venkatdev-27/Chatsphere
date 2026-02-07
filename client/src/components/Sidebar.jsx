import React, { useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchChats, accessChat } from '../redux/thunks/chatThunks';
import ChatList from './ChatList';
import { logout, clearSearchResults } from '../redux/slices/authSlice';
import { updateProfile, searchUsers } from '../redux/thunks/authThunks';
import { disconnectSocket } from '../services/socket';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import GroupChatModal from './GroupChatModal';
import ThemeToggle from './ThemeToggle';

const Sidebar = ({ onChatSelect }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { chats, loading, onlineUsers } = useSelector((state) => state.chat);
    const { user, searchResults } = useSelector((state) => state.auth);

    const fileInputRef = useRef(null);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    useEffect(() => {
        if (user) {
            dispatch(fetchChats());
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
        if (!query) {
            dispatch(clearSearchResults());
            return;
        }
        dispatch(searchUsers(query));
    };

    const accessUserChat = (userId) => {
        dispatch(accessChat(userId));
        dispatch(clearSearchResults());
    };

    return (
        <div className="w-full h-full bg-theme-bg-secondary border-r border-theme-border flex flex-col relative">
            {/* Header */}
            <div className="p-4 bg-theme-bg-tertiary border-b border-theme-border flex justify-between items-center shadow-sm">
                <div className="flex items-center gap-3">
                    <h2 className="text-xl font-bold text-theme-text-primary tracking-wide">Chats</h2>
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
                                    src={user?.pic}
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
                    onChange={handleSearch}
                    placeholder="Search users..."
                    className="w-full bg-theme-bg-tertiary text-theme-text-primary rounded-lg px-4 py-2 focus:outline-none focus:ring-1 focus:ring-theme-primary placeholder-theme-text-muted"
                />
                {searchResults.length > 0 && (
                    <div className="absolute top-12 left-3 right-3 bg-theme-bg-tertiary border border-theme-border rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto custom-scrollbar">
                        {searchResults.map(u => (
                            <div
                                key={u._id}
                                onClick={() => accessUserChat(u._id)}
                                className="flex items-center p-2 cursor-pointer hover:bg-theme-bg-secondary transition-colors"
                            >
                                <img src={u.pic} alt={u.username} className="w-8 h-8 rounded-full mr-3 object-cover" />
                                <div>
                                    <p className="text-sm font-semibold text-theme-text-primary">{u.username}</p>
                                    <p className="text-xs text-theme-text-secondary">{u.email}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>


            {/* Online Users List */}
            <div className="px-4 py-2 border-b border-theme-border">
                <div className="flex space-x-3 overflow-x-auto pb-2 custom-scrollbar">
                    {onlineUsers.map((u) => (
                        u._id !== user._id && (
                            <div
                                key={u._id}
                                onClick={() => dispatch(accessChat(u._id))}
                                className="flex flex-col items-center min-w-[50px] cursor-pointer group"
                            >
                                <div className="relative">
                                    <img
                                        src={u.pic}
                                        alt={u.username}
                                        className="w-10 h-10 rounded-full border-2 border-green-500 object-cover group-hover:scale-105 transition-transform"
                                    />
                                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-success-color rounded-full border-2 border-theme-bg-secondary"></div>
                                </div>
                                <span className="text-xs text-theme-text-secondary mt-1 truncate w-12 text-center group-hover:text-theme-text-primary transition-colors">{u.username.split(' ')[0]}</span>
                            </div>
                        )
                    ))}
                    {onlineUsers.length <= 1 && (
                        <span className="text-xs text-theme-text-muted italic">No one else is online</span>
                    )}
                </div>
            </div>

            {/* Chat List */}
            <div className="flex-1 overflow-hidden">
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
