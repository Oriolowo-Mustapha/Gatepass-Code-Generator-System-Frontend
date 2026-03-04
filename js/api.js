const API = {
    _refreshPromise: null,

    async _request(endpoint, options = {}) {
        const url = `${CONFIG.API_BASE_URL}${endpoint}`;
        const headers = { 'Content-Type': 'application/json', ...options.headers };

        const token = Auth.getToken();
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        // Skip refresh logic for auth endpoints to prevent recursive loops
        const isAuthEndpoint = endpoint.startsWith('/auth/');

        try {
            const response = await fetch(url, { ...options, headers });

            if (response.status === 401 && !isAuthEndpoint && Auth.getRefreshToken()) {
                // Use a shared promise so concurrent calls don't each trigger a refresh
                if (!API._refreshPromise) {
                    API._refreshPromise = API.auth.refreshToken().finally(() => {
                        API._refreshPromise = null;
                    });
                }
                const refreshed = await API._refreshPromise;
                if (refreshed) {
                    headers['Authorization'] = `Bearer ${Auth.getToken()}`;
                    const retryResponse = await fetch(url, { ...options, headers });
                    return API._handleResponse(retryResponse);
                } else {
                    Auth.logout();
                    return;
                }
            }

            return API._handleResponse(response);
        } catch (error) {
            console.error('API request failed:', error);
            throw { succeeded: false, message: 'Network error. Please check your connection and ensure the API server is running.', errors: [error.message] };
        }
    },

    async _handleResponse(response) {
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
            const data = await response.json();
            if (!response.ok && !data.succeeded) {
                throw data;
            }
            return data;
        }
        if (!response.ok) {
            throw { succeeded: false, message: `HTTP ${response.status}: ${response.statusText}` };
        }
        return { succeeded: true };
    },

    auth: {
        login(data) {
            return API._request('/auth/login', {
                method: 'POST',
                body: JSON.stringify(data),
            });
        },

        async refreshToken() {
            try {
                const result = await API._request('/auth/refresh-token', {
                    method: 'POST',
                    body: JSON.stringify({
                        jwtToken: Auth.getToken(),
                        refreshToken: Auth.getRefreshToken(),
                    }),
                });
                if (result.succeeded && result.data) {
                    Auth.saveTokens(result.data);
                    return true;
                }
                return false;
            } catch {
                return false;
            }
        },

        forgotPassword(data) {
            return API._request('/auth/forgot-password', {
                method: 'POST',
                body: JSON.stringify(data),
            });
        },

        resetPassword(data) {
            return API._request('/auth/reset-password', {
                method: 'POST',
                body: JSON.stringify(data),
            });
        },
    },

    gatepass: {
        create(data) {
            return API._request('/gatepassrequests', {
                method: 'POST',
                body: JSON.stringify(data),
            });
        },
    },

    security: {
        verify(data) {
            return API._request('/security/verify', {
                method: 'POST',
                body: JSON.stringify(data),
            });
        },

        checkIn(data) {
            return API._request('/security/checkin', {
                method: 'POST',
                body: JSON.stringify(data),
            });
        },

        checkOut(data) {
            return API._request('/security/checkout', {
                method: 'POST',
                body: JSON.stringify(data),
            });
        },
    },

    organization: {
        getDepartments() {
            return API._request('/organization/departments');
        },

        createDepartment(data) {
            return API._request('/organization/departments', {
                method: 'POST',
                body: JSON.stringify(data),
            });
        },

        getAccessPoints() {
            return API._request('/organization/accesspoints');
        },

        createAccessPoint(data) {
            return API._request('/organization/accesspoints', {
                method: 'POST',
                body: JSON.stringify(data),
            });
        },
    },

    admin: {
        createUser(data) {
            return API._request('/admin/users', {
                method: 'POST',
                body: JSON.stringify(data),
            });
        },

        getStaffUsers(role) {
            const query = role ? `?role=${encodeURIComponent(role)}` : '';
            return API._request(`/admin/users${query}`);
        },

        getStaffUser(id) {
            return API._request(`/admin/users/${id}`);
        },

        updateStaffUser(id, data) {
            return API._request(`/admin/users/${id}`, {
                method: 'PUT',
                body: JSON.stringify(data),
            });
        },

        deleteStaffUser(id) {
            return API._request(`/admin/users/${id}`, {
                method: 'DELETE',
            });
        },

        getSettings() {
            return API._request('/admin/settings');
        },

        updateSetting(data) {
            return API._request('/admin/settings', {
                method: 'PUT',
                body: JSON.stringify(data),
            });
        },

        getAuditLogs(startDate, endDate) {
            let query = '';
            const params = [];
            if (startDate) params.push(`startDate=${startDate}`);
            if (endDate) params.push(`endDate=${endDate}`);
            if (params.length) query = '?' + params.join('&');
            return API._request(`/admin/auditlogs${query}`);
        },
    },

    reports: {
        getDailyLog(date) {
            return API._request(`/reports/daily-log?date=${date}`);
        },

        getAdminStatistics() {
            return API._request('/reports/statistics/admin');
        },

        getHostStatistics() {
            return API._request('/reports/statistics/host');
        },

        getSecurityStatistics() {
            return API._request('/reports/statistics/security');
        },

        getOverstays() {
            return API._request('/reports/overstays');
        },
    },
};
