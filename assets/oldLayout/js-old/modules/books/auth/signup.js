const HerSignup = {
    usersKey: "her_users",

    getUsers() {
        return JSON.parse(localStorage.getItem(this.usersKey)) || [];
    },

    saveUsers(users) {
        localStorage.setItem(this.usersKey, JSON.stringify(users));
    },

    createAccount(username, email, password) {
        const users = this.getUsers();

        const exists = users.some(user =>
            user.username.toLowerCase() === username.toLowerCase() ||
            user.email.toLowerCase() === email.toLowerCase()
        );

        if (exists) {
            return {
                success: false,
                message: "Username or email already exists."
            };
        }

        const newUser = {
            id: createId(),
            username,
            email,
            password,
            createdAt: formatDate()
        };

        users.push(newUser);
        this.saveUsers(users);
        HerSession.setCurrentUser(newUser);

        return {
            success: true,
            message: "Account created successfully.",
            user: newUser
        };
    }
};