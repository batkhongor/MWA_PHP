const mongoose= require("mongoose");
const locationSchema = require("./locations");

const restaurantSchema= mongoose.Schema({
    "name": {
        type: String,
        required: true
    },
    "yearEstablished": {
        type: Number,
        min: 0,
        max: 2100,
    },
    "country": String,
    "locations": [locationSchema]
});

mongoose.model(process.env.RESTAURANT_MODEL, restaurantSchema, process.env.RESTAURANT_COLLECTION);
