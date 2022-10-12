const Schema = require('../models/tenant.schema');


// this middleware check user ownership
module.exports = async (req, res, next) => {
    const tenant = await Schema.findOne({ _id: req.params.id});

    if (!tenant) {
        return res.status(404).send({message: `Tenant with id <${req.params.id}> not exist` });
    }
    // check: user is object owner
    else if (tenant.userId !== req.user.id) {
        return res.status(403).send({message: `User is not Tenant owner`});
    }

    // if no errors:
    next();
};


