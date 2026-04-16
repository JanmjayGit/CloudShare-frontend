const clerkJwtTemplate = import.meta.env.VITE_CLERK_JWT_TEMPLATE;
const REQUEST_TIMEOUT_MS = Number(import.meta.env.VITE_API_TIMEOUT_MS) || 60000;

const withTimeout = (promise, timeoutMs, errorMessage) =>
    Promise.race([
        promise,
        new Promise((_, reject) => {
            window.setTimeout(() => reject(new Error(errorMessage)), timeoutMs);
        }),
    ]);

export const getAuthToken = async (getToken) => {
    if (typeof getToken !== 'function') {
        return null;
    }

    if (clerkJwtTemplate) {
        return withTimeout(
            getToken({ template: clerkJwtTemplate }),
            REQUEST_TIMEOUT_MS,
            'Timed out while fetching your auth token.'
        );
    }

    return withTimeout(
        getToken(),
        REQUEST_TIMEOUT_MS,
        'Timed out while fetching your auth token.'
    );
};

export const getAuthHeaders = async (getToken, extraHeaders = {}) => {
    const token = await getAuthToken(getToken);

    if (!token) {
        throw new Error('You are signed in, but no auth token was returned.');
    }

    return {
        ...extraHeaders,
        Authorization: `Bearer ${token}`,
    };
};

export const getAuthRequestConfig = async (getToken, config = {}) => ({
    ...config,
    timeout: config.timeout ?? REQUEST_TIMEOUT_MS,
    headers: await getAuthHeaders(getToken, config.headers ?? {}),
});
