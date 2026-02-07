import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { getSocket } from '../services/socket';

const SocketStatusBanner = () => {
    const { isAuthenticated } = useSelector((state) => state.auth);
    const [status, setStatus] = useState('connected');

    useEffect(() => {
        if (!isAuthenticated) return;

        const socket = getSocket();

        const handleConnect = () => setStatus('connected');
        const handleDisconnect = () => setStatus('disconnected');
        const handleConnectError = () => setStatus('disconnected');

        if (socket.connected) {
            setStatus('connected');
        } else {
            setStatus(socket.active ? 'connecting' : 'disconnected');
        }

        socket.on('connect', handleConnect);
        socket.on('disconnect', handleDisconnect);
        socket.on('connect_error', handleConnectError);
        socket.on('reconnect_attempt', () => setStatus('connecting'));

        return () => {
            socket.off('connect', handleConnect);
            socket.off('disconnect', handleDisconnect);
            socket.off('connect_error', handleConnectError);
            socket.off('reconnect_attempt');
        };
    }, [isAuthenticated]);

    if (!isAuthenticated || status === 'connected') return null;

    const statusConfig = {
        connecting: { color: 'bg-yellow-600', text: 'Connecting to server...' },
        disconnected: { color: 'bg-red-600', text: 'Disconnected from server. Reconnecting...' },
    };

    const current = statusConfig[status] || statusConfig.disconnected;

    return (
        <div className={`w-full py-1 text-center text-xs font-bold text-white transition-all duration-300 ${current.color} z-50 fixed top-0 left-0 right-0`}>
            {current.text}
        </div>
    );
};

export default SocketStatusBanner;
