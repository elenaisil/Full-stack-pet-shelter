const jwt = require('jsonwebtoken')

const verify = (req,res,next) => {
    // authorize header
    const authHeader = req.header('Authorization')
    console.log("raw header: ", authHeader)

    // if no header -> 400
    if (!authHeader) return res.status(400).json({error: 'access denied. no token provide'})

    const token = authHeader.replace('Bearer ', '')
    // console.log("THE RAW TOKEN IS: ->" + token + "<-");
    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET)
        req.user = verified

        next() // move to next function aka controller

    } catch (error) {
        console.log(error.message)
        res.status(400).json({ error: 'Invalid or expired token.' });
    }
}

module.exports = verify