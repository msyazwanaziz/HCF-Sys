// Authentication Script
const USERS = [
    { username: 'admin', password: 'password123', role: 'Super Admin', name: 'Admin' },
    { username: 'staff1', password: 'password123', role: 'Staff', name: 'User 1' },
    { username: 'staff2', password: 'password123', role: 'Staff', name: 'User 2' },
    { username: 'staff3', password: 'password123', role: 'Staff', name: 'User 3' }
];

function checkAuth() {
    const isAuthPage = window.location.pathname.endsWith('login.html');
    const authStatus = localStorage.getItem('hcf_auth_status');
    const currentUser = localStorage.getItem('hcf_auth_user');

    if (!isAuthPage && authStatus !== 'true') {
        window.location.href = 'login.html';
    } else if (isAuthPage && authStatus === 'true') {
        window.location.href = 'index.html';
    }

    if (!isAuthPage) {
        // Update user profile displays
        document.addEventListener('DOMContentLoaded', () => {
            const roleDisplay = document.getElementById('user-role-display') || document.getElementById('user-role');
            if (roleDisplay) {
                roleDisplay.textContent = localStorage.getItem('hcf_auth_role') || 'Staff';
            }
            
            const avatarDisplay = document.getElementById('user-avatar');
            if (avatarDisplay) {
                const name = localStorage.getItem('hcf_auth_name') || 'S';
                avatarDisplay.textContent = name.charAt(0).toUpperCase();
            }

            // Handle Logout button
            const authButton = document.getElementById('auth-button');
            if (authButton) {
                authButton.innerHTML = '<i class="ph ph-sign-out"></i> Logout';
                authButton.addEventListener('click', (e) => {
                    e.preventDefault();
                    logout();
                });
            }
        });
    }
}

function login(username, password) {
    const user = USERS.find(u => u.username === username && u.password === password);
    if (user) {
        localStorage.setItem('hcf_auth_status', 'true');
        localStorage.setItem('hcf_auth_user', user.username);
        localStorage.setItem('hcf_auth_role', user.role);
        localStorage.setItem('hcf_auth_name', user.name);
        window.location.href = 'index.html';
        return true;
    }
    return false;
}

function logout() {
    localStorage.removeItem('hcf_auth_status');
    localStorage.removeItem('hcf_auth_user');
    localStorage.removeItem('hcf_auth_role');
    localStorage.removeItem('hcf_auth_name');
    window.location.href = 'login.html';
}

// Run auth check immediately
checkAuth();
