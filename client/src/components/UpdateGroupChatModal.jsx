import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { renameGroup, addToGroup, removeFromGroup } from '../redux/thunks/chatThunks';
import { searchUsers } from '../redux/thunks/authThunks';
import { clearSearchResults } from '../redux/slices/authSlice';
import { getProfilePicUrl } from '../utils/authHelper';

const UpdateGroupChatModal = ({ isOpen, onClose, fetchMessages }) => {
    const dispatch = useDispatch();
    const { selectedChat } = useSelector((state) => state.chat);
    const { user, searchResults } = useSelector((state) => state.auth);

    const [groupChatName, setGroupChatName] = useState('');
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(false);
    const [usersToAdd, setUsersToAdd] = useState([]); // Stage users to add

    React.useEffect(() => {
        if (isOpen) {
            setUsersToAdd([]);
            setGroupChatName('');
            setSearch('');
            setLoading(false);
            dispatch(clearSearchResults());
        }
    }, [isOpen, dispatch]);

    if (!isOpen || !selectedChat) return null;

    const handleRemove = async (u) => {
        if (selectedChat.groupAdmin._id !== user._id && u._id !== user._id) {
            return;
        }

        try {
            setLoading(true);
            await dispatch(removeFromGroup({ chatId: selectedChat._id, userId: u._id })).unwrap();
            u._id === user._id ? onClose() : fetchMessages();
            setLoading(false);
        } catch (error) {
            setLoading(false);
        }
    };

    const handleAddUser = (u) => {
        if (selectedChat.users.find((i) => i._id === u._id)) {
            return;
        }
        if (usersToAdd.find((i) => i._id === u._id)) {
            return;
        }
        setUsersToAdd([...usersToAdd, u]);
        setSearch(''); // Clear search input
        dispatch(clearSearchResults()); // Optional: clear results or keep them open? 
    };

    const handleRemovePendingUser = (u) => {
        setUsersToAdd(usersToAdd.filter((sel) => sel._id !== u._id));
    };

    const handleSearch = (query) => {
        setSearch(query);

        dispatch(searchUsers(query));
    };

    const clearSearch = () => {
        setSearch('');
        dispatch(clearSearchResults());
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            // If search has text, do nothing or select? 
            // If modifying name, Enter should Save.
            handleSave();
        }
    };

    const handleSave = async () => {
        setLoading(true);
        try {
            if (groupChatName && groupChatName !== selectedChat.chatName) {
                await dispatch(renameGroup({ chatId: selectedChat._id, chatName: groupChatName })).unwrap();
            }

            for (const u of usersToAdd) {
                await dispatch(addToGroup({ chatId: selectedChat._id, userId: u._id })).unwrap();
            }

            setLoading(false);
            setGroupChatName('');
            setUsersToAdd([]);
            fetchMessages(); // Refresh UI
            onClose();

        } catch (error) {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 transition-opacity">
            <div className="bg-gray-800 p-4 sm:p-6 rounded-lg w-[95%] max-w-md shadow-2xl border border-gray-700 max-h-[90vh] overflow-y-auto custom-scrollbar">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-white">{selectedChat.chatName}</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="flex flex-col gap-4">

                    {/* Rename Group - Admin Only & Must be in group */}
                    {selectedChat.groupAdmin._id === user._id && selectedChat.users.some(u => u._id === user._id) && (
                        <div>
                            <input
                                type="text"
                                placeholder={selectedChat.chatName} // Show current name as placeholder
                                value={groupChatName}
                                className="w-full bg-gray-700 text-white p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                onChange={(e) => setGroupChatName(e.target.value)}
                                onKeyDown={handleKeyDown} // Enter to save rename
                            />
                        </div>
                    )}

                    {/* Add User - Admin Only & Must be in group */}
                    {selectedChat.groupAdmin._id === user._id && selectedChat.users.some(u => u._id === user._id) && (
                        <>
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Add User to Group"
                                    value={search}
                                    className="w-full bg-gray-700 text-white p-2 pr-8 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    onChange={(e) => handleSearch(e.target.value)}
                                    onFocus={() => handleSearch(search)}
                                // onKeyDown={handleKeyDown} // Maybe don't save on Enter here? Only for renaming?
                                // Actually user might expect Enter to ADD the top user, or SAVE changes? 
                                // Let's stick to X button here to avoid accidental Saves while searching users.
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

                            {/* Selected/Pending Users Chips */}
                            {usersToAdd.length > 0 && (
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {usersToAdd.map((u) => (
                                        <div key={u._id} className="bg-green-600 text-white px-2 py-1 rounded-full flex items-center gap-1 text-xs">
                                            {u.username}
                                            <span onClick={() => handleRemovePendingUser(u)} className="cursor-pointer font-bold hover:text-green-200">×</span>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Search Results */}
                            {searchResults?.slice(0, 4).map((user) => (
                                <div
                                    key={user._id}
                                    onClick={() => handleAddUser(user)}
                                    className="flex items-center gap-3 p-2 hover:bg-gray-700 rounded cursor-pointer transition-colors"
                                >
                                    <img src={getProfilePicUrl(user.pic)} alt={user.username} className="w-8 h-8 rounded-full" />
                                    <div>
                                        <p className="text-white font-medium">{user.username}</p>
                                        <p className="text-xs text-gray-400">{user.email}</p>
                                    </div>
                                </div>
                            ))}
                        </>
                    )}

                    {/* Members List */}
                    <h3 className="text-gray-400 text-sm font-semibold mt-2">Group Members</h3>
                    <div className="flex flex-col gap-2 mb-4 max-h-60 overflow-y-auto custom-scrollbar">
                        {selectedChat.users.map((u) => (
                            <div key={u._id} className="flex items-center justify-between p-2 bg-gray-700/50 rounded-lg hover:bg-gray-700 transition-colors">
                                <div className="flex items-center gap-3 overflow-hidden">
                                    <img src={getProfilePicUrl(u.pic)} alt={u.username} className="w-10 h-10 rounded-full object-cover flex-shrink-0" />
                                    <div className="flex flex-col min-w-0">
                                        <span className="text-white font-medium text-sm truncate">{u.username} {u._id === selectedChat.groupAdmin._id && <span className="text-xs text-yellow-500 ml-1">(Admin)</span>}</span>
                                        <span className="text-gray-400 text-xs truncate">{u.email}</span>
                                        <span className="text-gray-400 text-xs truncate">{u.mobile}</span>
                                    </div>
                                </div>
                                {/* Show remove button if admin is logged in and user matches logic */}
                                {(selectedChat.groupAdmin._id === user._id && u._id !== user._id) && (
                                    <button
                                        onClick={() => handleRemove(u)}
                                        className="bg-red-600 hover:bg-red-700 text-white p-1.5 rounded-full transition-colors flex-shrink-0 ml-2"
                                        title="Remove User"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                        </svg>
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Exited Users List */}
                    {selectedChat.removedUsers && selectedChat.removedUsers.length > 0 && (
                        <>
                            <h3 className="text-gray-400 text-sm font-semibold mt-4 mb-2">Exited Users</h3>
                            <div className="flex flex-col gap-2 mb-4 max-h-40 overflow-y-auto custom-scrollbar">
                                {selectedChat.removedUsers.map((u) => (
                                    <div key={u._id} className="flex items-center justify-between p-2 bg-gray-700/30 rounded-lg opacity-75">
                                        <div className="flex items-center gap-3 overflow-hidden">
                                            <img src={getProfilePicUrl(u.pic)} alt={u.username} className="w-8 h-8 rounded-full object-cover grayscale flex-shrink-0" />
                                            <div className="flex flex-col min-w-0">
                                                <span className="text-gray-300 font-medium text-sm truncate">{u.username}</span>
                                                <span className="text-gray-500 text-xs truncate">{u.email}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}

                    <div className="border-t border-gray-700 mt-2 pt-2 flex flex-col gap-1.5 items-start sm:items-stretch">
                        {/* Save Button - Admin Only & Must be in group */}
                        {selectedChat.groupAdmin._id === user._id && selectedChat.users.some(u => u._id === user._id) && (
                            <button
                                onClick={handleSave}
                                disabled={loading}
                                className="
        w-fit sm:w-full
        bg-blue-600 hover:bg-blue-700
        disabled:bg-blue-800 disabled:cursor-not-allowed
        text-white
        px-3 py-1.5 sm:px-4 sm:py-2
        rounded-md
        transition-all font-medium
        text-xs sm:text-sm
        flex items-center justify-center gap-1.5
        shadow-sm sm:shadow-md
      "
                            >
                                Save
                            </button>
                        )}

                        {/* Leave Group */}
                        <button
                            onClick={() => handleRemove(user)}
                            className="
      w-fit sm:w-full
      bg-red-600 hover:bg-red-700
      text-white
      px-3 py-1.5 sm:px-4 sm:py-2
      rounded-md
      transition-all font-medium
      text-xs sm:text-sm
      flex items-center justify-center gap-1.5
      shadow-sm sm:shadow-md
    "
                        >
                            Leave Group
                        </button>
                    </div>


                </div>
            </div>
        </div>
    );
};

export default UpdateGroupChatModal;
