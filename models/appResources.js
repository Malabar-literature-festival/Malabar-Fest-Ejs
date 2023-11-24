const mongoose = require("mongoose");

const AppResourcesSchema = new mongoose.Schema(
    {
        homePageBanner: {
            type: String,
        },
        partnersAndSponsors: {
            type: String,
        },
        ticketImage: {
            type: String,
        },
        eventImage: {
            type: String,
        },
        selfieImage: {
            type: String,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("AppResources", AppResourcesSchema);
