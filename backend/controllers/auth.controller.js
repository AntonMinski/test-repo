const Schema = require('../models/user.schema');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Blacklist = require('../models/blacklist.schema');
const authenticationMiddleware = require('../middleware/authentication.middleware');

const express = require('express');
const router = express.Router();

// user authentication
const signIn = async (req, res) => {
    // validate request
    let {email,password} = req.body;
    if (!email) return res.status(400).send({ message: 'Email must be filled !' });
    if (!password) return res.status(400).send({ message: 'Password must be filled !' });
    // check user exist or not
    try {
        const user = await Schema.findOne({ email: email })
            if (!user) {
                return res.status(404).send({ message: 'Email not found, please register!.'}); 
            }
            else if (user) {
                // comparing passwords
                const passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
                if (!passwordIsValid) {
                    return res.status(401).send({
                        message: 'Email registered, but password is wrong.',
                        token: null,
                    });
                }
                else if (passwordIsValid) {
                    // sign in token create from user id, 1 day expire
                    const accessToken = jwt.sign(
                        {id: user._id},
                        process.env.JWT_SECRET,
                        {expiresIn: 86400},
                    );
                    return res.status(200).send({
                        user: {
                            id: user._id,
                            name: user.name,
                            email: user.email,
                            role: user.role,
                        },
                        token: accessToken,
                    });
                }
            }
    }
    catch(err) { return res.status(500).send({ message: err || 'An error occured.'}); }
}


const signOut = async (req, res) => {
    const authHeader = req.headers['authorization']; // header and authHeader are same
    const token = authHeader.split(' ')[1];

    if (!token) { return res.status(401).send({message: 'User not logged in'}); }

    const expiredToken = new Blacklist({
        token: token,
    });

    // add token to the blacklist
    try {
        await expiredToken.save();
        return res.status(200).send({message: 'User logged out'});
    } catch (error) {
        return res.status(500).send({message: error || 'Error logging out user'});
    }
};


const register = async (req, res) => {
    // validate requests
    let {name,email,password,gender,role} = req.body;
    if (!req.body) return res.status(400).send({ message:"Content can not be empty!" });
    if (!req.body.name) return res.status(400).send({ message:"Name can not be empty!" });
    if (!req.body.email) return res.status(400).send({ message:"Email can not be empty!" });
    if (!req.body.password) return res.status(400).send({ message:"Password can not be empty!" });
    if (req.body.password.length < 8) return res.status(400).send({ message: 'Password must be equal or more than 8 character!' });
    // check if email already exist
    try {
        const user = await Schema.findOne({ email });

            if (!user) {
                // convert password to hashed
                const encryptedPassword = bcrypt.hashSync(password, 10);
                // initialize newUser data
                const newUser = new Schema({
                    name: name,
                    email: email,
                    password: encryptedPassword,
                });

                const result = await newUser.save();
                    // auto sign in, create token from user id
                    const accessToken = jwt.sign(
                        {id: result._id}, process.env.JWT_SECRET, {expiresIn: 86400},
                    );

                    return res.status(200).send({
                        message: 'User registered successfully!',
                        user: {
                            id: result._id,
                            name: result.name,
                            email: result.email,
                            role: result.role,
                        },
                        token: accessToken,
                    });

            }
            else if (user) {
                return res.status(409).send({ message: 'Email have been registered, please login.' }); }
    }
    catch(err) { return res.status(500).send({ message: err || 'Error registering the user'}); }
}

// sign up
router.post('/register', register);
// sign in
router.post('/login', signIn);
// logout
router.post('/logout', authenticationMiddleware, signOut);

module.exports = router;
