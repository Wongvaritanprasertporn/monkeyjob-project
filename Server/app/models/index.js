require('dotenv').config();

const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const db = {};
db.mongoose = mongoose;
db.url = process.env.DB_URL;
db.admin = require("./admin.model.js")(mongoose);
db.users = require("./users.model.js")(mongoose);
db.tokens = require("./tokens.model.js")(mongoose);
db.jobs = require("./jobs.model.js")(mongoose);
db.applications = require("./applications.model.js")(mongoose);
db.conversation = require("./conversation.model.js")(mongoose);
db.messages = require("./messages.model.js")(mongoose);
db.industries = require("./industries.model.js")(mongoose);

module.exports = db;