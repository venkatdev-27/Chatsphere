export const formatDateLabel = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    const messageDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());

    if (messageDate.getTime() === today.getTime()) {
        return 'Today';
    } else if (messageDate.getTime() === yesterday.getTime()) {
        return 'Yesterday';
    } else {
        return date.toLocaleDateString([], { day: '2-digit', month: '2-digit', year: 'numeric' });
    }
};

export const isSameDay = (d1, d2) => {
    const date1 = new Date(d1);
    const date2 = new Date(d2);
    return date1.getFullYear() === date2.getFullYear() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getDate() === date2.getDate();
};
