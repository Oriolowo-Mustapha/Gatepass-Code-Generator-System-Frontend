const Auth = {
    saveTokens(authResponse) {
        localStorage.setItem(CONFIG.TOKEN_KEY, authResponse.token);
        localStorage.setItem(CONFIG.REFRESH_TOKEN_KEY, authResponse.refreshToken);
        localStorage.setItem(CONFIG.USER_KEY, JSON.stringify({
            userName: authResponse.userName,
            email: authResponse.email,
            roleName: authResponse.roleName,
        }));
    },

    getToken() {
        return localStorage.getItem(CONFIG.TOKEN_KEY);
    },

    getRefreshToken() {
        return localStorage.getItem(CONFIG.REFRESH_TOKEN_KEY);
    },

    getUser() {
        const raw = localStorage.getItem(CONFIG.USER_KEY);
        return raw ? JSON.parse(raw) : null;
    },

    isAuthenticated() {
        return !!this.getToken();
    },

    getRole() {
        const user = this.getUser();
        return user ? user.roleName : null;
    },

    isAdmin() {
        return this.getRole() === CONFIG.ROLES.ADMIN;
    },

    isSecurity() {
        return this.getRole() === CONFIG.ROLES.SECURITY;
    },

    isHost() {
        return this.getRole() === CONFIG.ROLES.HOST;
    },

    logout() {
        localStorage.removeItem(CONFIG.TOKEN_KEY);
        localStorage.removeItem(CONFIG.REFRESH_TOKEN_KEY);
        localStorage.removeItem(CONFIG.USER_KEY);
        window.location.href = 'index.html';
    },

    // ---- Guards ----
    requireAuth() {
        if (!this.isAuthenticated()) {
            window.location.href = 'index.html';
            return false;
        }
        return true;
    },

    requireRole(role) {
        if (!this.requireAuth()) return false;
        if (this.getRole() !== role) {
            window.location.href = 'dashboard.html';
            return false;
        }
        return true;
    },
};



const UI = {
    toast(message, type = 'success') {
        const container = document.getElementById('toast-container') || UI._createToastContainer();
        const colors = {
            success: 'bg-green-500',
            error: 'bg-red-500',
            warning: 'bg-yellow-500',
            info: 'bg-blue-500',
        };
        const icons = {
            success: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>',
            error: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>',
            warning: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>',
            info: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>',
        };
        const toast = document.createElement('div');
        toast.className = `flex items-center gap-3 ${colors[type]} text-white px-5 py-3 rounded-lg shadow-lg transform transition-all duration-300 translate-x-full opacity-0`;
        toast.innerHTML = `${icons[type] || ''}<span>${message}</span>`;
        container.appendChild(toast);
        requestAnimationFrame(() => {
            toast.classList.remove('translate-x-full', 'opacity-0');
        });
        setTimeout(() => {
            toast.classList.add('translate-x-full', 'opacity-0');
            setTimeout(() => toast.remove(), 300);
        }, 4000);
    },

    _createToastContainer() {
        const container = document.createElement('div');
        container.id = 'toast-container';
        container.className = 'fixed top-5 right-5 z-[9999] flex flex-col gap-3';
        document.body.appendChild(container);
        return container;
    },

    btnLoading(btn, loading = true) {
        if (loading) {
            btn.dataset.originalText = btn.innerHTML;
            btn.disabled = true;
            btn.innerHTML = `
                <svg class="animate-spin h-5 w-5 mr-2 inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                </svg>
                Processing...`;
        } else {
            btn.disabled = false;
            btn.innerHTML = btn.dataset.originalText || 'Submit';
        }
    },

    handleError(err) {
        if (err && err.errors && err.errors.length) {
            err.errors.forEach(e => UI.toast(e, 'error'));
        } else if (err && err.message) {
            UI.toast(err.message, 'error');
        } else {
            UI.toast('An unexpected error occurred.', 'error');
        }
    },
    formatDate(dateStr) {
        if (!dateStr) return '—';
        return new Date(dateStr).toLocaleDateString('en-US', {
            year: 'numeric', month: 'short', day: 'numeric',
        });
    },

    formatDateTime(dateStr) {
        if (!dateStr) return '—';
        return new Date(dateStr).toLocaleString('en-US', {
            year: 'numeric', month: 'short', day: 'numeric',
            hour: '2-digit', minute: '2-digit',
        });
    },

    buildNav(activePage) {
        const user = Auth.getUser();
        const role = user?.roleName;

        const navItems = [
            { id: 'dashboard', label: 'Dashboard', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6', href: 'dashboard.html', roles: null },
            { id: 'gatepass', label: 'Create Gatepass', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z', href: 'gatepass.html', roles: [CONFIG.ROLES.ADMIN, CONFIG.ROLES.HOST] },
            { id: 'security', label: 'Security Ops', icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z', href: 'security.html', roles: [CONFIG.ROLES.SECURITY] },
            { id: 'organization', label: 'Organization', icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4', href: 'organization.html', roles: [CONFIG.ROLES.ADMIN] },
            { id: 'admin', label: 'Admin Panel', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z', href: 'admin.html', roles: [CONFIG.ROLES.ADMIN] },
            { id: 'reports', label: 'Reports', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z', href: 'reports.html', roles: null },
        ];

        const filteredItems = navItems.filter(item => {
            if (!item.roles) return true;
            return item.roles.includes(role);
        });

        return `
        <aside id="sidebar" class="fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 text-white transform -translate-x-full lg:translate-x-0 transition-transform duration-300">
            <div class="flex items-center gap-3 px-6 py-5 border-b border-slate-700">
                <div class="w-10 h-10 bg-emerald-500 rounded-lg flex items-center justify-center">
                    <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
                    </svg>
                </div>
                <div>
                    <h1 class="text-lg font-bold leading-tight">GatePass</h1>
                    <p class="text-xs text-slate-400">Code Generator</p>
                </div>
            </div>
            <nav class="mt-4 px-3 space-y-1">
                ${filteredItems.map(item => `
                    <a href="${item.href}" class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${activePage === item.id ? 'bg-emerald-600 text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white'}">
                        <svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="${item.icon}"/>
                        </svg>
                        ${item.label}
                    </a>
                `).join('')}
            </nav>
            <div class="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-700">
                <div class="flex items-center gap-3 mb-3">
                    <div class="w-9 h-9 bg-emerald-600 rounded-full flex items-center justify-center text-sm font-bold">
                        ${user?.userName?.charAt(0)?.toUpperCase() || 'U'}
                    </div>
                    <div class="min-w-0">
                        <p class="text-sm font-medium truncate">${user?.userName || 'User'}</p>
                        <p class="text-xs text-slate-400 truncate">${role || 'User'}</p>
                    </div>
                </div>
                <button onclick="Auth.logout()" class="w-full flex items-center justify-center gap-2 px-3 py-2 text-sm text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
                    </svg>
                    Sign Out
                </button>
            </div>
        </aside>`;
    },

    buildHeader(title) {
        return `
        <header class="sticky top-0 z-40 bg-white border-b border-gray-200 px-4 lg:px-8 py-4">
            <div class="flex items-center justify-between">
                <div class="flex items-center gap-4">
                    <button id="sidebar-toggle" class="lg:hidden p-2 rounded-lg hover:bg-gray-100">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
                        </svg>
                    </button>
                    <h2 class="text-xl font-bold text-gray-800">${title}</h2>
                </div>
                <div class="flex items-center gap-3">
                    <span class="hidden sm:inline text-sm text-gray-500">Welcome, <strong>${Auth.getUser()?.userName || 'User'}</strong></span>
                </div>
            </div>
        </header>`;
    },

    initSidebar() {
        const toggle = document.getElementById('sidebar-toggle');
        const sidebar = document.getElementById('sidebar');
        const overlay = document.createElement('div');
        overlay.id = 'sidebar-overlay';
        overlay.className = 'fixed inset-0 bg-black/50 z-40 lg:hidden hidden';
        document.body.appendChild(overlay);

        if (toggle && sidebar) {
            toggle.addEventListener('click', () => {
                sidebar.classList.toggle('-translate-x-full');
                overlay.classList.toggle('hidden');
            });
            overlay.addEventListener('click', () => {
                sidebar.classList.add('-translate-x-full');
                overlay.classList.add('hidden');
            });
        }
    },
    renderLayout(activePage, pageTitle, content) {
        document.body.innerHTML = `
            <div class="min-h-screen bg-gray-50">
                ${UI.buildNav(activePage)}
                <div class="lg:ml-64">
                    ${UI.buildHeader(pageTitle)}
                    <main class="p-4 lg:p-8">
                        ${content}
                    </main>
                </div>
            </div>
        `;
        UI.initSidebar();
    },
};
