import React from 'react';

const SystemMessage = ({ message }) => {
    return (
        <div className="flex justify-center my-4">
            <span className="bg-theme-bg-tertiary text-theme-text-muted text-xs px-3 py-1 rounded-full border border-theme-border shadow-sm text-center">
                {message.content}
            </span>
        </div>
    );
};

export default SystemMessage;
