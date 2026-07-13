/*
   Legacy page wrapper.
   All real signup work is handled by HerAuthService.
*/
window.HerSignup = window.HerSignup || {
    async createAccount(username, email, phone, password) {
        try {
            return await HerAuthService.signup(
                username,
                email,
                phone,
                password
            );
        } catch (error) {
            return {
                success: false,
                message: error.message || "Signup failed."
            };
        }
    }
};
