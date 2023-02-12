const category = require("../models/category");
const restaurant = require("../models/restaurant");
const user = require("../models/user")

module.exports = {
    serviceManagementGet: async (req, res) => {
        const services = await restaurant.findById({ _id: req.session?.restaurant?.restaurantId })
        let data = {
            restaurantHeader: true,
            services: services?.services,
            restaurant: true
        }
        res.render('restaurant/services', data)
    },
    deleteServicePost: (req, res) => {
        restaurant.findByIdAndUpdate({ _id: req.session.restaurant.restaurantId }, { $pull: { "services": { "_id": req.params.service_id } } }).then((result) => {
            // if(result.modifie)
            console.log(result);
            res.json({ status: true, message: "deleted success fully" })
        })
    }
}