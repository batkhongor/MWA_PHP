const mongoose= require("mongoose");
let Restaurant= mongoose.model(process.env.RESTAURANT_MODEL);

const getRestuarants = function(req, res){
    
    let offset= 0;
    let count= 5;

    if (req.query && req.query.offset) {
        offset= parseInt(req.query.offset, 10);
    }

    if (req.query && req.query.count) {
        count= parseInt(req.query.count, 10);
    }

    Restaurant.find().skip(offset).limit(count).exec(function(err, restaurants){

        if(err) {
            res.status(500).json(err);
        }
        res.status(200).json(restaurants);
    });
}

const getRestaurantById = function(req, res){

    var restaurantId= req.params.id;
    
    Restaurant.findById(restaurantId).exec(function(err, restaurant){

        const response= { status: 200, message: restaurant };

        if (err) {
            console.log("Error getting restaurant", err);
            response.status= 500;
            response.message= err;
        } else if(!restaurant) {
            console.log("Restaurant id not found");
            response.status= 404;
            response.message= process.env.ITEM_NOT_FOUND;
        }
        
        res.status(response.status).json(response.message);
    });
}

const getLocations = function(req, res){

    var restaurantId= req.params.id;
    
    Restaurant.findById(restaurantId).select("locations").exec(function(err, locations){
        console.log("locations for restaurant:"+locations);
        res.status(200).json(locations);
    });
}

const addOne = function (req, res) {

    const newRestaurant= {
        name: req.body.name, 
        yearEstablished: req.body.yearEstablished, 
        country: req.body.country, 
        locations: req.body.locations
    };
    Restaurant.create(newRestaurant, function(err, restaurant){
        const response= { status: 201, message: restaurant };
        if (err) {
            console.log("Error creating restaurant", err);
            response.status= 500;
            response.message= err;
        }
        res.status(response.status).json(response.message);
    });
}

const updateRestaurant = function (req, res) {

    var restaurantId= req.params.id;

    Restaurant.findByIdAndUpdate(restaurantId, req.body, {upsert: false}, function(err, restaurant) {

        const response= { status: 200, message: restaurant };

        if (err) {
            response.status= 500;
            response.message= err;
        } 

        res.status(response.status).json(response.message);
    });
}

const deleteById = function(req, res){

    var restaurantId= req.params.id;

    Restaurant.findByIdAndDelete(restaurantId).exec(function(err, restaurant){

        const response= { status: 200, message: restaurant };

        if (err) {
            console.log("Error deleting restaurant", err);
            response.status= 500;
            response.message= err;
        }
        else {
            console.log("deleted restaurant with id: "+restaurantId);
        }
        
        res.status(response.status).json(response.message);
    });
}

const addLocation = function(req , res){

    var restaurantId= req.params.id;
    
    Restaurant.findById(restaurantId).exec(function(err, restaurant){

        const response= { status: 200, message: restaurant };

        if (err) {
            console.log("Error getting restaurant", err);
            response.status= 500;
            response.message= err;
        } else if(!restaurant) {
            console.log("Restaurant id not found");
            response.status= 404;
            response.message= process.env.ITEM_NOT_FOUND;
        }

        restaurant.locations.push(req.body);

        restaurant.save(function(saveErr, saveResult) {
            if (!saveErr) {
                response.status= 200;
                response.message= saveResult;
            } else {
                response.status= 400;
                response.message= saveErr.message;
            }
        });
        
        res.status(response.status).json(response.message);
    });
}

const deleteLocationById = function(req , res){

    var restaurantId= req.params.restaurantId;
    var locationId= req.params.locationId;
    
    Restaurant.findById(restaurantId).exec(function(err, restaurant){
        console.log("restaurant by id:"+restaurant);

        const response= { status: 200, message: restaurant };

        if (err) {
            console.log("Error getting restaurant", err);
            
            response.status= 500;
            response.message= err;
        } else if(!restaurant) {
            console.log("Restaurant id not found");

            response.status= 404;
            response.message= process.env.ITEM_NOT_FOUND;
        }

        restaurant.locations.id(locationId).remove(function(remove_err, removresult) {
            if (remove_err) {
                response.status= 400;
                response.message= remove_err.message;
            }
            else {
                restaurant.markModified('locations'); 
            }
        });

        restaurant.save(function(saveErr, saveResult) {
            if (!saveErr) {
                response.status= 200;
                response.message= saveResult;
            } else {
                response.status= 400;
                response.message= saveErr.message;
            }
        });

        res.status(response.status).json(response.message);
    });
}

const findLocationById = function(req , res){

    var restaurantId= req.params.restaurantId;
    var locationId= req.params.locationId;
    console.log(restaurantId);
    
    Restaurant.findById(restaurantId).exec(function(err, restaurant){

        const response= { status: 200, message: restaurant };

        if (err) {
            console.log("Error getting restaurant", err);
            res.status(500).json(err);
        } else if(!restaurant) {
            console.log("Restaurant id not found");
            res.status(404).json(process.env.ITEM_NOT_FOUND);
        }

        let location = restaurant.locations.id(locationId);

        if(location){
            console.log("Location id not found");
            res.status(404).json(process.env.ITEM_NOT_FOUND);
        }

        res.status(400).send(location);
    });
}

module.exports = {
    getRestuarants: getRestuarants,
    getById: getRestaurantById,
    getLocations: getLocations,
    addOne: addOne,
    updateById: updateRestaurant,
    deleteById: deleteById,
    addLocation: addLocation,
    findLocationById: findLocationById,
    deleteLocationById: deleteLocationById
    //updateLocation: updateLocationById
}
