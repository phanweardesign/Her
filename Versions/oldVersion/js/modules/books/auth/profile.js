const HerProfile = {
    getProfile() {
        return HerSession.getCurrentUser();
    },

    updateProfile(updates) {
        const currentUser = HerSession.getCurrentUser();

        if (!currentUser) {
            return {
                success: false,
                message: "No user is logged in."
            };
        }

        const users = JSON.parse(localStorage.getItem("her_users")) || [];

        const updatedUser = {
            ...currentUser,
            ...updates,
            updatedAt: formatDate()
        };

        const updatedUsers = users.map(user =>
            user.id === currentUser.id ? updatedUser : user
        );

        localStorage.setItem("her_users", JSON.stringify(updatedUsers));
        HerSession.setCurrentUser(updatedUser);

        return {
            success: true,
            message: "Profile updated.",
            user: updatedUser
        };
    }
};