const Schema = require('../models/user.schema');
const jwt = require('jsonwebtoken');
const Blacklist = require('../models/blacklist.schema');

// this middleware protects tenants rotes
module.exports = async (req, res, next) => {
    try {
        if (req.headers.authorization) {
            const token = req.headers.authorization.split(' ')[1];
            if (await checkBlacklist(token)) {
                return res.status(401).send({message: 'Session expired, please login again.'});
            }

            const decodedResult = jwt.verify(token, process.env.JWT_SECRET);
            const user = await Schema.findOne({_id: decodedResult.id});
            user.id = user._id.toString();
            if (!user) {
                return res.status(401).send({ message: 'Not authenticated.' });
            }
            req.user = user;
            next();
        } else {
            return res.status(401).send({ message: 'Not authenticated.' });
        }

    } catch (error) {
        console.log('error:', error);
        res.status(401).json({
            error: new Error('Invalid request!')
        });
    }
};

async function checkBlacklist(token) {
    const blacklistedToken = await Blacklist.findOne({token: token});
    if (blacklistedToken) {
        return true;
    }
    return false;
}
