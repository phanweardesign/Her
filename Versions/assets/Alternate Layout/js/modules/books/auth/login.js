/*
   Legacy page wrapper.
   All real login work is handled by HerAuthService.
*/
window.HerLogin = window.HerLogin || {
    async login(identifier, password) {
        try {
            return await HerAuthService.login(identifier, password);
        } catch (error) {
            return {
                success: false,
                message: error.message || "Login failed."
            };
        }
    },

    logout() {
        HerAuthService.logout();
    },

    currentUser() {
        return HerAuthService.currentUser();
    }
};
