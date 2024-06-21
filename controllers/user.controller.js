const User = require("../models/user.model.js");
const TryCatchAsync = require("../middleware/tryCatchAsync");



// Create and Save a new User
exports.create = TryCatchAsync(async(req, res) => {
    const { name, username, email, password } = req.body;

    // Validate request
    if (!name || !username || !email || !password) {
        res.status(400).json({  message: "Content can not be empty!" });
        return;
    }
    
    // Save User in the database
    const newUser = await User.create({
        name: req.body.name,
        username: req.body.username,
        email: req.body.email,
        password: req.body.password
    })
    jsonToken(newUser, 201, res);
});


exports.login = TryCatchAsync(async(req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        res.status(400).json({  message: "Content can not be empty!" });
        return;
    }
    const user = await User.findOne({ email: email });
    if (!user) {
        res.status(401).json({  message: "User not found" });
        return;
    }
    const passwordIsValid = user.comparePassword(password);
    if (user && passwordIsValid) {
        jsonToken(user, 200, res);
    } else {
        res.status(401).json({  message: "Invalid Password" });
    }
});



exports.logout = TryCatchAsync(async(req, res) => {
    res.cookie("access_token", null, {
        expires: new Date(Date.now()),
        httpOnly: true
    });
    res.cookie("refresh_token", null, {
        expires: new Date(Date.now()),
        httpOnly: true
    })
    res.status(200).json({
        success: true,
        message: "Logged Out"
    });
});


exports.loadUser = TryCatchAsync(async(req, res) => {
    const user = await User.findById(req.user._id);
    res.status(200).json({
        success: true,
        user:user
    });
})


exports.resetPassword = TryCatchAsync(async(req, res) => {
    const { password } = req.body;
    if (!password) {
        res.status(400).json({  message: "Content can not be empty!" });
        return;
    }
    const token = req.params.token;
    const user = await User.findOne({ resetPasswordToken: token });
    if (!user) {
        res.status(401).json({  message: "User not found" });
        return;
    }
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
    if (hashedToken !== user.resetPasswordToken || Date.now() > user.resetPasswordExpire) {
        res.status(401).json({  message: "Token Invalid or Expired" });
        return;
    }
    
    user.password = password;
    await user.save();
    res.status(200).json({
        success: true,
        message: "Password reset successfully"
    });
})

exports.changePassword = TryCatchAsync(async(req, res) => {
    const { oldPassword, newPassword } = req.body;
    if (!oldPassword || !newPassword) {
        res.status(400).json({  message: "Content can not be empty!" });
        return;
    }
    const user = await User.findById(req.user._id);
    if (!user) {
        res.status(401).json({  message: "User not found" });
        return;
    }
    const passwordIsValid = user.comparePassword(oldPassword);
    if (!passwordIsValid) {
        res.status(401).json({  message: "Invalid Password" });
        return;
    }
    user.password = newPassword;
    await user.save();
    res.status(200).json({
        success: true,
        message: "Password changed successfully"
    });
})

exports.forgotPassword = TryCatchAsync(async(req, res) => {
    const { email } = req.body;
    const user = await User.findOne({ email: email });
    if (!user) {
        res.status(401).json({  message: "User not found" });
        return;
    }
    const resetToken = user.getResetPasswordToken();
    await user.save();
    res.status(200).json({
        success: true,
        resetToken: resetToken
    });
})