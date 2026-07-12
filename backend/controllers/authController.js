const User = require("../models/User");
const bcrypt = require("bcryptjs");

exports.signup = async (req, res) => {
    try {

        const { username, email, phone, password } = req.body;

        const existingUser = await User.findOne({
            $or: [
                { email },
                { username },
                { phone }
            ]
        });

        if (existingUser) {
            return res.status(400).json({
                message: "User already exists."
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({
            username,
            email,
            phone,
            password: hashedPassword
        });

        await user.save();

        res.status(201).json({
            message: "Account created successfully."
        });

    } catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
};