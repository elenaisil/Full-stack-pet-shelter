const bcrypt =require('bcrypt')
const jwt = require('jsonwebtoken')

const Adopter = require('../model/Adopter')
// authentication
// signup
const signup = async (req,res) =>{
    const {name, email, phone, address, city, password} = req.body
    try {
        // check if email already exist
        const user = await Adopter.findByEmail(email)
        if (user) {
            return res.status(400).json({error: 'uhhhh... i think u already sign up, so log in'})
        }

        // hash password wth salt
        const salt = await bcrypt.genSalt(10)
        const hashPass = await bcrypt.hash(password,salt)

        // save user to db with hash
        const newUser = await Adopter.create({name, email, phone, address, city, hashPass})
        res.status(200).json({message: "Signup successful! :)", user:newUser})
    } catch (e) {
        console.error(e.message)
        res.status(500).json({e: 'sth wrong :( cannot signup'})
    }
}
// login
const login = async (req,res) => {
    const {email, password} = req.body
    try {
        //find email
        const user = await Adopter.findByEmail(email)
        if (!user) {
            // user havent signup
            return res.status(400).json({error: 'either u havent sign up or email invalid'})
        }

        // now that we get email lets compare password
        const validPass = await bcrypt.compare(password, user.password)
        if (!validPass) return res.status(400).json({error: 'password wrong'})

        // add token
        const token = jwt.sign(
            {
                id: user.id,
                role: user.role,
            },
            process.env.JWT_SECRET,
            {expiresIn: '24h'}
        )

        // display in frontend
        res.json({
            message: "Login successful!",
            token: token,
            adopterId: user.id,
            name: user.name
        })
    } catch (e) {
        console.log(e.message)
        res.status(500).json({ e: 'Internal server error during login' });
    }
}


// for admin
const getAllAdopters = async (req, res) => {
    try {
        const adopters = await Adopter.findAll()
        res.json(adopters);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const getAdopterById = async (req, res) => {
    try {
        const {id} = req.params
        const adopter = await Adopter.findById(id)
        if (!adopter) return res.status(404).json({ message: "Adopter not found" });
        res.json(adopter);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = {
    signup,
    login,
    getAdopterById,
    getAllAdopters
}