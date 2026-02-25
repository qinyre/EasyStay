/**
 * URL Utilities
 */
export const getImageUrl = (path?: string): string => {
    if (!path) return '';
    // If it is already an absolute URL or base64, return as is
    if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('data:')) {
        return path;
    }

    // Get backend host from env or default
    const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api/v1';

    // Remove /api/vX from the base URL to get the server root
    const host = baseURL.replace(/\/api\/v\d+\/?$/, '');

    // Ensure correct path joining
    return `${host}${path.startsWith('/') ? '' : '/'}${path}`;
};
