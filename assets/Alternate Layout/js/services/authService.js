/*
   HER AUTHENTICATION SERVICE
   Single source of truth for signup, login, logout and sessions.
*/
window.HerAuthService = window.HerAuthService || {
    async signup(username, email, phone, password) {
        const data = await HerApiService.post("/api/auth/signup", {
            username,
            email,
            phone,
            password
        });

        return {
            success: true,
            message: data.message,
            user: data.user || null
        };
    },

    async login(identifier, password) {
        const data = await HerApiService.post("/api/auth/login", {
            identifier,
            password
        });

        if (data.user) {
            if (typeof saveUser === "function") {
                saveUser(data.user);
            } else {
                localStorage.setItem(
                    "her_user",
                    JSON.stringify(data.user)
                );
                localStorage.setItem(
                    "her_current_user",
                    JSON.stringify(data.user)
                );
            }
        }

        return {
            success: true,
            message: data.message,
            user: data.user || null
        };
    },

    logout() {
        localStorage.removeItem("her_user");
        localStorage.removeItem("her_current_user");
        window.location.href = "/pages/auth/login.html";
    },

    currentUser() {
        if (typeof getUser === "function") {
            return getUser();
        }

        try {
            return JSON.parse(
                localStorage.getItem("her_user") ||
                localStorage.getItem("her_current_user") ||
                "null"
            );
        } catch {
            return null;
        }
    },

    isLoggedIn() {
        return this.currentUser() !== null;
    }
};
