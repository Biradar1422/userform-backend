const User = require('../models/User');

// Create User

exports.createUser = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const newUser = new User({
            username,
            email,
            password,
            photo: req.file ? req.file.path : null
        });

        await newUser.save();

        res.status(201).json({ message: 'User created successfully', user: newUser });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Get User by ID

exports.getUser = async (req, res) => {
    try {
        const userId = req.params.id;
        const searchedUser = await User.findById(userId);

        if (!searchedUser) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json(searchedUser);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Get All Users
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};


// Update Single User by ID
exports.updateUser = async (req, res) => {
    try {
        const userId = req.params.id;
        const { username, email, password } = req.body;

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { username, email, password, updatedAt: Date.now() },
            { new: true, runValidators: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json({ message: 'User updated successfully', user: updatedUser });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Delet Single User by ID
exports.deleteUser = async (req, res) => {
    try {
        const userId = req.params.id;

        const deletedUser = await User.findByIdAndDelete(userId);

        if (!deletedUser) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Update All Users
exports.updateAllUsers = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const updatedUsers = await User.updateMany(
            {},
            { username, email, password, updatedAt: Date.now() },
            { runValidators: true }
        );

        res.json({ message: 'All users updated successfully', updatedCount: updatedUsers.nModified });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Delete All Users
exports.deleteAllUsers = async (req, res) => {
    try {
        const deletedUsers = await User.deleteMany({});

        res.json({ message: 'All users deleted successfully', deletedCount: deletedUsers.deletedCount });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
