const CONFIG = {   
    API_BASE_URL: 'https://localhost:7130/api',

    TOKEN_KEY: 'gatepass_token',
    REFRESH_TOKEN_KEY: 'gatepass_refresh_token',
    USER_KEY: 'gatepass_user',

    ROLES: {
        ADMIN: 'Administrator',
        SECURITY: 'Security',
        HOST: 'Host'
    },

    GATEPASS_TYPES: {
        0: 'Visitor',
        1: 'Employee',
        2: 'Contractor',
        3: 'Vehicle',
        4: 'Material',
        5: 'Others',
    },

    APPROVAL_STATUSES: {
        0: 'Pending',
        1: 'Approved',
        2: 'Rejected',
        3: 'Modified',
    },

    STATUS_COLORS: {
        Pending: 'bg-yellow-100 text-yellow-800',
        Approved: 'bg-green-100 text-green-800',
        Rejected: 'bg-red-100 text-red-800',
        Modified: 'bg-blue-100 text-blue-800',
    },
};
