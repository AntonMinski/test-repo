const mongoose = require("mongoose");

module.exports = mongoose.model(
    "Blacklist",
    new mongoose.Schema(
        {
            token: {
                type: String,
                required: true,
            },
        },
    ),
    // collection
    'blacklist',
);
