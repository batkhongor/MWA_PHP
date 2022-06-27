const express =  require("express");
const router = express.Router();

const restaurantsController = require("../controllers/restaurant");


router.route("/restaurants")
    .get(restaurantsController.getRestuarants)
    .post(restaurantsController.addOne);

router.route("/restaurants/:id")
    .get(restaurantsController.getById)
    .put(restaurantsController.updateById)
    .delete(restaurantsController.deleteById);

router.route("/restaurants/:id/locations")
    .get(restaurantsController.getLocations)
    .post(restaurantsController.addLocation);

router.route("/restaurants/:restaurantId/locations/:locationId")
    .get(restaurantsController.findLocationById)
    .delete(restaurantsController.deleteLocationById);

module.exports = router;
