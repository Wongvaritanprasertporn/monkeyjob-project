require('dotenv').config();

const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const db = {
    mongoose: mongoose,
    url: process.env.DB_URL,
    admin: require("./admin.model.js")(mongoose),
    users: require("./users.model.js")(mongoose),
    tokens: require("./tokens.model.js")(mongoose),
    jobs: require("./jobs.model.js")(mongoose),
    applications: require("./applications.model.js")(mongoose),
    conversation: require("./conversation.model.js")(mongoose),
    messages: require("./messages.model.js")(mongoose),
    industries: require("./industries.model.js")(mongoose)
};

module.exports = db;