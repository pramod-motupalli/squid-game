const User = import("../database/User");
// ✅ Create a new user (Removed email field)
const createUser = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = new User({ username, password });
    await user.save();
    res.status(201).json({ message: "User created successfully", user });
  } catch (error) {
    res.status(500).json({ error: "Error creating user", details: error });
  }
};

// ✅ Get all users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: "Error fetching users" });
  }
};

// ✅ Get a user by username
const getUserByUsername = async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username });
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: "Error fetching user" });
  }
};

// ✅ Update user password
const updateUserPassword = async (req, res) => {
  try {
    const { username } = req.params;
    const { newPassword } = req.body;
    const user = await User.findOneAndUpdate(
      { username },
      { password: newPassword },
      { new: true }
    );
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json({ message: "Password updated", user });
  } catch (error) {
    res.status(500).json({ error: "Error updating password" });
  }
};

// ✅ Delete a user
const deleteUser = async (req, res) => {
  try {
    const user = await User.findOneAndDelete({ username: req.params.username });
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json({ message: "User deleted", user });
  } catch (error) {
    res.status(500).json({ error: "Error deleting user" });
  }
};

module.exports = { createUser, getAllUsers, getUserByUsername, updateUserPassword, deleteUser };
