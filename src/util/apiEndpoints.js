const DEFAULT_BASE_URL = 'http://localhost:8080/api/v1.0';

const sanitizeBaseUrl = (baseUrl) => {
    if (!baseUrl || typeof baseUrl !== 'string') {
        return DEFAULT_BASE_URL;
    }

    return baseUrl
        .trim()
        .replace(/^['"]+|['";]+$/g, '')
        .replace(/\/+$/, '');
};

const BASE_URL = sanitizeBaseUrl(import.meta.env.VITE_BASE_URL || DEFAULT_BASE_URL);

const apiEndpoints = {
    FETCH_FILES: `${BASE_URL}/files/my`,
    GET_CREDITS: `${BASE_URL}/users/credits`,
    UPLOAD_FILE: `${BASE_URL}/files/upload`,
    TOGGLE_FILE: (id) => `${BASE_URL}/files/${id}/toggle-public`,
    DOWNLOAD_FILE: (fileId) => `${BASE_URL}/files/public/${fileId}/download`,
    DELETE_FILE: (id) => `${BASE_URL}/files/${id}`,
    CREATE_ORDER: `${BASE_URL}/payments/create-order`,
    VERIFY_PAYMENT: `${BASE_URL}/payments/verify-payment`,
    GET_TRANSACTIONS: `${BASE_URL}/transactions`,
    PUBLIC_FILE_VIEW: (fileId) => `${BASE_URL}/files/public/${fileId}`,
}

export default apiEndpoints;
