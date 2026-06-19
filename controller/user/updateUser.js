const userModel = require("../../models/userModel");

async function updateUser(req, res) {
    try {
        const sessionUser = req.userId;
        const { userId, email, name, role } = req.body;

        const payload = {
            ...(email && { email }),
            ...(name && { name }),
            ...(role && { role }),
        };

        const user = await userModel.findById(sessionUser);
        console.log("user.role", user.role);

        if (!user || (user.role !== "ADMIN" && sessionUser !== userId)) {
            return res.status(403).json({
                message: "Unauthorized",
                success: false,
                error: true,
            });
        }

        const updatedUser = await userModel.findByIdAndUpdate(userId, payload, { new: true });

        res.json({
            data: updatedUser,
            message: "User Updated",
            success: true,
            error: false,
        });
    } catch (err) {
        res.status(400).json({
            message: err.message || err,
            error: true,
            success: false,
        });
    }
}

async function deleteUser(req, res) {
    try {
        const sessionUser = req.userId;
        const userIdToDelete = req.params.id;

        const sessionUserData = await userModel.findById(sessionUser);
        console.log("sessionUser.role", sessionUserData?.role);

        if (!sessionUserData || sessionUserData.role !== "ADMIN") {
            return res.status(403).json({
                message: "Only admin can delete users",
                success: false,
                error: true,
            });
        }

        const deletedUser = await userModel.findByIdAndDelete(userIdToDelete);

        if (!deletedUser) {
            return res.status(404).json({
                message: "User not found",
                success: false,
                error: true,
            });
        }

        res.json({
            data: deletedUser,
            message: "User deleted successfully",
            success: true,
            error: false,
        });
    } catch (err) {
        res.status(400).json({
            message: err.message || err,
            error: true,
            success: false,
        });
    }
}

module.exports = {
    updateUser,
    deleteUser,
};
