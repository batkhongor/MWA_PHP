const mongoose = require("mongoose");

const locationSchema = mongoose.Schema({
    "street" : String,
    "city": String,
    "country": String,
    "zipcode": {
        type: Number,
        min:    1,
        max: 99950,
    }
});

mongoose.model(process.env.LOCATION_MODEL, locationSchema, process.env.LOCATION_COLLECTION);

module.exports = locationSchema;