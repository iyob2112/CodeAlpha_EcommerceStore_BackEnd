async function userLogout(req, res) {
    try {
        res.json({
            message: "Logged out successfully",
            success: true,
            error: false
        });
    } catch (err) {
        res.json({
            message: err.message || err,
            error: true,
            success: false,
        });
    }
}

module.exports = userLogout;