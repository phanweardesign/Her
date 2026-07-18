const HerSession = {
    key: "her_current_user",

    getCurrentUser() {
        return JSON.parse(localStorage.getItem(this.key)) || null;
    },

    setCurrentUser(user) {
        localStorage.setItem(this.key, JSON.stringify(user));
    },

    logout() {
        localStorage.removeItem(this.key);
        redirectTo("login.html");
    },

    isLoggedIn() {
        return this.getCurrentUser() !== null;
    },

    requireLogin() {
        if (!this.isLoggedIn()) {
            redirectTo("login.html");
        }
    }
};