
export function getExpirationBadgeColor(isoDate: string) {
    if (!isoDate) return 'text-gray-800 bg-gray-100';

    const expiration = new Date(isoDate);
    const today = new Date();

    today.setHours(0, 0, 0, 0); 
    expiration.setHours(0, 0, 0, 0);

    const timeDiff = expiration.getTime() - today.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));

    if (daysDiff < 0) {
        return 'text-red-800 bg-red-100';
    } else if (daysDiff <= 30) {
        return 'text-orange-800 bg-orange-100';
    } else {
        return 'text-green-800 bg-green-100';
    }
} 