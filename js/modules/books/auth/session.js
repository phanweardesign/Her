const HerSession = {
    key: "her_current_user",

    getCurrentUser() {
        try {
            return JSON.parse(localStorage.getItem(this.key)) || null;
        } catch {
            return null;
        }
    },

    setCurrentUser(user) {
        localStorage.setItem(this.key, JSON.stringify(user));
        localStorage.setItem("her_user", JSON.stringify(user));
    },

    logout() {
        localStorage.removeItem(this.key);
        localStorage.removeItem("her_user");
        window.location.href = "/pages/auth/login.html";
    },

    isLoggedIn() {
        return this.getCurrentUser() !== null;
    },

    requireLogin() {
        if (!this.isLoggedIn()) {
            window.location.href = "/pages/auth/login.html";
            return false;
        }

        return true;
    }
};
