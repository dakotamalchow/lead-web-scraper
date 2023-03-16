const mongoose = require("mongoose");

const leadSchema = new mongoose.Schema({
    representativeName: {
        type: String,
        required: true
    },
    companyName: {
        type: String
    },
    phoneNumber: {
        type: String,
        required: true
    },
    leadType: {
        type: String,
        required: true
    },
    zipCodes: [{
        type: String,
        required: true
    }]
})

module.exports = mongoose.model("Lead", leadSchema);