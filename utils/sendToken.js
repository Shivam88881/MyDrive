// Create Token and saving in cookie

const sendToken = async(user,statusCode, res) => {
    const accessToken= user.getJWTAccessToken();
    const refreshToken=user.getJWTRefreshToken();

    user.refreshAccessToken = refreshToken;
    user.refreshAccessTokenExpire = Date.now()+15*1000*60*60*24;
    await user.save();

    // options for cookie
    const access_options = {
        expires: new Date(
            Date.now() + process.env.ACCESS_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
        ),
        maxAge: 86400000,
        httpOnly: true,
        secure:true,
        sameSite: 'strict'
    };

    // options for cookie
    const refresh_options = {
        expires: new Date(
            Date.now() + process.env.REFRESH_COOKIE_EXPIRE * 24 * 60 * 60 * 1000 * 15
        ),
        maxAge: 86400000*15,
        httpOnly: true,
        secure:true,
        sameSite: 'strict'
    };

    res.status(statusCode).cookie("access_token", accessToken, access_options).cookie("refresh_token",refreshToken,refresh_options).json({
        success: true,
        user
    });
};

module.exports = sendToken;