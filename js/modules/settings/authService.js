const HerAuthService = {
    signup(username, email, password) {
        return HerSignup.createAccount(username, email, password);
    },

    login(identifier, password) {
        return HerLogin.login(identifier, password);
    },

    logout() {
        HerSession.logout();
    },

    currentUser() {
        return HerSession.getCurrentUser();
    }
};