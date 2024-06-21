const AppError = require("../utils/appError");
const jwt = require("jsonwebtoken");
const User = require("../models/UserModel");
const sendToken = require("../utils/sendToken");

exports.isAuthenticateUser = async (req, res, next) => {
    try {
        const { access_token, refresh_token } = req.cookies;

        if (!access_token) {
            if (!refresh_token) {
                return next(new AppError("Please login to access this resource", 401));
            } else {
                console.log("Called")
                const decodedData = jwt.verify(refresh_token, process.env.JWT_REFRESH_SECRET);
                const user = await User.findById(decodedData.id);
                // const user = await User.findOne({ refreshAccessToken: refresh_token });

                if (user) {
                    
                    const sensitiveProperties = ['refreshAccessToken', 'refreshAccessTokenExpire'];
                    sensitiveProperties.forEach(property => delete user[property]);
                    req.user =user;
                    return await sendToken(user, 200, res);

                } else {
                    return next(new AppError("Please login to access this resource", 401));
                }
            }
        }

        const decodedData = jwt.verify(access_token, process.env.JWT_ACCESS_SECRET);
        const user = await User.findById(decodedData.id);

        if (!user) {
            return next(new AppError("Please login to access this resource", 401));
        }

        const sensitiveProperties = ['refreshAccessToken', 'refreshAccessTokenExpire'];
        sensitiveProperties.forEach(property => delete user[property]);
        req.user = user;
        
        next();
    } catch (error) {
        return next(new AppError("Unauthorized", 401));
    }
};

exports.authorizeRole = (...roles) => {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return next(new AppError("Unauthorized", 403));
        }
        next();
    };
};