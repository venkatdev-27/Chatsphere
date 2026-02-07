import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createGroupChat } from '../redux/thunks/chatThunks';
import { searchUsers } from '../redux/thunks/authThunks';
import { clearSearchResults } from '../redux/slices/authSlice';
import { toast } from 'react-toastify';
import { getProfilePicUrl } from '../utils/authHelper';

const GroupChatModal = ({ isOpen, onClose }) => {
    const dispatch = useDispatch();
    const { searchResults } = useSelector((state) => state.auth);
    const [groupChatName, setGroupChatName] = useState('');
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSearch = (query) => {
        setSearch(query);
        if (!query) {
            dispatch(clearSearchResults());
            return;
        }
        dispatch(searchUsers(query));
    };

    const handleGroup = (userToAdd) => {
        if (selectedUsers.includes(userToAdd)) {
            toast.warning('User already added');
            return;
        }
        setSelectedUsers([...selectedUsers, userToAdd]);
    };

    const handleDelete = (delUser) => {
        setSelectedUsers(selectedUsers.filter((sel) => sel._id !== delUser._id));
    };

    const clearSearch = () => {
        setSearch('');
        dispatch(clearSearchResults());
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            // If search has text, maybe we want to select the first user?
            // For now, let's just make it submit if valid
            if (groupChatName && selectedUsers.length >= 2) {
                handleSubmit();
            }
        }
    };

    const handleSubmit = async () => {
        if (!groupChatName || !selectedUsers) {
            toast.warning('Please fill all the fields');
            return;
        }

        if (selectedUsers.length < 2) {
            toast.warning('More than 2 users are required to form a group chat');
            return;
        }

        try {
            setLoading(true);
            await dispatch(createGroupChat({
                name: groupChatName,
                users: JSON.stringify(selectedUsers.map((u) => u._id)),
            })).unwrap();
            setLoading(false);
            onClose();
            toast.success('New Group Chat Created!');
        } catch (error) {
            setLoading(false);
            toast.error(error || 'Failed to Create Group');
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 transition-opacity">
            <div className="bg-gray-800 p-4 sm:p-6 rounded-lg w-[95%] max-w-md shadow-2xl border border-gray-700 max-h-[90vh] overflow-y-auto custom-scrollbar">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-white">Create Group Chat</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="flex flex-col gap-4">
                    <input
                        type="text"
                        placeholder="Chat Name"
                        value={groupChatName}
                        onKeyDown={handleKeyDown}
                        className="w-full bg-gray-700 text-white p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        onChange={(e) => setGroupChatName(e.target.value)}
                    />

                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Add Users eg: John, Jane"
                            value={search}
                            onKeyDown={handleKeyDown}
                            className="w-full bg-gray-700 text-white p-2 pr-8 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            onChange={(e) => handleSearch(e.target.value)}
                        />
                        {search && (
                            <button
                                onClick={clearSearch}
                                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                </svg>
                            </button>
                        )}
                    </div>

                    {/* Selected Users Chips */}
                    <div className="flex flex-wrap gap-2">
                        {selectedUsers.map((u) => (
                            <div key={u._id} className="bg-blue-600 text-white px-2 py-1 rounded-full flex items-center gap-1 text-sm">
                                {u.username}
                                <span onClick={() => handleDelete(u)} className="cursor-pointer font-bold hover:text-red-300">×</span>
                            </div>
                        ))}
                    </div>

                    {/* Search Results */}
                    {searchResults?.slice(0, 4).map((user) => (
                        <div
                            key={user._id}
                            onClick={() => handleGroup(user)}
                            className="flex items-center gap-3 p-2 hover:bg-gray-700 rounded cursor-pointer transition-colors"
                        >
                            <img src={getProfilePicUrl(user.pic)} alt={user.username} className="w-8 h-8 rounded-full" />
                            <div>
                                <p className="text-white font-medium">{user.username}</p>
                                <p className="text-xs text-gray-400">{user.email}</p>
                            </div>
                        </div>
                    ))}

                    <button
                        onClick={handleSubmit}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded font-semibold mt-2 transition-colors disabled:opacity-50"
                        disabled={loading}
                    >
                        {loading ? 'Creating...' : 'Create Chat'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default GroupChatModal;
