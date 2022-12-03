function saveUser(user, res, flag) {
    if (flag === 1) {
        user.save().then(() => {
            res.status(200).json({
                success: true,
                worker: user
            })
        }).catch((error) => {
            console.log(error)
            res.status(400).json({
                success: false,
            })
        })
    }
    else {
        user.save().then(() => {
            res.status(200).json({
                success: true,
                customer: user
            })
        }).catch((error) => {
            console.log(error)
            res.status(400).json({
                success: false,
            })
        })
    }
}

module.exports = saveUser