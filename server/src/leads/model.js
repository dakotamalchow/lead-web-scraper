const mongoose = require("mongoose");

const leadSchema = new mongoose.Schema({
    companyName: {
        type: String,
        required: true
    },
    representativeName: {
        type: String,
        required: true
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