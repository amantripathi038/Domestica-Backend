// Create Token and save in cookie
const sendToken = (user, statusCode, res, flag) => {
    const token = user.getJWTToken();
    const options = {
        expires: new Date(Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
        httpOnly: true,
    };
    if (flag === 0) {
        res.status(statusCode).cookie("token", token, options).json({
            success: true,
            customer: user,
            token,
        })
    }
    else {
        res.status(statusCode).cookie("token", token, options).json({
            success: true,
            worker: user,
            token,
        })
    }
}

module.exports = sendToken