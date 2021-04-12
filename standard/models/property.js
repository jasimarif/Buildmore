const mongoose = require("mongoose")
const Schema = mongoose.Schema

const PropertySchema = new Schema({
    name: String,
    description: String,
    price: Number,
    images: [{
        url: String,
        filename: String
    
    }],
    location: String
})


module.exports = mongoose.model('Property', PropertySchema)
