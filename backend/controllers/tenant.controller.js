const Schema = require('../models/tenant.schema');
const express = require('express');
const router = express.Router();
const getQueryObject = require('../services/getQueryObject.service')
const authorizationMiddleware = require('../middleware/authorization.middleware');

// Create and Save a new Tenant
const create = async (req, res) => {

    // Validate request
    if (!req.body.name) {
        return res.status(400).send({message: "Content can not be empty!"});
    }

    // Create a Tenant
    const tenant = new Schema({
        name: req.body.name,
        phone: req.body.phone,
        address: req.body.address,
        debt: req.body.debt,
        userId: req.user.id,
    });

    // Save Tenant in the database
    try {
        const data = await tenant.save()
        res.send(data);
    } catch (err) {
        res.status(500).send({
            message:
                err.message || "Some error occurred while creating the Tenant."
        });
    };
};

// Retrieve all Tenants from the database.
const findAll = async (req, res) => {
    const queryObj = getQueryObject(req.query, req.user.id);

    try {
        const data = await Schema.find(queryObj)
        res.send(data);
    } catch (err) {
        console.log(err);
        res.status(500).send({
            message:
                err.message || "Some error occurred while retrieving tenants."
        });
    };
};

// Find a single Tenant with an id
const findOne = async (req, res) => {
    const id = req.params.id;

    try {
        const data = await Schema.findById(id);
        res.status(200).send(data);
    } catch (err) {
        if (err.kind === 'ObjectId') {
            return res.status(404).send({message: 'tenant with ID ' + req.params.id + ' hasn\'t been found '});
        }
        res.status(500).send({message: 'error retrieving data with id ' + req.params.id});
    };
};

// Update a Tenant by the id in the request
const update = async (req, res) => {
    if (!req.body) {
        return res.status(400).send({
            message: "Data to update can not be empty!"
        });
    }
    const id = req.params.id;

    try {
        await Schema.findByIdAndUpdate(id, req.body, {useFindAndModify: false});
        res.send({message: "Tenant was updated successfully."});
    } catch (err) {
        res.status(500).send({
            message: "Error updating Tenant with id=" + id
        });
    };
};

// Delete a Tenant with the specified id in the request
const deleteOne = async (req, res) => {
    const id = req.params.id;

    try {
        await Schema.findByIdAndRemove(id, {useFindAndModify: false})
        res.send({ message: "Tenant was deleted successfully!"});
    } catch (err) {
        res.status(500).send({
            message: "Could not delete Tenant with id=" + id
        });
    };
};

// Create a new Tenant
router.post("/", create);

// Retrieve all Tenants
router.get("/", findAll);

// Update a Tenant with id
router.put("/:id", authorizationMiddleware, update);

// Delete a Tenant with id
router.delete("/:id", authorizationMiddleware, deleteOne);

// Retrieve a single Tenant with id
router.get("/:id", authorizationMiddleware, findOne);

module.exports = router;
