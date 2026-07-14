const HerLogin = {
    usersKey: "her_users",

    getUsers() {
        return JSON.parse(localStorage.getItem(this.usersKey)) || [];
    },

    login(identifier, password) {
        const users = this.getUsers();

        const user = users.find(user =>
            (
                user.username.toLowerCase() === identifier.toLowerCase() ||
                user.email.toLowerCase() === identifier.toLowerCase()
            ) &&
            user.password === password
        );

        if (!user) {
            return {
                success: false,
                message: "Invalid username, email, or password."
            };
        }

        HerSession.setCurrentUser(user);

        return {
            success: true,
            message: "Login successful.",
            user
        };
    }
};