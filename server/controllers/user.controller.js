const User = require("@models/user.model");
const AuditLog = require("@models/auditLog.model");

const getAllUsers = async (req, res) => {
    console.log("Fetching all users...");
    try {
        const users = await User.find({ isDeleted: false }).select("-password").populate(
            "firm",
            "name",
        );

        console.log(`Found ${users.length} users.`);

        res.status(200).json(users);
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ message: "Server error while fetching users." });
    }
};

const getUserById = async (req, res) => {
    const { id } = req.params;

    try {
        const user = await User.findById(id).populate("firm", "name");

        if (!user || user.isDeleted) {
            return res.status(404).json({ message: "User not found." });
        }

        res.status(200).json(user);
    } catch (error) {
        console.error("Error retrieving user:", error);
        res.status(500).json({ message: "Server error while fetching user." });
    }
};

// ✏️ Update a user by ID
const updateUser = async (req, res) => {
    const { id } = req.params;
    const updates = req.body;

    console.log(`Updating user with ID: ${id}`, updates);

    try {
        const originalUser = await User.findById(id);

        if (!originalUser || originalUser.isDeleted) {
            return res.status(404).json({ message: "User not found." });
        }

        const updatedUser = await User.findByIdAndUpdate(id, updates, {
            new: true,
            runValidators: true,
        });

        // Create audit log
        await AuditLog.create({
            action: "UPDATE_USER",
            performedBy: req.userId || null, // fallback if auth middleware not present
            target: "User",
            targetId: id,
            description: `User "${originalUser.email}" was updated.`,
            metadata: {
                before: {
                    email: originalUser.email,
                    role: originalUser.role,
                    isActive: originalUser.isActive,
                },
                after: {
                    email: updatedUser.email,
                    role: updatedUser.role,
                    isActive: updatedUser.isActive,
                },
            },
        });

        res.status(200).json(updatedUser);
    } catch (error) {
        console.error("Error updating user:", error);
        res.status(500).json({ message: "Server error while updating user." });
    }
};

// ❌ Delete a user by ID (soft delete)
const deleteUser = async (req, res) => {
    const { id } = req.params;

    console.log(id)

    try {
        const deletedUser = await User.findByIdAndUpdate(
            id,
            { isDeleted: true },
            { new: true },
        );

        if (!deletedUser) {
            return res.status(404).json({ message: "User not found." });
        }

        await AuditLog.create({
            action: "DELETE_USER",
            performedBy: req.userId,
            target: "User",
            description: `User "${id}" was marked as deleted.`,
            metadata: {
                deletedAt: new Date().toISOString(),
            },
        });

        res.status(200).json({ message: "User marked as deleted." });
    } catch (error) {
        console.error("Error deleting user:", error);
        res.status(500).json({ message: "Server error while deleting user." });
    }
};

const getUserProfile = async (req, res) => {
    const userId = req.userId; // Assuming userId is set by the auth middleware
    console.log(`Fetching profile for user ID: ${userId}`);
    try {
        const user = await User.findById(userId)
            .select("-hashedPassword") // Exclude sensitive fields
            .populate("firm", "name");
        if (!user || user.isDeleted) {
            return res.status(404).json({ message: "User not found." });
        }
        res.status(200).json(user);
    } catch (error) {
        console.error("Error fetching user profile:", error);
        res.status(500).json({ message: "Server error while fetching user profile." });
    }
};

module.exports = {
    getAllUsers,
    updateUser,
    getUserById,
    deleteUser,
    getUserProfile,
};
