const isAdmin = (req,res,next) => {
    // if request user create by bouncer -> admin
    if (req.user && req.user.role == 'admin') {
        next()
    } else {
        res.status(400).json('Access deny not admin')
    }
}

module.exports = isAdmin