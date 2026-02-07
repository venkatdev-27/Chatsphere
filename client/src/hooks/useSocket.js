import { useEffect, useRef } from 'react';
import { connectSocket, disconnectSocket, getSocket } from '../services/socket';
import { useDispatch, useSelector } from 'react-redux';
import { addMessage, handleMessageDeleted, updateMessage } from '../redux/slices/messageSlice';
import { toast } from 'react-toastify';
import { addNotification, updateChatLatestMessage, setOnlineUsers, addUserOnline, removeUserOnline, updateUserInChats } from '../redux/slices/chatSlice';

const useSocket = (user) => {
  const dispatch = useDispatch();
  const { selectedChat } = useSelector((state) => state.chat);
  const selectedChatRef = useRef(selectedChat);

  useEffect(() => {
    selectedChatRef.current = selectedChat;
  }, [selectedChat]);

  useEffect(() => {
    if (user) {
      const socket = connectSocket();

      if (socket) {
        socket.on('setup_online_users', (users) => {
           dispatch(setOnlineUsers(users));
        });

        socket.on('user_online', (user) => {
            dispatch(addUserOnline(user));
        });
        
        socket.on('user_offline', (user) => {
            dispatch(removeUserOnline(user));
        });

        socket.on('receive_message', (newMessage) => {
           const currentSelectedChat = selectedChatRef.current;
           
           const isCurrentChat = currentSelectedChat && (currentSelectedChat._id === newMessage.chat._id || currentSelectedChat._id === newMessage.chat);
           
           dispatch(updateChatLatestMessage({
             ...newMessage,
             isCurrentChat,
             incrementUnread: !isCurrentChat // Increment only if not viewing this chat
           }));
           
           if (!isCurrentChat) {
               dispatch(addNotification(newMessage));
               toast.info(`New message from ${newMessage.sender.username}: ${newMessage.content.substring(0, 20)}...`);
           } else {
               dispatch(addMessage(newMessage));
           }
        });

        socket.on('message_deleted', (deletedMessageData) => {
            dispatch(handleMessageDeleted(deletedMessageData));
        });

        socket.on('message_updated', (updatedMessage) => {
            dispatch(updateMessage(updatedMessage));
             // Also update latest message preview if it's the latest one
            dispatch(updateChatLatestMessage({
                 ...updatedMessage,
                 isCurrentChat: false, // Doesn't matter for just updating content
                 incrementUnread: false
            }));
        });

        socket.on('user_updated', (updatedUser) => {
            dispatch(updateUserInChats(updatedUser));
        });

        socket.on('connect_error', (err) => {
            console.error("Socket error:", err.message);
        });
      }
    }

    return () => {
      if (getSocket()) {
        const socket = getSocket();
        socket.off('setup_online_users');
        socket.off('user_online');
        socket.off('user_offline');
        socket.off('receive_message');
        socket.off('message_deleted');
        socket.off('message_updated');
        socket.off('user_updated');
        socket.off('connect_error');
      }
    };
  }, [user, dispatch]);

  return { getSocket, disconnectSocket };
};

export default useSocket;
